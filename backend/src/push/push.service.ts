import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';

export interface CampaignTemplate {
  id: string;
  title: string;
  message: string;
  deepLink: string;
  minPlan: 'free' | 'premium';
  states: Array<'stress' | 'focus' | 'sleep' | 'energy' | 'love' | 'anxiety'>;
}

@Injectable()
export class PushService {
  constructor(private readonly db: DatabaseService) {}

  private readonly campaigns: CampaignTemplate[] = [
    {
      id: 'ret_morning_focus',
      title: 'Утренний фокус дня',
      message: 'Новый дневной прогноз уже готов. Откройте и начните день осознанно.',
      deepLink: 'astrology://forecasts/day?topic=career',
      minPlan: 'free',
      states: ['focus', 'energy'],
    },
    {
      id: 'ret_sleep_reset',
      title: 'Вечерняя перезагрузка',
      message: 'Подберите медитацию для сна и восстановите энергию на завтра.',
      deepLink: 'astrology://meditations?state=sleep',
      minPlan: 'free',
      states: ['sleep', 'anxiety'],
    },
    {
      id: 'ret_love_alignment',
      title: 'Гармония в отношениях',
      message: 'Ваша натальная совместимость обновлена — посмотрите акценты на отношения.',
      deepLink: 'astrology://natal-chart?focus=love',
      minPlan: 'premium',
      states: ['love', 'stress'],
    },
  ];

  async registerDevice(options: {
    userId: string;
    token: string;
    platform: 'android' | 'ios';
    timezone?: string;
    locale?: string;
  }) {
    const tokenHash = createHash('sha256').update(options.token).digest('hex');

    await this.db.$executeRaw`
      INSERT INTO push_devices (id, "userId", platform, "tokenHash", timezone, locale, "isActive", "updatedAt")
      VALUES (
        ${randomUUID()},
        ${options.userId},
        ${options.platform},
        ${tokenHash},
        ${options.timezone ?? null},
        ${options.locale ?? null},
        true,
        NOW()
      )
      ON CONFLICT ("userId", platform, "tokenHash")
      DO UPDATE SET
        timezone = EXCLUDED.timezone,
        locale = EXCLUDED.locale,
        "isActive" = true,
        "updatedAt" = NOW()
    `;

    return {
      registered: true,
      platform: options.platform,
      tokenHash,
    };
  }

  getNextCampaign(options: {
    plan: 'free' | 'premium';
    state?: 'stress' | 'focus' | 'sleep' | 'energy' | 'love' | 'anxiety';
  }) {
    const { plan, state } = options;

    const accessible = this.campaigns.filter(
      (campaign) => plan === 'premium' || campaign.minPlan === 'free',
    );

    const sorted = accessible.sort((a, b) => {
      const aScore = state && a.states.includes(state) ? 1 : 0;
      const bScore = state && b.states.includes(state) ? 1 : 0;
      return bScore - aScore;
    });

    const campaign = sorted[0];

    return {
      state: state ?? null,
      plan,
      campaign,
      generatedAt: new Date().toISOString(),
    };
  }
}
