import { MeditationsService } from './meditations.service';

describe('MeditationsService', () => {
  const service = new MeditationsService();

  it('returns max 5 free items and locked premium teasers', () => {
    const result = service.list({ plan: 'free' });

    expect(result.plan).toBe('free');
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.items.every((item) => item.premiumOnly === false)).toBe(true);
    expect(result.locked.length).toBeGreaterThan(0);
  });

  it('prioritizes tracks matching user state', () => {
    const result = service.list({ plan: 'premium', state: 'sleep', limit: 3 });

    expect(result.items.length).toBe(3);
    expect(result.items[0].states.includes('sleep')).toBe(true);
  });

  it('returns empty locked list for premium users', () => {
    const result = service.list({ plan: 'premium', limit: 20 });

    expect(result.items.length).toBe(8);
    expect(result.locked).toEqual([]);
  });
});
