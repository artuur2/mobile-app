import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';

@ApiTags('meditations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meditations')
export class MeditationsController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async list(@CurrentUser() user: { userId: string }) {
    const status = await this.subscriptionService.getStatus(user.userId);
    const all = [
      { id: 'm1', title: 'Grounding', durationSec: 420 },
      { id: 'm2', title: 'Focus', durationSec: 600 },
      { id: 'm3', title: 'Energy Reset', durationSec: 480 },
      { id: 'm4', title: 'Sleep Deep', durationSec: 900 },
      { id: 'm5', title: 'Heart Space', durationSec: 720 },
      { id: 'm6', title: 'Breath Control', durationSec: 300 },
    ];

    return status.plan === 'premium' ? all : all.slice(0, 5);
  }
}
