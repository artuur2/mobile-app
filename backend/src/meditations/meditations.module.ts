import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MeditationsController } from './meditations.controller';

@Module({
  imports: [SubscriptionModule],
  controllers: [MeditationsController],
})
export class MeditationsModule {}
