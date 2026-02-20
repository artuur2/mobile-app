import { Injectable } from '@nestjs/common';

const focusCopy: Record<string, { free: string; premium: string; recommendation: string }> = {
  general: {
    free: 'Strong intuitive baseline with steady personal growth trend.',
    premium:
      'Your chart shows high emotional intelligence in water houses and a leadership arc through solar placements.',
    recommendation: 'Start each morning with a 5-minute intention ritual and evening reflection.',
  },
  love: {
    free: 'Relationship axis is active; prioritize honest communication this week.',
    premium:
      'Venus-Moon harmony supports emotional bonding, while a Saturn aspect asks for clear boundaries and long-term alignment.',
    recommendation: 'Schedule one intentional conversation and avoid reactive texting during stress spikes.',
  },
  career: {
    free: 'Career sector favors structured execution over rapid pivots.',
    premium:
      'A strong 10th house emphasis and Mercury support indicate progress through strategic communication and focused planning.',
    recommendation: 'Block 90-minute deep-work windows and pitch one high-impact idea this cycle.',
  },
  energy: {
    free: 'Energy fluctuates; anchor the day with consistent routines.',
    premium:
      'Mars dynamics suggest short bursts of high output; recovery quality directly impacts clarity and decision speed.',
    recommendation: 'Use interval work blocks and protect sleep quality for sustained momentum.',
  },
};

@Injectable()
export class NatalService {
  getChart(options: { plan: 'free' | 'premium'; focus?: 'general' | 'love' | 'career' | 'energy' }) {
    const focus = options.focus ?? 'general';
    const copy = focusCopy[focus];

    const base = {
      sunSign: 'Leo',
      moonSign: 'Pisces',
      rising: 'Scorpio',
      focus,
    };

    if (options.plan === 'free') {
      return {
        ...base,
        tier: 'free',
        interpretation: copy.free,
        upgradeHint: 'Unlock houses, aspects and actionable recommendations with premium.',
      };
    }

    return {
      ...base,
      tier: 'premium',
      interpretation: copy.premium,
      houses: [
        { house: 1, theme: 'Identity', note: 'Magnetic self-expression and resilience.' },
        { house: 7, theme: 'Partnerships', note: 'High potential for emotionally deep bonds.' },
        { house: 10, theme: 'Career', note: 'Recognition comes via strategic consistency.' },
      ],
      aspects: [
        { name: 'Sun trine Jupiter', effect: 'Confidence and growth opportunities.' },
        { name: 'Moon sextile Venus', effect: 'Warmth, empathy and relationship harmony.' },
        { name: 'Mars square Saturn', effect: 'Pacing and discipline are essential.' },
      ],
      recommendation: copy.recommendation,
    };
  }
}
