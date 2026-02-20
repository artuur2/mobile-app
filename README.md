# Mobile App Monorepo (Kickstart)

Старт разработки выполнен с упором на **продуктовый backend**, готовый к масштабированию.

## Что уже реализовано
- NestJS API с модульной структурой (`auth`, `subscription`, `forecasts`, `natal-chart`, `meditations`, `events`, `profile`).
- JWT access/refresh flow (короткоживущий access token).
- Базовый server-side entitlement check (free/premium) в ключевых endpoint.
- Security baseline: helmet, валидация входных DTO, глобальный rate limit.
- Swagger (`/docs`) для синхронизации backend + Android команды.
- Docker Compose с PostgreSQL и Redis для следующего шага миграции с in-memory на persistent storage.

## Быстрый старт
```bash
cd backend
npm install
npm run start:dev
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/docs`

Demo user:
- email: `demo@astrology.app`
- password: `demo1234`

## Следующий приоритет (production hardening)
1. Перейти с in-memory слоя на Postgres (Prisma/TypeORM + миграции).
2. Вынести purchase validation в асинхронный workflow (queue + retries).
3. Добавить проверку Play Integrity + risk scoring.
4. Подключить observability (OpenTelemetry + Prometheus/Grafana).
5. Разделить сервисы на `api-gateway`, `billing`, `content/forecast-engine`.
