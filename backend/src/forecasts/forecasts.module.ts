import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ForecastsController } from './forecasts.controller';

@Module({
  imports: [SubscriptionModule],
  controllers: [ForecastsController],
})
export class ForecastsModule {}
