export type Plan = 'free' | 'premium';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  plan: Plan;
  refreshToken?: string;
}
