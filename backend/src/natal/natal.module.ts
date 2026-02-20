import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NatalController } from './natal.controller';
import { NatalService } from './natal.service';

@Module({
  imports: [SubscriptionModule],
  controllers: [NatalController],
  providers: [NatalService],
})
export class NatalModule {}
