# NestJS Backend

Backend workspace for the template monorepo.

## Stack

- `NestJS`
- `TypeScript`
- `MikroORM`
- `PostgreSQL`
- `Redis`
- `Swagger`
- `Joi` validation

## Included Modules

- `config`
- `common`
- `health`
- `email`
- `redis`

The backend is intentionally minimal and should be extended with your domain modules.

## Commands

```bash
npm --workspace nestjs-backend run start:dev
npm --workspace nestjs-backend run build
npm --workspace nestjs-backend run lint
npm --workspace nestjs-backend run test:unit
npm --workspace nestjs-backend run start:dev:infra
```

## Local Endpoints

- API base: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`
- Health: `http://localhost:4000/api/health`

## Environment

Copy `.env.example` to `.env` and configure:

- `FRONTEND_HOST`
- `POSTGRES_*`
- `REDIS_*`
- `MAIL_*`

## Notes

- Config validation runs on startup.
- Swagger is enabled through `ENABLE_SWAGGER=true`.
- An example MikroORM entity and an example email template are included as placeholders.
