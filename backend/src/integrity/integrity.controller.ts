import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { VerifyIntegrityDto } from './dto';
import { IntegrityService } from './integrity.service';

@ApiTags('integrity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrity')
export class IntegrityController {
  constructor(private readonly integrityService: IntegrityService) {}

  @Post('verify')
  verify(@CurrentUser() user: { userId: string }, @Body() dto: VerifyIntegrityDto) {
    return this.integrityService.verify({
      userId: user.userId,
      provider: dto.provider,
      basicIntegrity: dto.basicIntegrity,
      deviceIntegrity: dto.deviceIntegrity,
      strongIntegrity: dto.strongIntegrity,
      recentFailedAttempts: dto.recentFailedAttempts,
      tokenSnippet: dto.tokenSnippet,
    });
  }
}
