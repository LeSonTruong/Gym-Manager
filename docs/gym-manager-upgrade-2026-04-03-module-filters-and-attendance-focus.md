# Gym Manager Upgrade Note (2026-04-03)

## Phiên bản

- Mã nâng cấp: `module-filters-and-attendance-focus-v1`
- Trọng tâm: tăng khả năng theo dõi bảng dữ liệu chính, giảm thao tác rườm rà khi vận hành hằng ngày.

## Mục tiêu đã hoàn thành

1. Mỗi module chính đều có bộ lọc/tìm kiếm ngay trên bảng dữ liệu.
2. Module chấm công tập trung theo tháng, PT, từ khóa; bản ghi mới nhất luôn lên đầu.
3. Khối tổng hợp (stats) được ẩn mặc định, người dùng tự mở khi cần.

## Thay đổi chính

### 1) Bộ lọc và tìm kiếm theo module

Đã bổ sung bộ lọc/tìm kiếm cho các module bảng chính:

- PT
- Chấm công PT
- Kỳ lương / bảng lương
- Hội viên
- Gói tập đã bán
- Phân công hội viên - PT
- Danh mục gói tập
- Hóa đơn gói tập
- Sản phẩm
- Kho hàng
- Nhập hàng
- Hóa đơn dịch vụ
- Cấu hình hệ thống
- Các trang báo cáo có bảng dữ liệu

Cách dùng:

- Nhập từ khóa tại ô tìm kiếm
- Bấm `Lọc`
- Bảng dữ liệu cập nhật theo điều kiện

### 2) Chấm công dễ theo dõi hơn

- Mặc định lọc theo **tháng hiện tại** (không còn tràn bản ghi từ tháng/năm cũ lên đầu màn hình).
- Có thêm lọc theo **PT**.
- Có tìm kiếm theo tên PT/mã PT/trạng thái.
- Dữ liệu chấm công hiển thị theo thứ tự **mới nhất trước**.

Kết quả:

- Bản ghi vừa phát sinh không còn chìm xuống đáy bảng.
- Theo dõi vận hành trong ngày/tháng trực quan hơn.

### 3) Khối tổng hợp đưa về chế độ tuỳ chọn

- Các khối thống kê tổng hợp (cards) chuyển thành dạng `collapsible`.
- Mặc định đóng, ưu tiên không gian cho bảng dữ liệu chính.
- Người dùng chủ động mở khi cần xem KPI tổng hợp.

## Ghi chú UX

- Cấu trúc mới ưu tiên thao tác vận hành thực tế: mở vào là thấy bảng dữ liệu, lọc nhanh, theo dõi nhanh.
- Stats vẫn được giữ lại nhưng không làm nhiễu phần bảng chính.

## Kiểm thử đã chạy

- Lint file chính giao diện module:
  - `apps/nextjs-frontend/src/components/gym/render-gym-route.tsx`
- Build frontend:
  - `npm run build -- --filter=nextjs-frontend` -> PASS

## Phạm vi kỹ thuật

- Không thay đổi contract API backend trong đợt này.
- Tập trung vào khả năng vận hành và quan sát dữ liệu ở lớp giao diện.
