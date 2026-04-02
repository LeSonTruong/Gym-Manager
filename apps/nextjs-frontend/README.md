# Next.js Frontend

Frontend workspace for the template monorepo.

## Stack

- `Next.js` App Router
- `TypeScript`
- `next-intl`
- `@tanstack/react-query`
- `PrimeReact`
- `React Hook Form` + `Zod`
- `Zustand`

## Responsibilities

- Render the user interface
- Handle localization
- Consume backend APIs
- Manage client-side forms, queries and feedback states

## Important Paths

```text
src/
├─ app/
├─ components/
├─ hooks/
├─ i18n/
├─ providers/
└─ store/
```

## Commands

```bash
npm --workspace nextjs-frontend run start:dev
npm --workspace nextjs-frontend run build
npm --workspace nextjs-frontend run lint
npm --workspace nextjs-frontend run test:e2e
```

## Environment

Copy `.env.example` to `.env` and configure:

- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_MAILDEV_API_URL`

## Notes

- The app is configured for locale-prefixed routes.
- The default landing page is intentionally generic so it can be replaced by your product UI.
- Docker builds use the monorepo workspace and the shared package directly.
- Legacy UI modules `/expenses`, `/equipment`, `/maintenance`, and `/pts/:id/contracts` are intentionally removed from active routing.
- Membership lifecycle, assignment management, and inventory import are admin-only mutation flows.
