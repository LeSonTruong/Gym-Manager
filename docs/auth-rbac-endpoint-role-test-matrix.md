# Auth/RBAC Endpoint-Role-Test Matrix (Pha 1)

- Last updated: 2026-04-05
- Scope: endpoint nhay cam cua Pha 1 (Auth/RBAC hardening)
- Test source: apps/nestjs-backend/test/auth-role-workflow.e2e-spec.ts

## Rule summary

- Mac dinh controller yeu cau auth + role ADMIN/STAFF.
- Endpoint mutation nhay cam duoc siet ADMIN-only.
- STAFF co lien ket PT chi duoc truy cap attendance theo ptId cua chinh minh.

## Matrix

| Endpoint | Required role | Scope rule | 401 expectation | 403 expectation | E2E coverage |
| --- | --- | --- | --- | --- | --- |
| POST /api/member-memberships | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/member-memberships/:id/renew | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/member-memberships/:id/cancel | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/member-assignments | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/member-assignments/:id/end | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/inventory/import | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/sales/invoices/:id/confirm | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations; applies sales invariants and cancellation reason |
| POST /api/sales/invoices/:id/cancel | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations; applies sales invariants and cancellation reason |
| PATCH /api/settings/:key | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| POST /api/settings/cleanup-trash | ADMIN | Khong cho role STAFF | Khong token => 401 | STAFF token => 403 | enforces 401/403 for ADMIN-only sensitive mutations |
| GET /api/attendance/pt/:ptId | ADMIN, STAFF | STAFF-linked PT chi duoc xem own-pt | Khong token => 401 | STAFF + other ptId => 403 | enforces attendance scope for staff accounts linked to a PT |
| GET /api/attendance/me | ADMIN, STAFF | STAFF-linked PT bi force ve own-pt | Khong token => 401 | STAFF + query ptId khac => 403 | enforces attendance scope for staff accounts linked to a PT |

## Notes

- Matrix nay chot pham vi Auth/RBAC cho Pha 1 theo roadmap docs/upgrade-plan-2026-04.md.
- Pha tiep theo: mo rong matrix cho expense workflow va report/download policy neu team muon siet them theo role.
