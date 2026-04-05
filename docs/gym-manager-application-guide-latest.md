# Gym Manager - Tài Liệu Mô Tả Ứng Dụng (Bản Mới Nhất)

- Phiên bản tài liệu: 2026-04-03
- Phạm vi: toàn bộ monorepo Gym Manager hiện tại (frontend + backend + shared)
- Mục tiêu: mô tả cách hệ thống vận hành, tính năng, phân quyền, API, cách chạy và kiểm thử ở phiên bản mới nhất

## 1. Tổng quan nhanh

Gym Manager là hệ thống quản lý vận hành phòng gym theo mô hình fullstack:

- Frontend: Next.js App Router, hỗ trợ locale prefix
- Backend: NestJS + MikroORM
- Database: PostgreSQL cho production, SQLite cho một số luồng test/dev
- Orchestration: Turborepo + npm workspaces

Các nhóm nghiệp vụ chính đang hoạt động:

- Xác thực và phân quyền
- Quản lý PT và hợp đồng PT
- Chấm công PT
- Quản lý hội viên (member)
- Quản lý gói tập và vòng đời membership
- Phân công member - PT
- Bán hàng và hóa đơn dịch vụ
- Quản lý kho
- Quản lý chi phí vận hành
- Báo cáo và cấu hình hệ thống

## 2. Kiến trúc hệ thống

## 2.1 Cấu trúc workspace

- apps/nestjs-backend: Backend API
- apps/nextjs-frontend: Giao diện người dùng
- packages/shared: Contracts, mock data, shared utilities

## 2.2 Luồng dữ liệu tổng quát

1. Người dùng đăng nhập trên frontend.
2. Frontend gọi API backend để lấy access token và refresh token.
3. Frontend gọi các API nghiệp vụ theo role.
4. Backend xử lý nghiệp vụ, đọc/ghi DB, trả JSON response.
5. Frontend render các trang/module theo locale và quyền truy cập.

## 2.3 Môi trường chạy local

- Frontend: cổng 3000
- Backend: cổng 4000
- API base: /api
- Swagger: /api/docs
- Health: /api/health

## 3. Phân quyền người dùng

Hệ thống hiện dùng 2 role chính:

- ADMIN
- STAFF

Nguyên tắc hiện tại:

- STAFF thao tác được các luồng vận hành cơ bản.
- ADMIN có toàn quyền và chịu trách nhiệm các mutation nhạy cảm.
- Một số luồng đã siết chặt về ADMIN để tránh sai lệch tài chính/nghiệp vụ.

Các mutation nhạy cảm yêu cầu ADMIN:

- Vòng đời membership (bán mới, gia hạn, hủy)
- Quản lý member - PT assignment
- Nhập kho
- Xác nhận hóa đơn bán hàng
- Kết thúc assignment member - PT

## 4. Tính năng đang hoạt động theo module

## 4.1 Xác thực và tài khoản

- Đăng nhập, refresh token, đăng xuất, lấy profile hiện tại
- Cập nhật account (username/password)
- Đăng nhập theo username + password

Nhóm endpoint:

- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- PATCH /api/auth/account

## 4.2 Dashboard và snapshot

- Tổng hợp số liệu vận hành
- Snapshot dữ liệu nghiệp vụ cho frontend

Nhóm endpoint:

- GET /api/dashboard
- GET /api/snapshot

## 4.3 Quản lý PT

- Danh sách PT
- Tạo/sửa/xóa PT
- Xem chi tiết PT
- Quản lý hợp đồng PT

Nhóm endpoint:

- GET /api/pts
- POST /api/pts
- GET /api/pts/:id
- PATCH /api/pts/:id
- DELETE /api/pts/:id
- GET /api/pts/:id/contracts
- POST /api/pts/:id/contracts
- PATCH /api/pts/:id/contracts/:contractId

## 4.4 Chấm công

- Check-in/check-out
- Lịch sử chấm công
- Chấm công theo PT
- Chấm công của user hiện tại

Nhóm endpoint:

