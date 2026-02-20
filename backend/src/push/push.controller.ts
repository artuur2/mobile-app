import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { SubscriptionService } from '../subscription/subscription.service';
import { NextRetentionCampaignQueryDto, RegisterPushDeviceDto } from './dto';
import { PushService } from './push.service';

@ApiTags('push')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('push')
export class PushController {
  constructor(
    private readonly pushService: PushService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('devices/register')
  registerDevice(@CurrentUser() user: { userId: string }, @Body() dto: RegisterPushDeviceDto) {
    return this.pushService.registerDevice({
      userId: user.userId,
      token: dto.token,
      platform: dto.platform,
      timezone: dto.timezone,
      locale: dto.locale,
    });
  }

  @Get('retention/next')
  async getNextRetentionCampaign(
    @CurrentUser() user: { userId: string },
    @Query() query: NextRetentionCampaignQueryDto,
  ) {
    const status = await this.subscriptionService.getStatus(user.userId);

    return this.pushService.getNextCampaign({
      plan: status.plan,
      state: query.state,
    });
  }
}
