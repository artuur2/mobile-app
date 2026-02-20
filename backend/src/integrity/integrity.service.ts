import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';

interface VerifyOptions {
  userId: string;
  provider: 'play_integrity' | 'safetynet';
  basicIntegrity: boolean;
  deviceIntegrity: boolean;
  strongIntegrity?: boolean;
  recentFailedAttempts?: number;
  tokenSnippet?: string;
}

@Injectable()
export class IntegrityService {
  constructor(private readonly db: DatabaseService) {}

  async verify(options: VerifyOptions) {
    const failedAttempts = options.recentFailedAttempts ?? 0;

    let riskScore = 0;
    if (!options.basicIntegrity) riskScore += 40;
    if (!options.deviceIntegrity) riskScore += 40;
    if (options.strongIntegrity === false) riskScore += 20;
    if (failedAttempts > 0) riskScore += Math.min(20, failedAttempts * 2);

    const boundedRisk = Math.min(100, riskScore);
    const decision = boundedRisk >= 70 ? 'block' : boundedRisk >= 40 ? 'review' : 'allow';

    await this.db.$executeRaw`
      INSERT INTO integrity_checks (
        id,
        "userId",
        provider,
        "riskScore",
        decision,
        "basicIntegrity",
        "deviceIntegrity",
        "strongIntegrity",
        "tokenSnippet",
        "checkedAt"
      )
      VALUES (
        ${randomUUID()},
        ${options.userId},
        ${options.provider},
        ${boundedRisk},
        ${decision},
        ${options.basicIntegrity},
        ${options.deviceIntegrity},
        ${options.strongIntegrity ?? null},
        ${options.tokenSnippet ?? null},
        NOW()
      )
    `;

    return {
      provider: options.provider,
      riskScore: boundedRisk,
      decision,
      reasons: {
        basicIntegrity: options.basicIntegrity,
        deviceIntegrity: options.deviceIntegrity,
        strongIntegrity: options.strongIntegrity ?? null,
        recentFailedAttempts: failedAttempts,
      },
      checkedAt: new Date().toISOString(),
    };
  }
}
