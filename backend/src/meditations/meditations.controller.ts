import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';
import { ListMeditationsQueryDto } from './dto';
import { MeditationsService } from './meditations.service';

@ApiTags('meditations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meditations')
export class MeditationsController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly meditationsService: MeditationsService,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: { userId: string },
    @Query() query: ListMeditationsQueryDto,
  ) {
    const status = await this.subscriptionService.getStatus(user.userId);

    return this.meditationsService.list({
      plan: status.plan,
      state: query.state,
      limit: query.limit,
    });
  }
}
