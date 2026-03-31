# Project Status Audit - 2026-03-31

## Current Stage

The repository is at **Domain Prototype / Vertical Slice** stage, not full production completion.

What is completed:
- Monorepo foundation is stable (Turborepo, Next.js, NestJS, shared package).
- Core gym domain data model and migration are present in one consolidated module.
- Frontend provides a broad set of domain screens and route views.
- Backend exposes many read/write endpoints for the domain dataset.
- Build passes for all workspaces.
- Unit test pipeline now runs with Jest + ts-jest and has passing tests.

What is not fully complete:
- Security/auth is still demo-level (no full JWT/refresh token flow in active logic).
- RBAC authorization guards and per-role data boundaries are not enforced end-to-end.
- Several spec endpoints/workflows are still missing implementation details.
- Lint quality gate fails in shared package.
- Source of truth still concentrated in gym-management module instead of modular architecture by bounded context.

## Gap Summary vs spec v2.1

### Implemented in this iteration
- Added attendance check-in/check-out workflow:
  - `POST /attendance/check-in`
  - `POST /attendance/check-out`
  - `GET /attendance/me` (query by `ptId` in current prototype)
- Added automatic shift classification logic (`OPEN`, `VALID`, `HALF`, `INVALID`) on checkout.
- Added overtime calculation based on active PT contract and system config fallback.
- Added guard checks:
  - no duplicate open shift
  - optional single-shift-per-day policy via `allow_multiple_shifts_per_day`
  - invalid checkout time validation
- Fixed frontend route typing issue that blocked production build.
- Added backend Jest config and first passing unit tests.
- Fixed incorrect `oneHour` constant (`3_600_000`).

### Still missing for production completion
- Real auth module (`/auth/refresh`, `/auth/logout`) + token revoke storage.
- Strong RBAC and PT self-scope constraints using guards/interceptors.
- Full state-machine transitions for payroll, expense approval, and sales invoice confirmation/cancel.
- DB schema alignment details (soft delete, UUID primary keys, some enum/policy fields still simplified).
- Reports export (PDF/XLSX) and audit log automation.
- Lint cleanup in `packages/shared` (44 current violations).

## Verification snapshot

Successful checks:
- `npm run build`
- `npm run test:unit`

Failing checks:
- `npm run lint` (fails in `packages/shared`)

## Recommended next execution milestones

1. Harden auth + RBAC (highest risk)
2. Close lifecycle workflows (payroll/expenses/sales)
3. Normalize schema and module split by domain
4. Clean lint debt in shared package
5. Add integration/e2e tests for critical business flows
