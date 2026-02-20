# Mobile App Monorepo (Kickstart)

Старт разработки выполнен с упором на **продуктовый backend**, готовый к масштабированию.

## Что уже реализовано
- NestJS API с модульной структурой (`auth`, `subscription`, `forecasts`, `natal-chart`, `meditations`, `events`, `profile`).
- PostgreSQL data layer через Prisma (`User`, `Plan`) вместо in-memory хранилища.
- JWT access/refresh flow (короткоживущий access token).
- Базовый server-side entitlement check (free/premium) в ключевых endpoint.
- Security baseline: helmet, валидация входных DTO, глобальный rate limit.
- Swagger (`/docs`) для синхронизации backend + Android команды.
- Docker Compose с PostgreSQL и Redis для локальной среды и дальнейшего scale-out.

## Быстрый старт
```bash
cd backend
npm install
npm run prisma:generate
npm run start:dev
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/docs`

Demo user:
- email: `demo@astrology.app`
- password: `demo1234`

## Production hardening (next)
1. Добавить Prisma migrations и `migrate deploy` в CI/CD.
2. Вынести purchase validation в асинхронный workflow (queue + retries + idempotency).
3. Добавить Play Integrity/SafetyNet и anti-fraud risk scoring.
4. Подключить observability (OpenTelemetry + Prometheus/Grafana + structured logs).
5. Разделить домены на сервисы (`api-gateway`, `billing`, `content/forecast-engine`) при росте нагрузки.
