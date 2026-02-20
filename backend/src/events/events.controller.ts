import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  @Post('track')
  track(@CurrentUser() user: { userId: string }, @Body() body: Record<string, unknown>) {
    return {
      accepted: true,
      userId: user.userId,
      eventType: body.type ?? 'unknown',
      receivedAt: new Date().toISOString(),
    };
  }
}
