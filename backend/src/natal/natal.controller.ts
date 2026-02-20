import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';

@ApiTags('natal-chart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('natal-chart')
export class NatalController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getNatalChart(@CurrentUser() user: { userId: string }) {
    const status = this.subscriptionService.getStatus(user.userId);

    return {
      sunSign: 'Leo',
      moonSign: 'Pisces',
      rising: 'Scorpio',
      interpretation:
        status.plan === 'premium'
          ? 'Expanded natal interpretation with house and aspect breakdown.'
          : 'Basic natal chart summary. Upgrade for full interpretation.',
    };
  }
}
