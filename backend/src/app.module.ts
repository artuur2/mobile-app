import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { MeditationsModule } from './meditations/meditations.module';
import { NatalModule } from './natal/natal.module';
import { ProfileModule } from './profile/profile.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { LoggingInterceptor } from './common/logging.interceptor';
import { RequestIdMiddleware } from './common/request-id.middleware';

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
  providers: [LoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
