import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>(
            'DATABASE_URL',
            'postgresql://astrology:astrology@localhost:5432/astrology?schema=public',
          ),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ensureDemoUser();
  }

  private async ensureDemoUser() {
    const existing = await this.user.findUnique({ where: { email: 'demo@astrology.app' } });
    if (existing) {
      return;
    }

    await this.user.create({
      data: {
        email: 'demo@astrology.app',
        passwordHash: await hash('demo1234', 10),
        name: 'Demo User',
        plan: 'free',
      },
    });
  }
}
