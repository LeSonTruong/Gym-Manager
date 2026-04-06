# Production Deploy Checklist (Gym Manager)

Last updated: 2026-04-06
Scope: monorepo deploy for backend + frontend + shared

## 1. Pre-deploy gate

- [ ] Confirm target commit/tag and release owner.
- [ ] Confirm maintenance window and rollback owner.
- [ ] Confirm CI quality gates pass on target commit:
  - [ ] npm run lint
  - [ ] npm run test:unit
  - [ ] npm run test:e2e
  - [ ] npm run build
- [ ] Confirm change log and known risks are documented.

## 2. Environment and secrets

### Backend required env

- [ ] FRONTEND_HOST
- [ ] PORT (usually 4000)
- [ ] ENABLE_SWAGGER (recommended false in production)
- [ ] ENABLE_DEMO_SEED (must be false in production)
- [ ] POSTGRES_DB_NAME
- [ ] POSTGRES_USER
- [ ] POSTGRES_PASSWORD
- [ ] POSTGRES_HOST
- [ ] POSTGRES_PORT
- [ ] POSTGRES_TIMEZONE
- [ ] REDIS_HOST
- [ ] REDIS_PORT
- [ ] REDIS_PASSWORD

### Frontend required env

- [ ] NEXT_PUBLIC_BACKEND_URL
- [ ] GYM_BACKEND_URL
- [ ] GYM_FRONTEND_DEMO_EMAIL (optional for demo UI)
- [ ] GYM_FRONTEND_DEMO_PASSWORD (optional for demo UI)

### Security checks

- [ ] All secrets are loaded from secret manager (not committed in repo).
- [ ] Production CORS origin matches production frontend URL.
- [ ] Default/demo credentials are disabled or rotated for production.

## 3. Database migration plan

- [ ] Create DB snapshot/backup before deploy.
- [ ] Review new migration files under apps/nestjs-backend/src/migrations.
- [ ] Classify migration risk:
  - [ ] Backward-compatible (safe for rolling deploy)
  - [ ] Breaking (requires maintenance window)
- [ ] Dry-run migration on staging with production-like data.
- [ ] Prepare exact production migration command:

```bash
cd apps/nestjs-backend
npm run migration:up
```

- [ ] Prepare rollback DB strategy:
  - [ ] If reversible and tested, use migration down command.
  - [ ] Otherwise restore DB snapshot.

## 4. Build and artifact validation

- [ ] Build shared package and applications:

```bash
npm run build
```

- [ ] Build container artifacts:

```bash
npm run docker:build
```

- [ ] Tag images with immutable release tag (for example git SHA).
- [ ] Push images to container registry.
- [ ] Record image digests used in production.

## 5. Deployment execution order

1. Deploy backend with new image.
2. Run DB migration (if not done in a dedicated pre-step).
3. Verify backend health endpoint.
4. Deploy frontend with new image.
5. Run smoke checks and monitor logs/metrics.

## 6. Healthcheck and smoke verification

### Mandatory checks

- [ ] Backend health: GET /api/health returns HTTP 200 and database status up.
- [ ] Frontend root and locale routes return HTTP 200.
- [ ] Authentication flow works (login, refresh, logout).
- [ ] One ADMIN-only mutation still enforces RBAC correctly.
- [ ] One STAFF workflow still works end-to-end.

### Suggested smoke commands

```bash
# Backend
curl -i http://<backend-host>/api/health

# Frontend
curl -i http://<frontend-host>/
curl -i http://<frontend-host>/vi/dashboard
```

## 7. Rollback playbook

### Trigger conditions

- [ ] Healthcheck fails for more than agreed threshold.
- [ ] Error rate/latency exceeds SLO threshold.
- [ ] Data integrity issue detected after migration.

### Rollback actions

1. Stop rollout and freeze new traffic to new version.
2. Roll back frontend to previous stable image tag.
3. Roll back backend to previous stable image tag.
4. If DB schema/data changed incompatibly, restore DB snapshot (or run tested down migration).
5. Re-run smoke checks on rolled-back version.
6. Publish incident update with impact and ETA.

## 8. Post-deploy verification

- [ ] Monitor logs/metrics for at least 30-60 minutes.
- [ ] Check key business flows (attendance, memberships, invoices).
- [ ] Confirm audit logs are still being written.
- [ ] Record deploy result, migration version, and final image digests.

## 9. Operator notes for current workspace check (2026-04-06)

- Local smoke for start:prod passed:
  - Backend health returned 200 with database status up.
  - Frontend returned 200 on localhost:3000.
- Docker CLI is installed and working (docker version 29.3.1).
- Docker Desktop daemon is running and docker info is healthy.
- Docker artifact build now succeeds on this machine with:
  - npm run docker:build
- Current local image artifacts:
  - nestjs-backend:latest
  - nextjs-frontend:latest
- Backend dockerfile was hardened for sqlite3 native build reliability:
  - install native toolchain with retry for transient Alpine DNS errors
  - include py3-setuptools for distutils compatibility on Python 3.12
