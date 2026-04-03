# Gym Manager Upgrade Note (2026-04-03)

## Phiên bản

- Mã nâng cấp: `simplification-pack-v1`
- Trọng tâm: đơn giản hóa thao tác vận hành, giảm lệ thuộc cấu hình thủ công, giữ luồng demo gọn và dùng được ngay.

## Mục tiêu đã hoàn thành

1. Chấm công thiếu giờ vẫn checkout được, không bị khóa cứng 5 giờ.
2. Lương PT tự tăng/giảm theo số công quy đổi từ giờ làm thực tế.
3. Báo cáo có thể in/tải ngay theo mẫu sẵn bằng 1 lần bấm.
4. Có tác vụ dọn cấu hình rác để tránh phình dữ liệu sau khi xóa/tinh gọn PT.

## Thay đổi chính

### 1) Chấm công linh hoạt theo giờ thực tế

- Checkout không còn bị chặn bởi điều kiện "đủ 5 giờ".
- Nếu PT làm thiếu giờ, hệ thống vẫn chốt ca và quy đổi công theo tỷ lệ.
- Trạng thái ca:
  - `VALID`: đủ giờ chuẩn.
  - `HALF`: thiếu giờ nhưng vẫn có công quy đổi.
  - `INVALID`: dữ liệu ca không hợp lệ.

### 2) Tính lương PT tự động theo công quy đổi

- Lương cơ bản kỳ không còn "cứng" theo cấu hình tháng.
- Công thức mới:
  - `baseSalaryKy = baseSalaryCauHinh * (tongCongQuyDoi / standardWorkCredits)`
- Mặc định `standardWorkCredits = 26` nếu chưa cấu hình.
- Có thể tùy chỉnh:
  - toàn hệ thống: `payroll_standard_work_credits`
  - theo PT: `pt_<ptId>_standard_work_credits`

### 3) In/Tải báo cáo 1 chạm

- Thêm đường dẫn tải báo cáo nội bộ đã xác thực phiên đăng nhập.
- Có nút trực tiếp trên trang báo cáo:
  - `In PDF mẫu`
  - `Tải Excel`
- Không cần thao tác API thủ công.

### 4) Dọn dữ liệu cấu hình rác

- Thêm API dọn config rác:
  - `POST /api/settings/cleanup-trash`
- Dọn các khóa:
  - khóa cũ không còn dùng (`half_shift_policy`)
  - khóa PT không còn PT active tương ứng.
- Frontend đã có nút chạy trực tiếp trong trang Cấu hình.

## Endpoint/Route mới

- Backend:
  - `POST /api/settings/cleanup-trash`
- Frontend route proxy tải báo cáo:
  - `GET /[locale]/reports/[reportType]/download?format=pdf|xlsx`

## Kiểm thử đã chạy

- Lint theo file đã sửa:
  - backend: `gym-management.service.ts`, `gym-management.controller.ts`
  - frontend: `render-gym-route.tsx`, `gym-actions.ts`, route download báo cáo
- Unit test backend:
  - `npm run test:unit -- --filter=nestjs-backend` -> PASS
- Build:
  - `npm run build -- --filter=nestjs-backend` -> PASS
  - `npm run build -- --filter=nextjs-frontend` -> PASS

## Ghi chú vận hành

- Nếu muốn hệ thống trả lương "nhanh hơn" theo công, giảm `standardWorkCredits`.
- Nếu muốn chặt hơn, tăng `standardWorkCredits`.
- Khuyến nghị chạy dọn config rác sau mỗi đợt tinh gọn PT hoặc demo reset dữ liệu.
