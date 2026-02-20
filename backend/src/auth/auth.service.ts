import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
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

    await this.db.user.update({
      where: { id: user.id },
      data: { refreshToken: this.hashToken(refreshToken) },
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify<{ sub: string }>(refreshToken);
    const user = await this.db.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenHash = this.hashToken(refreshToken);
    if (user.refreshToken !== refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const revoked = await this.db.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM revoked_refresh_tokens
      WHERE "tokenHash" = ${refreshTokenHash}
      LIMIT 1
    `;

    if (revoked.length > 0) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const newAccessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '30d' });
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    await this.db.$transaction([
      this.db.$executeRaw`
        INSERT INTO revoked_refresh_tokens (id, "tokenHash", "userId", reason, "revokedAt")
        VALUES (${randomUUID()}, ${refreshTokenHash}, ${user.id}, 'rotated', NOW())
      `,
      this.db.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshTokenHash } }),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: 900 };
  }

  async logout(userId: string, refreshToken: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const tokenHash = this.hashToken(refreshToken);

    if (user.refreshToken !== tokenHash) {
      return { success: true };
    }

    await this.db.$transaction([
      this.db.$executeRaw`
        INSERT INTO revoked_refresh_tokens (id, "tokenHash", "userId", reason, "revokedAt")
        VALUES (${randomUUID()}, ${tokenHash}, ${user.id}, 'logout', NOW())
        ON CONFLICT ("tokenHash") DO NOTHING
      `,
      this.db.user.update({ where: { id: user.id }, data: { refreshToken: null } }),
    ]);

    return { success: true };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
