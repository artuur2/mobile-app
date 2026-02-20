import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '30d' });

    await this.db.user.update({ where: { id: user.id }, data: { refreshToken } });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify<{ sub: string }>(refreshToken);
    const user = await this.db.user.findUnique({ where: { id: payload.sub } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    return { accessToken, expiresIn: 900 };
  }
}
