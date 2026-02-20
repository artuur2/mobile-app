import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
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
  async getProfile(@CurrentUser() user: { userId: string }) {
    const record = await this.db.user.findUnique({ where: { id: user.userId } });
    if (!record) {
      throw new NotFoundException('User not found');
    }

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      plan: record.plan,
    };
  }
}
