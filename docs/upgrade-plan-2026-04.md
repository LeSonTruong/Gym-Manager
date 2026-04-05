# Gym Manager Upgrade Plan - 2026-04

- Ngay tao: 2026-04-05
- Muc tieu: nang cap tu Domain Prototype len muc san sang production hon
- Pham vi: backend + frontend + shared + docs + pipeline
- Uu tien so 1 da chot: Auth/RBAC hardening
- Tong thoi gian muc tieu: 6-8 tuan

## 1. Ket qua baseline

Da hoan thanh trong dot khoi dong implementation:

- [x] Tao roadmap file nay de lam nguon su that cho ke hoach nang cap.
- [x] Bat dau Track Auth/RBAC:
  - Gan `ptId` vao access token payload khi login/refresh neu user lien ket voi PT.
  - Ap scope attendance cho staff account co lien ket PT (khong duoc truy cap PT khac).
  - Them e2e test cover boundary nay.
- [x] Hoan thanh audit role/scope cho endpoint mutation nhay cam cua Pha 1.
- [x] Bo sung e2e 401/403 cho endpoint ADMIN-only nhay cam.
- [x] Tao endpoint-role-test matrix: `docs/auth-rbac-endpoint-role-test-matrix.md`.

## 2. Muc tieu thanh cong tong the

Hoan thanh roadmap khi dat dong thoi cac dieu kien:

1. `npm run build` pass toan monorepo.
2. `npm run lint` pass toan monorepo.
3. `npm run test:unit` va `npm run test:e2e` pass tren baseline cung 1 commit.
4. Luong auth/rbac khong cho phep truy cap vuot scope role.
5. Docs co 1 nguon su that ro rang, khong drift voi code.

## 3. Lo trinh theo pha

## Pha 1 - Auth/RBAC hardening (Tuan 1-2)

Muc tieu:

- Chot boundary role va data scope cho endpoint nhay cam.
- Khong cho staff-account co PT scope truy cap du lieu PT khac.
- Dam bao revoke token duoc enforce khi logout.

Cong viec:

1. Chuan hoa scope helper trong controller/service cho attendance va endpoint PT-scoped.
2. Audit role decorator cho endpoint mutation nhay cam (membership, inventory import, sales confirm, settings patch).
3. Kiem tra revoke list va cache token lifecycle end-to-end.
4. Bo sung e2e cho cac truong hop 401/403 boundary.

Tieu chi done:

- [x] Co e2e test cho staff khong duoc thao tac ngoai scope.
- [x] Logout xong token cu khong dung lai duoc.
- [x] Endpoint nhay cam duoc role guard day du.

## Pha 2 - Lint va quality gates (Tuan 1-2, chay song song cuoi Pha 1)

Muc tieu:

- Xoa debt lint trong shared/docs.
- Khoa gate de khong tai phat.

Cong viec:

1. Don lint trong `packages/shared`.
2. Chuan hoa markdown lint cho docs.
3. Bat pre-commit va CI gate cho lint/test co ban.

Tieu chi done:

- [ ] `npm run lint` pass toan bo.
- [ ] Commit bi chan neu lint fail.

## Pha 3 - Testing baseline (Tuan 2-4)

Muc tieu:

- Tang do tin cay cho domain core.
- Co coverage cho auth, attendance, payroll.

Cong viec:

1. Unit/integration test cho auth login-refresh-logout-revoke.
2. Test attendance state logic (OPEN, HALF, VALID, INVALID) va overtime.
3. Test payroll formula va workflow transition.
4. Dat nguong coverage toi thieu cho backend domain core.

Tieu chi done:

- [ ] Test chinh cho auth/attendance/payroll co mat va pass.
- [ ] Coverage dat nguong da chot.

## Pha 4 - Refactor module backend (Tuan 4-7)

Muc tieu:

- Tach module theo bounded contexts.
- Giam kich thuoc service/controller monolith.

Cong viec:

1. Tach auth, attendance, payroll truoc.
2. Tach tiep members, sales, inventory, expenses, reports.
3. Giu nguyen API contract ben ngoai.

Tieu chi done:

- [ ] Build pass, khong vo endpoint contract.
- [ ] Khong circular dependency.

## Pha 5 - Canonical docs va implementation matrix (Tuan 6-8)

Muc tieu:

- 1 bo tai lieu tham chieu duy nhat va dong bo voi code.

Cong viec:

1. Chuan hoa spec/guide/status thanh nguon su that.
2. Tao bang endpoint x implementation x test status.
3. Cap nhat architecture note sau refactor.

Tieu chi done:

- [ ] Docs pass lint.
- [ ] Team co the on-board theo docs moi ma khong can tac gia giai thich them.

## Pha 6 - Release readiness gate (Tuan 8)

Muc tieu:

- Chot regression va xac nhan muc san sang release.

Checklist:

- [ ] Build/lint/test unit/test e2e deu pass.
- [ ] Security/RBAC checklist pass.
- [ ] Docs handoff + runbook cap nhat.

## 4. Thu tu uu tien thuc thi

1. Auth/RBAC (bat buoc truoc)
2. Lint gates
3. Testing baseline
4. Module refactor
5. Docs canonicalization
6. Release gate

## 5. Pham vi implementation ngay tiep theo

Trong buoc tiep theo, uu tien tiep tuc Pha 1:

1. Audit them endpoint PT-scoped ngoai attendance de dam bao khong leak data.
2. Hoan thien role-boundary test cho mutation nhay cam.
3. Chot danh sach endpoint can explicit `ADMIN` va ghi vao matrix trong docs.

## 6. Luu y quan tri thay doi

- Moi thay doi refactor phai di kem test truoc/sau.
- Uu tien backward-compatible API de khong vo frontend trong qua trinh nang cap.
- Neu can pha vo API contract, phai tao migration note va release note rieng.
