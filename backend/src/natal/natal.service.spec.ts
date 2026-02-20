import { NatalService } from './natal.service';

describe('NatalService', () => {
  const service = new NatalService();

  it('returns compact response for free plan', () => {
    const result = service.getChart({ plan: 'free', focus: 'love' });

    expect(result.tier).toBe('free');
    expect(result.focus).toBe('love');
    expect(result).toHaveProperty('upgradeHint');
    expect(result).not.toHaveProperty('houses');
    expect(result).not.toHaveProperty('aspects');
  });

  it('returns detailed response for premium plan', () => {
    const result = service.getChart({ plan: 'premium', focus: 'career' });

    expect(result.tier).toBe('premium');
    expect(result.focus).toBe('career');
    expect(result).toHaveProperty('houses');
    expect(result).toHaveProperty('aspects');
    expect(result).toHaveProperty('recommendation');
  });

  it('uses general focus by default', () => {
    const result = service.getChart({ plan: 'free' });
    expect(result.focus).toBe('general');
  });
});
