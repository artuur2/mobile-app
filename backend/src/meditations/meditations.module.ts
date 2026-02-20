import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  imports: [SubscriptionModule],
  controllers: [MeditationsController],
  providers: [MeditationsService],
})
export class MeditationsModule {}
