# Mobile App Monorepo (Kickstart)

Старт разработки выполнен с упором на **продуктовый backend**, готовый к масштабированию.

## Что уже реализовано
- NestJS API с модульной структурой (`auth`, `subscription`, `forecasts`, `natal-chart`, `meditations`, `events`, `push`, `integrity`, `profile`, `health`).
- PostgreSQL data layer через Prisma (`User`, `Plan`) вместо in-memory хранилища.
- Prisma SQL migration baseline + `prisma migrate deploy` для repeatable DB rollout.
- JWT access/refresh flow (короткоживущий access token).
- Базовый server-side entitlement check (free/premium) в ключевых endpoint.
- Idempotent обработка `POST /subscription/google/verify` с записью hash purchase token в БД.
- Security baseline: helmet, валидация входных DTO, глобальный rate limit.
- Health endpoints: `/api/health/live`, `/api/health/ready`.
- Structured request logging + `x-request-id` correlation for observability baseline.
- Unified API error envelope (global exception filter) с `requestId` для быстрого трейсинга ошибок.
- Swagger (`/docs`) для синхронизации backend + Android команды.
- Медитации: paywall-aware каталог с персонализацией по состоянию (`state`) и лимитами free/premium.
- Натальная карта: интерпретации с фокусом (`general/love/career/energy`) и расширенной детализацией домов/аспектов для premium.
- Push/retention: регистрация push device token и подбор следующей retention-кампании по состоянию пользователя.
- Device integrity/anti-fraud baseline: endpoint проверки сигналов устройства с risk score и policy decision (`allow/review/block`).
- Docker Compose с PostgreSQL и Redis для локальной среды и дальнейшего scale-out.

## Быстрый старт
```bash
cd backend
npm install
npm run prisma:migrate:deploy
npm run prisma:generate
npm run start:dev
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/docs`

Demo user:
- email: `demo@astrology.app`
- password: `demo1234`

## Production hardening (next)
1. Вынести purchase validation в асинхронный workflow (queue + retries + idempotency key).
2. Добавить Play Integrity/SafetyNet и anti-fraud risk scoring.
3. Расширить observability до OpenTelemetry + Prometheus/Grafana.
4. Разделить домены на сервисы (`api-gateway`, `billing`, `content/forecast-engine`) при росте нагрузки.
