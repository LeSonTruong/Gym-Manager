# Shared Workspace

This package contains contracts and utilities shared between the frontend and backend workspaces.

## Purpose

- Keep request/response contracts in one place
- Avoid duplicated TypeScript types
- Provide a stable import path for shared code

## Current Exports

- `ApiError`
- `ApiResponse<TData, TMeta>`
- `PaginationMeta`
- `PaginatedResponse<TData>`

## Example

```ts
import type {ApiResponse, PaginatedResponse} from '@next-nest-turbo-boilerplate/shared';
```

## Commands

```bash
npm --workspace @next-nest-turbo-boilerplate/shared run build
npm --workspace @next-nest-turbo-boilerplate/shared run lint
```
