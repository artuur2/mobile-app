import { PushService } from './push.service';

describe('PushService', () => {
  const service = new PushService({} as never);

  it('returns free-accessible campaign for free users', () => {
    const result = service.getNextCampaign({ plan: 'free', state: 'focus' });

    expect(result.plan).toBe('free');
    expect(result.campaign.minPlan).toBe('free');
  });

  it('can return premium campaign for premium users', () => {
    const result = service.getNextCampaign({ plan: 'premium', state: 'love' });

    expect(result.plan).toBe('premium');
    expect(result.campaign.id).toBe('ret_love_alignment');
  });

  it('returns state=null when not provided', () => {
    const result = service.getNextCampaign({ plan: 'free' });

    expect(result.state).toBeNull();
    expect(result.campaign).toBeDefined();
  });
});