- GET /api/attendance
- POST /api/attendance/check-in
- POST /api/attendance/check-out
- POST /api/attendance/checkout
- PATCH /api/attendance/:id
- GET /api/attendance/me
- GET /api/attendance/pt/:ptId

## 4.5 Payroll

- Tạo kỳ lương
- Generate payroll
- Submit/approve/mark-paid
- Xem payroll của chính user

Nhóm endpoint:

- GET /api/payroll/periods
- POST /api/payroll/periods
- GET /api/payroll/periods/:id
- POST /api/payroll/generate
- GET /api/payroll/me
- POST /api/payroll/periods/:id/submit
- POST /api/payroll/periods/:id/approve
- POST /api/payroll/periods/:id/mark-paid

## 4.6 Quản lý hội viên (member)

- Danh sách member
- Tạo/sửa/xóa member
- Chi tiết member
- Lịch sử assignment của member

Nhóm endpoint:

- GET /api/members
- POST /api/members
- GET /api/members/:id
- PATCH /api/members/:id
- DELETE /api/members/:id
- GET /api/members/:id/pt-assignments

## 4.7 Membership plans và member memberships

- Quản lý catalog gói tập
- Bán gói tập cho member
- Gia hạn membership
- Hủy membership
- Xem danh sách membership invoices

Nhóm endpoint:

- GET /api/membership-plans
- POST /api/membership-plans
- PATCH /api/membership-plans/:id
- DELETE /api/membership-plans/:id
- GET /api/member-memberships
- POST /api/member-memberships
- POST /api/member-memberships/:id/renew
- POST /api/member-memberships/:id/cancel
- GET /api/membership-invoices

## 4.8 Member - PT assignment

- Xem danh sách assignments
- Tạo assignment
- Kết thúc assignment

Nhóm endpoint:

- GET /api/member-assignments
- POST /api/member-assignments
- POST /api/member-assignments/:id/end

## 4.9 Products, inventory, sales

- Quản lý sản phẩm
- Theo dõi biến động kho
- Nhập kho
- Tạo và quản lý hóa đơn bán hàng

Nhóm endpoint:

- GET /api/products
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id
- GET /api/inventory/transactions
- POST /api/inventory/import
- GET /api/sales/invoices
- POST /api/sales/invoices
- GET /api/sales/invoices/:id
- POST /api/sales/invoices/:id/confirm
- POST /api/sales/invoices/:id/cancel

## 4.10 Expenses

- Tạo/chỉnh sửa phiếu chi
- Vòng đời submit/approve/reject/mark-paid
- Xem danh sách và chi tiết

Nhóm endpoint:

- GET /api/expenses
- POST /api/expenses
- GET /api/expenses/:id
- PATCH /api/expenses/:id
- POST /api/expenses/:id/submit
- POST /api/expenses/:id/approve
- POST /api/expenses/:id/reject
- POST /api/expenses/:id/mark-paid

## 4.11 Reports và settings

- Báo cáo revenue/payroll/inventory/expenses/profit
- Export báo cáo theo report type
- Xem và cập nhật system settings

Nhóm endpoint:

- GET /api/reports/revenue
- GET /api/reports/payroll
- GET /api/reports/inventory
- GET /api/reports/expenses
- GET /api/reports/profit
- GET /api/reports/:reportType/export
- GET /api/settings
- PATCH /api/settings/:key

## 5. Frontend routes đang dùng

Các route chính (locale-prefixed):

- /vi/dashboard
- /vi/pts
- /vi/payroll
- /vi/members
- /vi/members/memberships
- /vi/member-assignments
- /vi/membership-plans
- /vi/membership-invoices
- /vi/products
- /vi/inventory
- /vi/inventory/import
- /vi/invoices
- /vi/reports/revenue
- /vi/reports/payroll
- /vi/reports/inventory
- /vi/reports/expenses
- /vi/reports/profit
- /vi/settings

Các route UI legacy đã ẩn khỏi điều hướng active và kỳ vọng trả 404:

- /vi/expenses
- /vi/equipment
- /vi/maintenance

## 6. Các thay đổi nghiệp vụ quan trọng ở bản mới nhất

