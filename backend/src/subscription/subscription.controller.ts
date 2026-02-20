import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from './subscription.service';

@ApiTags('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('status')
  status(@CurrentUser() user: { userId: string }) {
    return this.subscriptionService.getStatus(user.userId);
  }

  @Post('google/verify')
  verify(
    @CurrentUser() user: { userId: string },
    @Body('purchaseToken') purchaseToken: string,
  ) {
    return this.subscriptionService.verifyGooglePurchase(user.userId, purchaseToken);
  }
}
