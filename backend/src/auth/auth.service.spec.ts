import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const mockCompare = compare as jest.MockedFunction<typeof compare>;

  const db = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
    $transaction: jest.fn(),
  } as any;

  const jwt = {
    sign: jest.fn(),
    verify: jest.fn(),
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(db, jwt);
  });

  it('login stores hashed refresh token and returns token pair', async () => {
    db.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'demo@astrology.app',
      passwordHash: 'hash',
    });
    mockCompare.mockResolvedValue(true as never);
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await service.login({ email: 'demo@astrology.app', password: 'demo1234' });

    expect(db.user.update).toHaveBeenCalledTimes(1);
    expect(db.user.update.mock.calls[0][0].data.refreshToken).toHaveLength(64);
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token', expiresIn: 900 });
  });

  it('refresh rotates refresh token and revokes old one', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1' });
    db.user.findUnique.mockResolvedValue({
      id: 'u1',
      refreshToken: '93dd6d39cf0a73f62182459fbcbbd0dfaa9974b15193ad5b609fe181f7b0c6fa',
    });
    db.$queryRaw.mockResolvedValue([]);
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('new-access')
      .mockReturnValueOnce('new-refresh');
    db.$transaction.mockResolvedValue(undefined);

    const result = await service.refresh('old-refresh');

    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh', expiresIn: 900 });
  });

  it('refresh throws when token already revoked', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1' });
    db.user.findUnique.mockResolvedValue({
      id: 'u1',
      refreshToken: '93dd6d39cf0a73f62182459fbcbbd0dfaa9974b15193ad5b609fe181f7b0c6fa',
    });
    db.$queryRaw.mockResolvedValue([{ id: 'revoked-id' }]);

    await expect(service.refresh('old-refresh')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