## 6.1 Assignment lấy membership làm nguồn sự thật

Trong flow tạo assignment member - PT:

- memberId không còn bắt buộc.
- Hệ thống suy ra member từ memberMembershipId.
- Nếu client vẫn gửi memberId mà không khớp membership, API trả 400.

Lợi ích:

- Loại bỏ lỗi mismatch giữa member và membership.
- Bảo toàn tính toàn vẹn dữ liệu nghiệp vụ.

## 6.2 End assignment yêu cầu ADMIN

- STAFF bị chặn endpoint end assignment (403 đúng kỳ vọng).
- Frontend cũng đã ẩn action kết thúc assignment với user không phải admin.

## 6.3 Đăng nhập theo username

- Luồng auth sử dụng username + password.
- Demo accounts mặc định: admin/demo123 và staff/demo123.

## 6.4 E2E preflight để giảm flaky

Trước khi chạy e2e monorepo, script preflight kiểm tra cổng 3000/4000:

- Nếu đang bị chiếm: fail sớm, báo lỗi rõ ràng.
- Nếu cần bỏ qua có chủ đích: set E2E_SKIP_PORT_PREFLIGHT=true.

Biến môi trường liên quan:

- E2E_PORT_CHECK_HOST (mặc định: 127.0.0.1)
- E2E_SKIP_PORT_PREFLIGHT

## 7. Hướng dẫn chạy local

## 7.1 Cài đặt dependencies

```bash
npm install
```

## 7.2 Tạo file môi trường

```bash
cp apps/nestjs-backend/.env.example apps/nestjs-backend/.env
cp apps/nextjs-frontend/.env.example apps/nextjs-frontend/.env
```

## 7.3 Chạy hạ tầng local (nếu dùng PostgreSQL/Redis local)

```bash
cd apps/nestjs-backend
docker compose up -d
cd ../..
```

## 7.4 Build và chạy dev

```bash
npm run build
npm run start:dev
```

## 7.5 Endpoints local

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000/api>
- Swagger: <http://localhost:4000/api/docs>
- Health: <http://localhost:4000/api/health>

## 8. Bộ lệnh chất lượng và test

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Ghi chú:

- test:e2e ở root đã bao gồm preflight check cổng trước khi chạy turbo.

## 9. Cấu hình môi trường quan trọng

## 9.1 Backend

- FRONTEND_HOST
- PORT
- ENABLE_SWAGGER
- ENABLE_DEMO_SEED
- POSTGRES_DB_NAME
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_TIMEZONE
- REDIS_HOST
- REDIS_PORT
- REDIS_PASSWORD

## 9.2 Frontend

- NEXT_PUBLIC_BACKEND_URL
- GYM_BACKEND_URL
- GYM_FRONTEND_DEMO_EMAIL
- GYM_FRONTEND_DEMO_PASSWORD

## 10. Tài khoản demo

Theo dữ liệu seed hiện tại:

- Admin: username admin, password demo123
- Staff: username staff, password demo123

## 11. Troubleshooting nhanh

## 11.1 E2E fail do không đăng nhập được

Kiểm tra:

- Cổng 3000/4000 có đang bị chiếm bởi server khác không.
- ENABLE_DEMO_SEED có đang tắt không.
- Host backend/frontend có khớp env không.

## 11.2 End assignment trả 403

Đây là hành vi đúng nếu user hiện tại là STAFF.

## 11.3 Tạo assignment báo membership/member mismatch

Đảm bảo memberMembershipId hợp lệ. Nếu gửi thêm memberId, phải khớp member của membership đó.

## 12. Ghi chú phạm vi hiện tại

- Backend vẫn có nhiều module nghiệp vụ đầy đủ (bao gồm expenses).
- Frontend đã được dọn scope route active theo hướng ưu tiên vận hành cốt lõi.
- Tài liệu này mô tả đúng trạng thái codebase hiện tại để phục vụ onboarding dev, QA và demo nội bộ.

## 13. Auth/RBAC matrix

- Matrix chot pham vi role/scope/test cho Pha 1 xem tai: docs/auth-rbac-endpoint-role-test-matrix.md
