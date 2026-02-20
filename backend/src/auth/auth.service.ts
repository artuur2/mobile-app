import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  login(dto: LoginDto) {
    const user = this.db.findUserByEmail(dto.email);
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '30d' });

    this.db.updateUser({ ...user, refreshToken });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  refresh(refreshToken: string) {
    const payload = this.jwtService.verify<{ sub: string }>(refreshToken);
    const user = this.db.findUserById(payload.sub);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    return { accessToken, expiresIn: 900 };
  }
}
