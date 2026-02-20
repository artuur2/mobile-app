import { IntegrityService } from './integrity.service';

describe('IntegrityService', () => {
  const executeRaw = jest.fn().mockResolvedValue(1);
  const service = new IntegrityService({ $executeRaw: executeRaw } as never);

  beforeEach(() => {
    executeRaw.mockClear();
  });

  it('returns allow for clean integrity signals', async () => {
    const result = await service.verify({
      userId: 'u1',
      provider: 'play_integrity',
      basicIntegrity: true,
      deviceIntegrity: true,
      strongIntegrity: true,
    });

    expect(result.decision).toBe('allow');
    expect(result.riskScore).toBe(0);
    expect(executeRaw).toHaveBeenCalled();
  });

  it('returns review for mixed signals', async () => {
    const result = await service.verify({
      userId: 'u1',
      provider: 'play_integrity',
      basicIntegrity: true,
      deviceIntegrity: false,
      recentFailedAttempts: 2,
    });

    expect(result.decision).toBe('review');
    expect(result.riskScore).toBeGreaterThanOrEqual(40);
  });

  it('returns block for high risk signals', async () => {
    const result = await service.verify({
      userId: 'u1',
      provider: 'safetynet',
      basicIntegrity: false,
      deviceIntegrity: false,
      strongIntegrity: false,
      recentFailedAttempts: 10,
    });

    expect(result.decision).toBe('block');
    expect(result.riskScore).toBeGreaterThanOrEqual(70);
  });
});
