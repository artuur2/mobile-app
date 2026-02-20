import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NatalController } from './natal.controller';

@Module({
  imports: [SubscriptionModule],
  controllers: [NatalController],
})
export class NatalModule {}
