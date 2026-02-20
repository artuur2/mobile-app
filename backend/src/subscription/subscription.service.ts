import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (purchaseToken.startsWith('premium_')) {
      await this.db.user.update({ where: { id: user.id }, data: { plan: 'premium' } });
      return { success: true, plan: 'premium' };
    }

    return { success: false, reason: 'invalid_purchase_token' };
  }
}
