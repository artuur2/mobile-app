import { Injectable } from '@nestjs/common';

export interface MeditationItem {
  id: string;
  title: string;
  durationSec: number;
  states: string[];
  premiumOnly: boolean;
  audioUrl: string;
}

@Injectable()
export class MeditationsService {
  private readonly catalog: MeditationItem[] = [
    {
      id: 'm1',
      title: 'Grounding Breath',
      durationSec: 420,
      states: ['stress', 'anxiety'],
      premiumOnly: false,
      audioUrl: 'https://cdn.astrology.app/meditations/m1.mp3',
    },
    {
      id: 'm2',
      title: 'Deep Focus Session',
      durationSec: 600,
      states: ['focus', 'energy'],
      premiumOnly: false,
      audioUrl: 'https://cdn.astrology.app/meditations/m2.mp3',
    },
    {
      id: 'm3',
      title: 'Energy Reset',
      durationSec: 480,
      states: ['energy', 'stress'],
      premiumOnly: false,
      audioUrl: 'https://cdn.astrology.app/meditations/m3.mp3',
    },
    {
      id: 'm4',
      title: 'Sleep Deep Recovery',
      durationSec: 900,
      states: ['sleep', 'anxiety'],
      premiumOnly: false,
      audioUrl: 'https://cdn.astrology.app/meditations/m4.mp3',
    },
    {
      id: 'm5',
      title: 'Heart Space',
      durationSec: 720,
      states: ['love', 'stress'],
      premiumOnly: false,
      audioUrl: 'https://cdn.astrology.app/meditations/m5.mp3',
    },
    {
      id: 'm6',
      title: 'Moon Calm: Anxiety Relief',
      durationSec: 540,
      states: ['anxiety', 'sleep'],
      premiumOnly: true,
      audioUrl: 'https://cdn.astrology.app/meditations/m6.mp3',
    },
    {
      id: 'm7',
      title: 'Solar Confidence Boost',
      durationSec: 660,
      states: ['energy', 'focus'],
      premiumOnly: true,
      audioUrl: 'https://cdn.astrology.app/meditations/m7.mp3',
    },
    {
      id: 'm8',
      title: 'Relationship Harmony Flow',
      durationSec: 780,
      states: ['love', 'stress'],
      premiumOnly: true,
      audioUrl: 'https://cdn.astrology.app/meditations/m8.mp3',
    },
  ];

  list(options: { plan: 'free' | 'premium'; state?: string; limit?: number }) {
    const { plan, state, limit = 10 } = options;

    const ranked = this.catalog
      .map((item) => ({
        ...item,
        relevance: state && item.states.includes(state) ? 2 : 1,
      }))
      .sort((a, b) => b.relevance - a.relevance);

    const available =
      plan === 'premium' ? ranked : ranked.filter((item) => !item.premiumOnly).slice(0, 5);

    const items = available.slice(0, limit).map(({ relevance: _relevance, ...item }) => item);
    const locked =
      plan === 'free'
        ? ranked
            .filter((item) => item.premiumOnly)
            .slice(0, 3)
            .map((item) => ({ id: item.id, title: item.title }))
        : [];

    return {
      plan,
      state: state ?? null,
      totalAvailable: available.length,
      items,
      locked,
    };
  }
}
