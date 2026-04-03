# NestJS Backend

Backend workspace for the Gym Manager API.

## Stack

- `NestJS`
- `TypeScript`
- `MikroORM`
- `PostgreSQL`
- `Swagger`
- `Joi` validation

## Included Modules

- `config`
- `common`
- `health`
- `gym-management`

The backend now includes PostgreSQL entities, a manual MikroORM migration, demo data seeding, and CRUD endpoints for the Gym Manager domain.

## Commands

```bash
npm --workspace nestjs-backend run start:dev
npm --workspace nestjs-backend run build
npm --workspace nestjs-backend run lint
npm --workspace nestjs-backend run test:unit
npm --workspace nestjs-backend run start:dev:infra
npm --workspace nestjs-backend run migration:up
npm --workspace nestjs-backend run migration:down
```

## Local Endpoints

- API base: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`
- Health: `http://localhost:4000/api/health`

## Environment

Copy `.env.example` to `.env` and configure:

- `FRONTEND_HOST`
- `POSTGRES_*`
- `ENABLE_SWAGGER`
- `ENABLE_DEMO_SEED`

## Notes

- Config validation runs on startup.
- Swagger is enabled through `ENABLE_SWAGGER=true`.
- On startup the app applies pending MikroORM migrations automatically.
- Demo seed runs only when `ENABLE_DEMO_SEED=true` and `users` is empty.
- `apps/nestjs-backend/docker-compose.yml` can be used to start PostgreSQL, Redis, and Maildev locally.
- Docker compose now uses named volumes so PostgreSQL/Redis data persists across restarts.
- Staff mutation permissions are intentionally restricted; membership lifecycle, member assignment updates, inventory import, and sales invoice confirmation require admin role.
