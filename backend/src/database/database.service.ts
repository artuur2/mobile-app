import { Injectable } from '@nestjs/common';
import { UserRecord } from '../common/types';

@Injectable()
export class DatabaseService {
  private users: UserRecord[] = [
    {
      id: 'u1',
      email: 'demo@astrology.app',
      password: 'demo1234',
      name: 'Demo User',
      plan: 'free',
    },
  ];

  findUserByEmail(email: string): UserRecord | undefined {
    return this.users.find((user) => user.email === email);
  }

  findUserById(id: string): UserRecord | undefined {
    return this.users.find((user) => user.id === id);
  }

  updateUser(user: UserRecord): UserRecord {
    this.users = this.users.map((item) => (item.id === user.id ? user : item));
    return user;
  }
}
