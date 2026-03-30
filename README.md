# Next Nest Turbo Template

A clean monorepo starter for fullstack applications built with:

- `Next.js` frontend
- `NestJS` backend
- `PostgreSQL` via `MikroORM`
- `Turborepo` for workspace orchestration

The repository is intentionally generic so it can be used as a template for new business domains.

## Workspace Layout

```text
apps/
├─ nextjs-frontend
└─ nestjs-backend

packages/
└─ shared
```

## Included Baseline

- Monorepo workspaces with `npm` + `turbo`
- Next.js App Router frontend with `next-intl`, `React Query`, `PrimeReact`
- NestJS backend with config validation, Swagger, health check, Redis, email module
- Shared workspace for cross-app TypeScript contracts
- Dockerfiles for frontend and backend
- GitHub Actions for build, lint, security scanning and release tagging
- Husky + lint-staged + commitlint

## Requirements

- `Node.js 24.14.0`
- `npm 11.11.0`
- `Docker` with `docker compose`

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env
cp apps/nestjs-backend/.env.example apps/nestjs-backend/.env
```

3. Start local infrastructure:

```bash
cd apps/nestjs-backend
docker compose up -d
cd ../..
```

4. Build the workspaces:

```bash
npm run build
```

5. Start the apps in development mode:

```bash
npm run start:dev
```

## Useful Commands

```bash
npm run build
npm run lint
npm run lint:fix
npm run test:unit
npm run test:e2e
npm run docker:build
npm run docker:start:dev
```

## Local Endpoints

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`
- Health: `http://localhost:4000/api/health`
- Maildev: `http://localhost:1080`

## Template Cleanup Checklist

When starting a real project, the first recommended changes are:

1. Replace placeholder copy and branding.
2. Add your domain entities, modules and pages.
3. Adjust environment variables for your target infrastructure.
4. Remove demo/example code you no longer need.
5. Regenerate `package-lock.json` after dependency or package-name changes.

## Additional Docs

- [Frontend README](./apps/nextjs-frontend/README.md)
- [Backend README](./apps/nestjs-backend/README.md)
- [Shared README](./packages/shared/README.md)
