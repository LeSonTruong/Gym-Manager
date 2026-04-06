# Gym Manager MVP

Tài liệu này xác định phạm vi MVP (Minimum Viable Product) cho dự án Gym Manager.
Mục tiêu là ra mắt nhanh một phiên bản có thể vận hành thực tế, giải quyết bài toán quản lý phòng gym cơ bản.

## 1. Mục tiêu MVP

- Quản lý được thành viên, gói tập, check-in và lịch sử tham gia.
- Có phân quyền tối thiểu để vận hành an toàn (Admin, Staff, Member).
- Có bộ API và giao diện có thể demo end-to-end.
- Đạt khả năng triển khai production cơ bản bằng Docker.

## 2. Đối tượng người dùng

- Admin: cấu hình hệ thống, quản lý nhân sự, xem tổng quan.
- Staff (lễ tân/PT): tạo cập nhật thành viên, check-in, theo dõi gói tập.
- Member: xem thông tin cá nhân, trạng thái gói tập, lịch sử check-in.

## 3. Phạm vi MVP (In Scope)

### 3.1 Auth + RBAC

- Đăng nhập bằng email/số điện thoại và mật khẩu.
- JWT authentication.
- Role-based access control cho 3 vai trò: Admin, Staff, Member.

### 3.2 Quản lý thành viên

- Tạo/sửa/xem thông tin thành viên.
- Tìm kiếm thành viên theo tên, số điện thoại, mã thành viên.
- Trạng thái thành viên: active, inactive.

### 3.3 Quản lý gói tập

- Tạo gói tập (tên gói, thời hạn, giá).
- Gán gói tập cho thành viên.
- Theo dõi ngày bắt đầu, ngày kết thúc, trạng thái còn hạn/hết hạn.

### 3.4 Check-in và điểm danh

- Staff check-in cho thành viên.
- Lưu lịch sử check-in theo thời gian.
- Kiểm tra gói tập còn hạn trước khi check-in.

### 3.5 Dashboard cơ bản

- Tổng số thành viên.
- Số check-in hôm nay.
- Số thành viên sắp hết hạn gói tập.

### 3.6 Audit log tối thiểu

- Ghi log các thao tác quan trọng: tạo/sửa/xóa thành viên, gán gói tập, check-in.

## 4. Ngoài phạm vi MVP (Out of Scope)

- Thanh toán online và hóa đơn điện tử.
- Tích hợp thiết bị vào/ra (QR gate, turnstile, face id).
- Mobile app native.
- Gợi ý AI/phân tích nâng cao.
- Marketing automation (SMS/email campaign phức tạp).

## 5. User flow chính

1. Staff đăng nhập vào hệ thống.
2. Tạo mới hoặc tìm thành viên.
3. Gán gói tập cho thành viên.
4. Khi thành viên đến phòng gym, staff check-in.
5. Hệ thống lưu lịch sử và cập nhật dashboard.
6. Admin theo dõi tổng quan và xử lý các trường hợp hết hạn.

## 6. Tiêu chí hoàn thành MVP (Definition of Done)

- Hoàn tất API cho auth, member, package, check-in.
- Frontend thực hiện được các flow chính:
  - Đăng nhập
  - Quản lý thành viên
  - Gán gói tập
  - Check-in
  - Xem dashboard cơ bản
- Có test tối thiểu:
  - Unit test cho business logic quan trọng
  - E2E test cho flow đăng nhập và check-in
- Chạy được bằng Docker Compose cho backend và frontend.
- Có dữ liệu seed để demo.

## 7. Mốc thời gian đề xuất (4 tuần)

- Tuần 1: Auth + RBAC + data model.
- Tuần 2: Member + package management.
- Tuần 3: Check-in + dashboard + audit log.
- Tuần 4: Test, hardening, docker deploy, demo.

## 8. KPI MVP

- 100% flow chính chạy được end-to-end.
- Thời gian check-in trung bình < 5 giây/thành viên.
- Tỷ lệ lỗi API trong flow chính < 1% trong môi trường test.
- Demo ổn định cho tối thiểu 1 phòng gym.

---

Nếu cần, phiên bản tiếp theo (post-MVP) sẽ ưu tiên thanh toán online, mobile app và báo cáo nâng cao.
