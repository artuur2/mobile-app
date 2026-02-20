import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { HealthModule } from './health/health.module';
import { MeditationsModule } from './meditations/meditations.module';
import { NatalModule } from './natal/natal.module';
import { ProfileModule } from './profile/profile.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    DatabaseModule,
    HealthModule,
    AuthModule,
    ProfileModule,
    SubscriptionModule,
    ForecastsModule,
    NatalModule,
    MeditationsModule,
    EventsModule,
  ],
})
export class AppModule {}
