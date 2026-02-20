import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../common/auth';
import { DatabaseService } from '../database/database.service';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  getProfile(@CurrentUser() user: { userId: string }) {
    const record = this.db.findUserById(user.userId);

    return {
      id: record?.id,
      email: record?.email,
      name: record?.name,
      plan: record?.plan,
    };
  }
}
