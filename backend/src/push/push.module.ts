import { Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PushController } from './push.controller';
import { PushService } from './push.service';

@Module({
  imports: [SubscriptionModule],
  controllers: [PushController],
  providers: [PushService],
})
export class PushModule {}
