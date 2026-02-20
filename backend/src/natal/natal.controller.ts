import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';
import { GetNatalChartQueryDto } from './dto';
import { NatalService } from './natal.service';

@ApiTags('natal-chart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('natal-chart')
export class NatalController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly natalService: NatalService,
  ) {}

  @Get()
  async getNatalChart(
    @CurrentUser() user: { userId: string },
    @Query() query: GetNatalChartQueryDto,
  ) {
    const status = await this.subscriptionService.getStatus(user.userId);

    return this.natalService.getChart({
      plan: status.plan,
      focus: query.focus,
    });
  }
}
