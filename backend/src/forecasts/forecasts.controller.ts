import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';

const periods = ['day', '3days', 'week', 'month'] as const;

@ApiTags('forecasts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forecasts')
export class ForecastsController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getForecast(
    @CurrentUser() user: { userId: string },
    @Query('period') period: string,
    @Query('topic') topic: string,
  ) {
    if (!periods.includes(period as (typeof periods)[number])) {
      throw new BadRequestException('Unsupported period');
    }

    const status = this.subscriptionService.getStatus(user.userId);
    if (status.plan === 'free' && period !== 'day') {
      throw new BadRequestException('Upgrade required for this period');
    }

    return {
      period,
      topic: topic || 'general',
      plan: status.plan,
      generatedAt: new Date().toISOString(),
      text:
        status.plan === 'premium'
          ? 'Premium forecast with expanded interpretation and detailed recommendations.'
          : 'Daily base forecast available on free plan.',
    };
  }
}
