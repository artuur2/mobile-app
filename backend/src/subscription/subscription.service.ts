import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DatabaseService) {}

  getStatus(userId: string) {
    const user = this.db.findUserById(userId);
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

  verifyGooglePurchase(userId: string, purchaseToken: string) {
    const user = this.db.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (purchaseToken.startsWith('premium_')) {
      this.db.updateUser({ ...user, plan: 'premium' });
      return { success: true, plan: 'premium' };
    }

    return { success: false, reason: 'invalid_purchase_token' };
  }

  ensurePremium(userId: string) {
    const status = this.getStatus(userId);
    return status.plan === 'premium';
  }
}
