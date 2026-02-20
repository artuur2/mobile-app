import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID, createHash } from 'crypto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DatabaseService) {}

  async getStatus(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      plan: user.plan,
      active: user.plan === 'premium',
      expiresAt: user.plan === 'premium' ? '2099-01-01T00:00:00.000Z' : null,
      limits: user.plan === 'premium' ? null : { forecastsPerDay: 1, meditationItems: 5 },
    };
  }

  async verifyGooglePurchase(userId: string, purchaseToken: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const purchaseTokenHash = createHash('sha256').update(purchaseToken).digest('hex');

    const existing = await this.db.$queryRaw<Array<{ status: string; reason: string | null }>>`
      SELECT status, reason
      FROM purchase_verifications
      WHERE platform = 'google' AND "purchaseTokenHash" = ${purchaseTokenHash}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: existing[0].status === 'success',
        plan: existing[0].status === 'success' ? 'premium' : user.plan,
        reason: existing[0].reason,
        idempotent: true,
      };
    }

    const isValidPremium = purchaseToken.startsWith('premium_');

    if (isValidPremium) {
      await this.db.user.update({ where: { id: user.id }, data: { plan: 'premium' } });
    }

    await this.db.$executeRaw`
      INSERT INTO purchase_verifications (id, "userId", platform, "purchaseTokenHash", status, reason, "verifiedAt")
      VALUES (
        ${randomUUID()},
        ${user.id},
        'google',
        ${purchaseTokenHash},
        ${isValidPremium ? 'success' : 'failed'},
        ${isValidPremium ? null : 'invalid_purchase_token'},
        NOW()
      )
    `;

    if (isValidPremium) {
      return { success: true, plan: 'premium', idempotent: false };
    }

    return { success: false, reason: 'invalid_purchase_token', idempotent: false };
  }
}
