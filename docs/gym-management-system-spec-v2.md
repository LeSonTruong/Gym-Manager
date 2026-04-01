<!-- markdownlint-disable MD031 MD032 MD060 -->

# Gym Management System Specification v2.1

> **Phiên bản:** 2.1 — Chuẩn hóa nghiệp vụ và schema từ v2.0
> **Cập nhật lần cuối:** 2026-03-30
> **Trạng thái:** Draft
>
> **Điểm cập nhật chính trong v2.1:**
> - Chuẩn hóa workflow chấm công: PT luôn được `Check Out`, hệ thống tự phân loại ca `VALID`, `HALF`, `INVALID`.
> - Tách nguồn sự thật PT phụ trách member sang bảng `member_pt_assignments`.
> - Làm rõ mô hình lương `MONTHLY`, `DAILY`, `HOURLY` để tính lương triển khai được.
> - Bổ sung vòng đời phiếu chi: `DRAFT → PENDING_APPROVAL → APPROVED/REJECTED → PAID`.
> - Siết quyền truy cập API của PT theo phạm vi “chính mình”.
> - Chuẩn hóa báo cáo lợi nhuận có tính `COGS` cho hàng hóa bán trong phòng Gym.

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Non-functional Requirements](#2-non-functional-requirements)
3. [Vai trò người dùng](#3-vai-trò-người-dùng)
4. [Phạm vi chức năng chính](#4-phạm-vi-chức-năng-chính)
5. [Quy tắc nghiệp vụ chi tiết](#5-quy-tắc-nghiệp-vụ-chi-tiết)
6. [Thiết kế cơ sở dữ liệu PostgreSQL](#6-thiết-kế-cơ-sở-dữ-liệu-postgresql)
7. [Kiến trúc module NestJS đề xuất](#7-kiến-trúc-module-nestjs-đề-xuất)
8. [Cấu trúc màn hình NextJS đề xuất](#8-cấu-trúc-màn-hình-nextjs-đề-xuất)
9. [Luồng nghiệp vụ chính](#9-luồng-nghiệp-vụ-chính)
10. [Báo cáo đề xuất](#10-báo-cáo-đề-xuất)
11. [Quy tắc phân quyền đề xuất](#11-quy-tắc-phân-quyền-đề-xuất)
12. [Gợi ý triển khai kỹ thuật](#12-gợi-ý-triển-khai-kỹ-thuật)
13. [Kết quả mong muốn của hệ thống](#13-kết-quả-mong-muốn-của-hệ-thống)
14. [Tóm tắt ngắn gọn mô hình hệ thống](#14-tóm-tắt-ngắn-gọn-mô-hình-hệ-thống)

---

## 1. Tổng quan

Đây là tài liệu đặc tả cho ứng dụng quản lý phòng Gym xây dựng với:

- Frontend: `NextJS` (App Router)
- Backend: `NestJS`
- Database: `PostgreSQL`

Mục tiêu hệ thống:

- Quản lý `PT` và hợp đồng lương theo từng PT.
- Quản lý `members`, loại vé tập và PT phụ trách.
- Quản lý chấm công `Check In / Check Out` cho PT.
- Quản lý bán hàng dịch vụ trong phòng Gym như nước uống, găng tay, khăn,...
- Quản lý nhập kho, xuất kho, tồn kho.
- Quản lý các khoản chi vận hành như dọn dẹp, bảo trì, sửa chữa, thay mới thiết bị.
- Thống kê doanh thu, chi phí, lợi nhuận, lương PT.

---

## 2. Non-functional Requirements

> *(Phần này được bổ sung so với v1.0)*

### 2.1 Hiệu năng

- Trang dashboard tải trong vòng **2 giây** với dữ liệu ≤ 1.000 members và 50 PT.
- API response time trung bình **< 300ms** ở điều kiện tải bình thường.
- Hệ thống hỗ trợ tối đa **20 user đồng thời** (Admin + Staff + PT).

### 2.2 Bảo mật

- Toàn bộ traffic đi qua **HTTPS**.
- Password lưu bằng **bcrypt** (cost factor ≥ 12).
- Dữ liệu nhạy cảm (sức khỏe member, thông tin tài chính) cần được phân quyền nghiêm ngặt, chỉ Admin và người liên quan được xem.
- JWT token phải có thời gian hết hạn rõ ràng (xem mục 4.1).
- Không log thông tin nhạy cảm (password, token) vào console hay file log.

### 2.3 Timezone

- Toàn hệ thống dùng **UTC** để lưu trữ timestamp trong DB.
- Frontend hiển thị theo timezone **Asia/Ho_Chi_Minh (UTC+7)**.
- Tất cả logic chấm công, kỳ lương, báo cáo phải tính toán dựa trên giờ địa phương UTC+7.

### 2.4 Lưu trữ file

- File upload (ảnh đại diện, chứng từ phiếu chi) lưu trên **AWS S3** hoặc tương đương (Cloudflare R2, MinIO).
- Giới hạn dung lượng mỗi file: **5MB**.
- Định dạng chấp nhận: `jpg`, `png`, `webp` (ảnh), `pdf` (chứng từ).
- URL trả về dạng signed URL với thời hạn hoặc public URL tuỳ loại file.

### 2.5 Backup và phục hồi

- Backup DB tự động **mỗi ngày**, lưu giữ trong **30 ngày**.
- Có khả năng restore về bất kỳ điểm backup nào trong vòng 30 ngày.

### 2.6 Data Retention & Soft Delete

- Dữ liệu master như `users`, `members`, `personal_trainers`, `products`, `equipment_assets` dùng **soft delete** qua cột `deleted_at`.
- Chứng từ giao dịch và tài chính như `membership_invoices`, `sales_invoices`, `pt_payrolls`, `purchase_receipts`, `operating_expenses` **không xóa qua API**; hệ thống quản lý bằng `status` như `CANCELLED`, `REJECTED`, `PAID`.
- Các bản ghi đã soft delete hoặc đã bị vô hiệu hóa không hiển thị trên UI mặc định nhưng vẫn truy vấn được khi cần kiểm toán.
- Mọi thay đổi trạng thái quan trọng phải được ghi vào `audit_logs`.

---

## 3. Vai trò người dùng

### 3.1 Admin

- Quản lý toàn bộ hệ thống.
- Quản lý PT, members, vé tập, sản phẩm dịch vụ, hóa đơn, tồn kho, chi phí.
- Quản lý hợp đồng PT: lương cơ bản, mức thưởng, mức tăng ca, hoa hồng.
- Xem báo cáo doanh thu, chi phí, lương, hiệu suất PT.
- Duyệt bảng lương và phiếu chi.
- Cấu hình chính sách hệ thống (lương tối thiểu ca, thưởng hiệu suất,...).

### 3.2 PT

- Xem thông tin cá nhân.
- Check In và Check Out ca làm việc.
- Xem members đang phụ trách.
- Xem lương tạm tính, giờ tăng ca, hoa hồng.

### 3.3 Nhân viên lễ tân / bán hàng (Staff)

- Tạo member mới.
- Bán vé tập.
- Tạo hóa đơn bán sản phẩm dịch vụ.
- Ghi nhận nhập kho, xuất kho nếu được phân quyền.

---

## 4. Phạm vi chức năng chính

### 4.1 Authentication & Authorization

> *(Phần này được bổ sung so với v1.0)*

**Đăng nhập:**

- Người dùng đăng nhập bằng `email` + `password`.
- Hệ thống trả về `access_token` (JWT, TTL: **15 phút**) và `refresh_token` (TTL: **7 ngày**).
- `refresh_token` lưu trong DB, có thể thu hồi (revoke).

**Làm mới token:**

- Client gửi `refresh_token` để lấy `access_token` mới.
- Nếu `refresh_token` đã hết hạn hoặc bị revoke, yêu cầu đăng nhập lại.

**Đăng xuất:**

- Revoke `refresh_token` phía server.
- Client xóa token khỏi storage.

**Xử lý tài khoản bị vô hiệu hóa:**

- Nếu `users.status = INACTIVE`, mọi request đều trả về `401 Unauthorized`, kể cả khi token còn hiệu lực.
- Admin có thể kích hoạt lại tài khoản.

**API:**

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### 4.2 Dashboard tổng quan

- Tổng số members.
- Tổng số PT.
- Số members đang hoạt động.
- Số vé ngày, vé tháng, vé năm đang còn hiệu lực.
- Doanh thu theo ngày / tháng / năm.
- Doanh thu từ vé tập.
- Doanh thu từ bán sản phẩm dịch vụ.
- Tổng lương PT cần chi trong kỳ.
- Tổng chi phí vận hành.
- Cảnh báo tồn kho thấp.
- Cảnh báo thiết bị cần bảo trì hoặc thay mới.

### 4.3 Quản lý PT

Lưu thông tin:

- Mã PT.
- Họ tên.
- Ngày sinh.
- Giới tính.
- Số điện thoại.
- Email.
- Địa chỉ.
- Trạng thái làm việc.
- Chuyên môn.
- Số năm kinh nghiệm.
- Ảnh đại diện.
- Ngày bắt đầu làm việc.

Quản lý hợp đồng PT:

- Loại hợp đồng.
- Mức lương cơ bản.
- Hình thức lương: theo tháng, theo công, theo giờ.
- Số giờ tối thiểu để tính một ca hợp lệ.
- Số giờ chuẩn trong ngày.
- Mức lương tăng ca theo giờ.
- Mức thưởng theo hiệu suất (số member phụ trách đạt ngưỡng, hoặc số buổi PT hoàn thành).
- Hoa hồng theo gói tập PT phụ trách.
- Hoa hồng theo doanh số bán gói tập.
- Phụ cấp khác.
- Khoản phạt nếu có (lưu dạng JSON mô tả quy tắc).
- Ngày hiệu lực hợp đồng.
- Ngày hết hạn hợp đồng.

### 4.4 Quản lý chấm công PT

Chức năng:

- PT Check In khi bắt đầu làm việc.
- PT Check Out khi kết thúc làm việc.
- Hệ thống tính tổng số giờ làm trong ngày.
- Xác định ca làm hợp lệ hay không hợp lệ.
- Tính số giờ tăng ca.
- Tổng hợp công theo ngày, tuần, tháng.

Quy tắc nghiệp vụ:

- Một PT chỉ được `Check In` một lần cho một ca đang mở.
- `Check Out` luôn được phép để đóng ca đang mở; sau đó hệ thống mới đánh giá ca hợp lệ hay không.
- Nếu thời gian làm việc đạt từ `min_valid_shift_hours` trở lên, ca được đánh dấu `VALID`.
- Nếu thời gian làm việc dưới chuẩn:
  - `NO_COUNT`: đánh dấu `INVALID`, không tính công.
  - `HALF_COUNT`: đánh dấu `HALF`, tính nửa công.
- Số giờ vượt quá số giờ chuẩn trong hợp đồng được tính là `Overtime`.
- Overtime được quy đổi thành tiền thưởng theo hợp đồng của PT.
- Admin có thể chỉnh quy tắc theo từng PT vì hợp đồng có thể khác nhau.

### 4.5 Quản lý members

Lưu thông tin:

- Mã member.
- Họ tên.
- Ngày sinh.
- Giới tính.
- Số điện thoại.
- Email.
- Địa chỉ.
- Chiều cao.
- Cân nặng.
- Mục tiêu tập luyện.
- Tiền sử sức khỏe nếu cần.
- Ngày đăng ký.
- Trạng thái hoạt động.

Hệ thống cho biết:

- Có bao nhiêu members.
- Member đang sở hữu loại vé nào.
- Vé còn hiệu lực hay đã hết hạn.
- PT nào đang phụ trách member đó.
- Member đã mua những dịch vụ nào.

### 4.6 Quản lý vé tập

Hệ thống có 3 loại vé chính:

#### Vé ngày

- Hiệu lực trong 1 ngày.
- Số lượt vào tập giới hạn theo cấu hình.
- Thường không kèm PT.
- Có thể áp dụng ưu đãi như tặng nước uống hoặc giảm giá dịch vụ ngày đầu.

#### Vé tháng

- Hiệu lực 30 ngày hoặc theo cấu hình.
- Có thể không giới hạn số lần tập trong thời gian hiệu lực.
- Có thể kèm ưu đãi: đo chỉ số cơ thể, ưu đãi mua sản phẩm, giảm giá gói PT.

#### Vé năm

- Hiệu lực 365 ngày hoặc theo cấu hình.
- Có thể là gói cao cấp.
- Có thể kèm PT phụ trách.
- Có thể có các ưu đãi như:
  - Tặng buổi đánh giá thể trạng định kỳ.
  - Giảm giá dịch vụ bán kèm.
  - Ưu tiên đặt lịch PT.
  - Tặng vật phẩm hoặc buổi tập cá nhân.

Thông tin mỗi gói vé:

- Tên gói.
- Loại vé: `DAY`, `MONTH`, `YEAR`.
- Giá vé.
- Thời hạn.
- Số lượt sử dụng hoặc không giới hạn.
- Có bao gồm PT hay không.
- Số buổi PT đi kèm nếu có.
- Danh sách ưu đãi.
- Trạng thái đang bán / ngừng bán.

**Thanh toán vé tập:**

> *(Bổ sung so với v1.0 — làm rõ luồng tiền)*

- Khi member mua vé, hệ thống tạo **`membership_invoices`** riêng (tách biệt với hóa đơn bán sản phẩm).
- `membership_invoices` link tới `member_memberships` để truy vết.
- Phương thức thanh toán: tiền mặt, chuyển khoản, thẻ.

### 4.7 Quản lý PT phụ trách member

- Một member có thể được gán PT phụ trách nếu gói vé có PT.
- Một PT có thể phụ trách nhiều members.
- `member_memberships` chỉ quản lý vòng đời gói vé đã mua, **không** là nguồn sự thật cho PT phụ trách.
- Lịch sử PT phụ trách được lưu duy nhất ở `member_pt_assignments`.
- PT hiện tại của member được xác định bởi bản ghi `member_pt_assignments` có `status = ACTIVE` mới nhất.
- Hệ thống ghi nhận:
  - Ngày bắt đầu phụ trách.
  - Ngày kết thúc phụ trách.
  - Gói tập liên quan.
  - Mức hoa hồng PT nhận từ gói này.

### 4.8 Quản lý bán hàng dịch vụ trong phòng Gym

Bao gồm các mặt hàng:

- Nước uống.
- Găng tay.
- Khăn.
- Thực phẩm bổ sung.
- Phụ kiện tập luyện.

Chức năng:

- Quản lý danh mục sản phẩm.
- Quản lý giá bán.
- Quản lý số lượng tồn kho.
- Tạo hóa đơn bán hàng cho member hoặc khách lẻ.
- Xem lịch sử giao dịch.
- In hoặc xuất hóa đơn (PDF).

Thông tin hóa đơn:

- Mã hóa đơn.
- Ngày lập.
- Người tạo.
- Member mua hàng hoặc khách lẻ.
- Danh sách sản phẩm.
- Số lượng.
- Đơn giá.
- Thành tiền.
- Giảm giá.
- Tổng tiền.
- Phương thức thanh toán.
- Ghi chú.

### 4.9 Quản lý nhập kho, xuất kho

Chức năng:

- Nhập hàng từ nhà cung cấp.
- Xuất hàng do bán ra hoặc sử dụng nội bộ.
- Theo dõi số lượng tồn kho hiện tại.
- Theo dõi lịch sử biến động kho.
- Cảnh báo mặt hàng sắp hết.

Các loại giao dịch kho:

- `IMPORT`: nhập hàng.
- `SALE`: xuất bán.
- `DAMAGE`: hao hụt / hư hỏng.
- `INTERNAL_USE`: sử dụng nội bộ.
- `ADJUSTMENT`: điều chỉnh tồn kho.

### 4.10 Quản lý chi phí vận hành

Theo dõi các khoản chi:

- Dọn dẹp.
- Bảo trì thiết bị.
- Sửa chữa máy móc.
- Thay thế thiết bị không thể sửa chữa.
- Điện, nước, internet nếu cần mở rộng.

Thông tin cần lưu:

- Mã phiếu chi.
- Ngày phát sinh.
- Loại chi phí.
- Thiết bị liên quan nếu có.
- Nhà cung cấp / đơn vị sửa chữa.
- Số tiền.
- Mô tả.
- Người duyệt.
- Chứng từ đính kèm (URL file).
- Trạng thái phiếu chi: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `PAID`.

### 4.11 Cấu hình hệ thống (Settings)

> *(Phần này được bổ sung so với v1.0)*

Các tham số cấu hình lưu trong DB (bảng `system_configs`), Admin có thể chỉnh sửa qua UI:

- `min_valid_shift_hours`: Số giờ tối thiểu để ca làm hợp lệ (mặc định: `5`).
- `half_shift_policy`: Chính sách khi ca dưới chuẩn — `NO_COUNT` (không tính công) hoặc `HALF_COUNT` (tính nửa ca).
- `low_stock_threshold_default`: Ngưỡng cảnh báo tồn kho mặc định.
- `membership_exclusive_mode`: Chế độ vé độc quyền — `true` (chỉ 1 vé active tại một thời điểm) hoặc `false`.
- `default_timezone`: Múi giờ hiển thị (mặc định: `Asia/Ho_Chi_Minh`).
- `allow_multiple_shifts_per_day`: Cho phép PT có nhiều ca trong một ngày hay không (mặc định: `false`).

### 4.12 Báo cáo và thống kê

Các báo cáo quan trọng:

- Doanh thu từ vé tập.
- Doanh thu từ sản phẩm dịch vụ.
- Tổng doanh thu.
- Tổng chi phí vận hành.
- Tổng lương PT.
- Lợi nhuận theo kỳ.
- Top PT có doanh thu / hoa hồng cao nhất.
- Top member mua nhiều dịch vụ nhất.
- Hàng tồn kho thấp.
- Thiết bị phát sinh chi phí sửa chữa nhiều nhất.

Hỗ trợ xuất file: **PDF** và **Excel (.xlsx)** cho tất cả báo cáo.

---

## 5. Quy tắc nghiệp vụ chi tiết

### 5.1 Quy tắc vé tập

- Mỗi member có thể sở hữu nhiều gói vé theo thời gian.
- Tại một thời điểm, chỉ có một vé chính đang hoạt động nếu hệ thống chọn mô hình độc quyền (`membership_exclusive_mode = true`).
- Vé có thể được gia hạn hoặc nâng cấp.
- Giá vé và ưu đãi được Admin cấu hình.
- Vé cao cấp có thể gắn PT phụ trách.

### 5.2 Quy tắc hợp đồng PT

- Mỗi PT có thể có nhiều hợp đồng theo thời gian, nhưng chỉ một hợp đồng hiệu lực tại một thời điểm.
- Thông số lương, thưởng, hoa hồng lấy từ hợp đồng đang hiệu lực.
- Admin có thể sửa hợp đồng và lịch sử thay đổi được ghi vào `audit_logs`.

### 5.3 Quy tắc chấm công

- Mỗi ngày PT có thể có một hoặc nhiều ca nếu hệ thống cho phép.
- Một ca hợp lệ cần có `check_in_at` và `check_out_at`.
- `Thời gian làm việc = check_out_at - check_in_at`.
- PT luôn được `Check Out` để đóng ca, kể cả khi chưa đạt số giờ tối thiểu.
- Nếu thời gian làm việc dưới `min_valid_shift_hours` (cấu hình từ Settings):
  - `NO_COUNT`: `status = INVALID`, `work_credit = 0`, `paid_hours = 0`.
  - `HALF_COUNT`: `status = HALF`, `work_credit = 0.5`, `paid_hours = standard_shift_hours / 2`.
- Nếu thời gian làm việc đạt hoặc vượt chuẩn:
  - `status = VALID`
  - `work_credit = 1`
  - `paid_hours = min(worked_hours, standard_shift_hours)`
- Nếu thời gian làm việc vượt `giờ chuẩn/ngày` trong hợp đồng thì phần vượt là `overtime_hours`.

### 5.4 Quy tắc tính lương PT

Công thức:

```text
Luong_thuc_nhan =
  Luong_co_ban_theo_hop_dong
  + Thuong_cham_cong
  + Thuong_tang_ca
  + Thuong_hieu_suat
  + Hoa_hong_goi_tap
  + Hoa_hong_ban_hang
  + Phu_cap
  - Khau_tru
```

Trong đó:

- `salary_type` quyết định cách hiểu `base_rate` trong hợp đồng:
  - `MONTHLY`: `base_salary_amount = (base_rate / required_work_days) × tong_work_credit`
  - `DAILY`: `base_salary_amount = base_rate × tong_work_credit`
  - `HOURLY`: `base_salary_amount = base_rate × tong_paid_hours`
- `Thưởng chấm công` dựa trên số ca hợp lệ hoặc số ngày công đạt chuẩn.
- `Thưởng tăng ca = overtime_hours_total × overtime_rate_per_hour`.
- `Thưởng hiệu suất` tính theo số member phụ trách hoặc số buổi PT hoàn thành đạt ngưỡng trong hợp đồng.
- `Hoa hồng gói tập` tính theo phần trăm hoặc số tiền cố định cho các member/gói PT phụ trách.
- `Hoa hồng bán hàng` áp dụng nếu PT có bán gói tập hoặc dịch vụ.
- `Khấu trừ` áp dụng theo hợp đồng hoặc vi phạm nội quy.
- `tong_work_credit` là tổng công quy đổi của kỳ lương (`1`, `0.5`, `0` theo từng ca).
- `tong_paid_hours` là tổng số giờ được trả lương sau khi áp dụng chính sách ca.

**Vòng đời bảng lương:** `DRAFT → PENDING_APPROVAL → APPROVED → PAID`

### 5.5 Quy tắc sản phẩm và hóa đơn

- Mỗi hóa đơn có nhiều dòng sản phẩm.
- Khi hóa đơn được xác nhận (`status = CONFIRMED`), hệ thống tự động trừ tồn kho bằng cách tạo giao dịch kho loại `SALE`.
- Khi hóa đơn được xác nhận, hệ thống đồng thời ghi nhận `COGS` thông qua `inventory_transactions.unit_cost`.
- Hủy hóa đơn (`status = CANCELLED`) cần tạo giao dịch kho ngược (`ADJUSTMENT`) nếu hàng chưa sử dụng.
- Phương pháp tính giá vốn mặc định của hệ thống là `weighted average cost`.

**Vòng đời hóa đơn:** `DRAFT → CONFIRMED → CANCELLED`

### 5.6 Quy tắc chi phí sửa chữa và thay mới thiết bị

- Thiết bị có thể có nhiều lần bảo trì / sửa chữa.
- Nếu thiết bị không thể sửa chữa, tạo phiếu thay thế thiết bị và cập nhật `equipment_assets.status = REPLACED`.
- Chi phí thay mới được đưa vào báo cáo chi phí vận hành.
- Phiếu chi dùng vòng đời: `DRAFT → PENDING_APPROVAL → APPROVED/REJECTED → PAID`.

---

## 6. Thiết kế cơ sở dữ liệu PostgreSQL

> **Quy ước chung cho tất cả bảng:**
> - Dùng `UUID` làm primary key.
> - Mọi bảng đều có `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`.
> - Bảng master có thể ẩn khỏi UI dùng `deleted_at TIMESTAMPTZ` (soft delete).
> - Bảng giao dịch tài chính ưu tiên quản lý vòng đời qua `status`, không xóa qua API.
> - Bảng có thể thay đổi bởi Admin có thêm `created_by UUID` và `updated_by UUID` (FK tới `users`).

### 6.1 Nhóm bảng người dùng và phân quyền

#### `users`

- `id` UUID PK
- `email` VARCHAR UNIQUE NOT NULL
- `password_hash` VARCHAR NOT NULL
- `role` ENUM(`ADMIN`, `PT`, `STAFF`) NOT NULL
- `status` ENUM(`ACTIVE`, `INACTIVE`) DEFAULT `ACTIVE`
- `created_at`, `updated_at`, `deleted_at`

#### `user_profiles`

- `id` UUID PK
- `user_id` UUID FK → `users.id`
- `full_name` VARCHAR NOT NULL
- `phone` VARCHAR
- `address` TEXT
- `avatar_url` VARCHAR
- `date_of_birth` DATE

#### `refresh_tokens`

> *(Bổ sung so với v1.0 — phục vụ Auth)*

- `id` UUID PK
- `user_id` UUID FK → `users.id`
- `token_hash` VARCHAR UNIQUE NOT NULL
- `expires_at` TIMESTAMPTZ NOT NULL
- `revoked_at` TIMESTAMPTZ
- `created_at`

#### `system_configs`

> *(Bổ sung so với v1.0 — phục vụ Settings)*

- `id` UUID PK
- `key` VARCHAR UNIQUE NOT NULL
- `value` TEXT NOT NULL
- `description` TEXT
- `updated_by` UUID FK → `users.id`
- `updated_at`

#### `audit_logs`

> *(Bổ sung so với v1.0 — phục vụ kiểm toán)*

- `id` UUID PK
- `table_name` VARCHAR NOT NULL
- `record_id` UUID NOT NULL
- `action` ENUM(`CREATE`, `UPDATE`, `DELETE`) NOT NULL
- `changed_by` UUID FK → `users.id`
- `old_data` JSONB
- `new_data` JSONB
- `changed_at` TIMESTAMPTZ NOT NULL

### 6.2 Nhóm bảng PT

#### `personal_trainers`

- `id` UUID PK
- `user_id` UUID FK → `users.id`
- `code` VARCHAR UNIQUE NOT NULL
- `specialty` VARCHAR
- `experience_years` INT
- `hire_date` DATE
- `employment_status` ENUM(`ACTIVE`, `RESIGNED`, `ON_LEAVE`)
- `notes` TEXT
- `created_at`, `updated_at`, `deleted_at`

#### `pt_contracts`

- `id` UUID PK
- `pt_id` UUID FK → `personal_trainers.id`
- `contract_code` VARCHAR UNIQUE NOT NULL
- `salary_type` ENUM(`MONTHLY`, `DAILY`, `HOURLY`)
- `base_rate` NUMERIC(15,2) NOT NULL — *đơn giá tương ứng với `salary_type`*
- `required_work_days` INT
- `min_valid_shift_hours` NUMERIC(4,2) DEFAULT 5
- `standard_shift_hours` NUMERIC(4,2) DEFAULT 8
- `overtime_rate_per_hour` NUMERIC(15,2)
- `attendance_bonus` NUMERIC(15,2)
- `performance_bonus_rules` JSONB — *mô tả ngưỡng thưởng hiệu suất*
- `sales_commission_percent` NUMERIC(5,2)
- `package_commission_percent` NUMERIC(5,2)
- `allowance_amount` NUMERIC(15,2)
- `deduction_rules` JSONB — *mô tả quy tắc khấu trừ*
- `effective_from` DATE NOT NULL
- `effective_to` DATE
- `is_active` BOOLEAN DEFAULT true
- `created_by` UUID FK → `users.id`
- `created_at`, `updated_at`

#### `pt_attendance_logs`

- `id` UUID PK
- `pt_id` UUID FK → `personal_trainers.id`
- `attendance_date` DATE NOT NULL
- `check_in_at` TIMESTAMPTZ
- `check_out_at` TIMESTAMPTZ
- `worked_hours` NUMERIC(5,2)
- `paid_hours` NUMERIC(5,2)
- `work_credit` NUMERIC(3,2) — *0, 0.5 hoặc 1*
- `overtime_hours` NUMERIC(5,2)
- `status` ENUM(`VALID`, `INVALID`, `HALF`, `OPEN`)
- `note` TEXT
- `created_at`, `updated_at`

#### `pt_payroll_periods`

- `id` UUID PK
- `code` VARCHAR UNIQUE NOT NULL
- `month` SMALLINT NOT NULL
- `year` SMALLINT NOT NULL
- `start_date` DATE NOT NULL
- `end_date` DATE NOT NULL
- `status` ENUM(`OPEN`, `LOCKED`, `APPROVED`, `PAID`) DEFAULT `OPEN`
- `created_at`, `updated_at`

#### `pt_payrolls`

- `id` UUID PK
- `payroll_period_id` UUID FK → `pt_payroll_periods.id`
- `pt_id` UUID FK → `personal_trainers.id`
- `contract_id` UUID FK → `pt_contracts.id`
- `work_credit_total` NUMERIC(8,2)
- `paid_hours_total` NUMERIC(8,2)
- `overtime_hours_total` NUMERIC(8,2)
- `base_salary_amount` NUMERIC(15,2)
- `attendance_bonus_amount` NUMERIC(15,2)
- `overtime_amount` NUMERIC(15,2)
- `performance_bonus_amount` NUMERIC(15,2) — *(bổ sung so với v1.0)*
- `package_commission_amount` NUMERIC(15,2)
- `sales_commission_amount` NUMERIC(15,2)
- `allowance_amount` NUMERIC(15,2)
- `deduction_amount` NUMERIC(15,2)
- `total_amount` NUMERIC(15,2)
- `status` ENUM(`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `PAID`) DEFAULT `DRAFT` — *(bổ sung so với v1.0)*
- `generated_at` TIMESTAMPTZ
- `approved_by` UUID FK → `users.id`
- `approved_at` TIMESTAMPTZ — *(bổ sung so với v1.0)*
- `created_at`, `updated_at`

### 6.3 Nhóm bảng members và vé tập

#### `members`

- `id` UUID PK
- `code` VARCHAR UNIQUE NOT NULL
- `full_name` VARCHAR NOT NULL
- `phone` VARCHAR
- `email` VARCHAR
- `gender` ENUM(`MALE`, `FEMALE`, `OTHER`)
- `date_of_birth` DATE
- `address` TEXT
- `height_cm` NUMERIC(5,1)
- `weight_kg` NUMERIC(5,1)
- `fitness_goal` TEXT
- `health_note` TEXT
- `joined_at` DATE
- `status` ENUM(`ACTIVE`, `INACTIVE`)
- `created_at`, `updated_at`, `deleted_at`

#### `membership_plans`

- `id` UUID PK
- `code` VARCHAR UNIQUE NOT NULL
- `name` VARCHAR NOT NULL
- `plan_type` ENUM(`DAY`, `MONTH`, `YEAR`) NOT NULL
- `price` NUMERIC(15,2) NOT NULL
- `duration_days` INT NOT NULL
- `visit_limit` INT
- `is_unlimited` BOOLEAN DEFAULT false
- `includes_pt` BOOLEAN DEFAULT false
- `pt_session_limit` INT
- `benefits` JSONB
- `status` ENUM(`ACTIVE`, `INACTIVE`)
- `created_at`, `updated_at`

#### `member_memberships`

- `id` UUID PK
- `member_id` UUID FK → `members.id`
- `plan_id` UUID FK → `membership_plans.id`
- `start_date` DATE NOT NULL
- `end_date` DATE NOT NULL
- `remaining_visits` INT
- `price_at_purchase` NUMERIC(15,2) NOT NULL
- `status` ENUM(`ACTIVE`, `EXPIRED`, `CANCELLED`)
- `created_at`, `updated_at`, `deleted_at`

#### `membership_invoices`

> *(Bổ sung so với v1.0 — làm rõ luồng thanh toán vé)*

- `id` UUID PK
- `invoice_no` VARCHAR UNIQUE NOT NULL
- `membership_id` UUID FK → `member_memberships.id`
- `member_id` UUID FK → `members.id`
- `seller_user_id` UUID FK → `users.id`
- `invoice_date` TIMESTAMPTZ NOT NULL
- `amount` NUMERIC(15,2) NOT NULL
- `discount_amount` NUMERIC(15,2) DEFAULT 0
- `total_amount` NUMERIC(15,2) NOT NULL
- `payment_method` ENUM(`CASH`, `TRANSFER`, `CARD`)
- `status` ENUM(`CONFIRMED`, `CANCELLED`)
- `note` TEXT
- `created_at`, `updated_at`

#### `member_pt_assignments`

- `id` UUID PK
- `member_id` UUID FK → `members.id`
- `pt_id` UUID FK → `personal_trainers.id`
- `membership_id` UUID FK → `member_memberships.id`
- `commission_type` ENUM(`PERCENT`, `FIXED`)
- `commission_value` NUMERIC(15,2)
- `started_at` DATE
- `ended_at` DATE
- `status` ENUM(`ACTIVE`, `ENDED`)
- `note` TEXT
- `created_at`, `updated_at`

### 6.4 Nhóm bảng bán hàng dịch vụ

#### `products`

- `id` UUID PK
- `sku` VARCHAR UNIQUE NOT NULL
- `name` VARCHAR NOT NULL
- `category` VARCHAR
- `unit` VARCHAR
- `cost_price` NUMERIC(15,2)
- `sell_price` NUMERIC(15,2) NOT NULL
- `quantity_in_stock` INT DEFAULT 0
- `minimum_stock_level` INT DEFAULT 0
- `status` ENUM(`ACTIVE`, `INACTIVE`)
- `created_at`, `updated_at`, `deleted_at`

#### `sales_invoices`

- `id` UUID PK
- `invoice_no` VARCHAR UNIQUE NOT NULL
- `member_id` UUID FK → `members.id` (nullable — khách lẻ)
- `seller_user_id` UUID FK → `users.id`
- `invoice_date` TIMESTAMPTZ NOT NULL
- `subtotal_amount` NUMERIC(15,2)
- `discount_amount` NUMERIC(15,2) DEFAULT 0
- `total_amount` NUMERIC(15,2)
- `payment_method` ENUM(`CASH`, `TRANSFER`, `CARD`)
- `status` ENUM(`DRAFT`, `CONFIRMED`, `CANCELLED`)
- `note` TEXT
- `created_at`, `updated_at`

#### `sales_invoice_items`

- `id` UUID PK
- `invoice_id` UUID FK → `sales_invoices.id`
- `product_id` UUID FK → `products.id`
- `quantity` INT NOT NULL
- `unit_price` NUMERIC(15,2) NOT NULL
- `line_total` NUMERIC(15,2) NOT NULL
- `created_at`

### 6.5 Nhóm bảng kho

#### `inventory_transactions`

- `id` UUID PK
- `product_id` UUID FK → `products.id`
- `transaction_type` ENUM(`IMPORT`, `SALE`, `DAMAGE`, `INTERNAL_USE`, `ADJUSTMENT`) NOT NULL
- `reference_type` VARCHAR — *tên bảng tham chiếu*
- `reference_id` UUID — *id bản ghi tham chiếu*
- `quantity` INT NOT NULL — *âm nếu xuất, dương nếu nhập*
- `unit_cost` NUMERIC(15,2)
- `transaction_date` TIMESTAMPTZ NOT NULL
- `created_by` UUID FK → `users.id`
- `note` TEXT
- `created_at`

#### `purchase_receipts`

- `id` UUID PK
- `receipt_no` VARCHAR UNIQUE NOT NULL
- `supplier_name` VARCHAR
- `receipt_date` DATE NOT NULL
- `total_amount` NUMERIC(15,2)
- `status` ENUM(`PENDING`, `CONFIRMED`)
- `note` TEXT
- `created_by` UUID FK → `users.id`
- `created_at`, `updated_at`

#### `purchase_receipt_items`

- `id` UUID PK
- `receipt_id` UUID FK → `purchase_receipts.id`
- `product_id` UUID FK → `products.id`
- `quantity` INT NOT NULL
- `unit_cost` NUMERIC(15,2)
- `line_total` NUMERIC(15,2)

### 6.6 Nhóm bảng chi phí vận hành và thiết bị

#### `equipment_assets`

- `id` UUID PK
- `asset_code` VARCHAR UNIQUE NOT NULL
- `name` VARCHAR NOT NULL
- `category` VARCHAR
- `purchase_date` DATE
- `purchase_cost` NUMERIC(15,2)
- `status` ENUM(`IN_USE`, `UNDER_MAINTENANCE`, `REPLACED`, `DISPOSED`)
- `condition_status` ENUM(`GOOD`, `FAIR`, `POOR`)
- `location` VARCHAR
- `note` TEXT
- `created_at`, `updated_at`, `deleted_at`

#### `operating_expenses`

- `id` UUID PK
- `expense_no` VARCHAR UNIQUE NOT NULL
- `expense_date` DATE NOT NULL
- `category` ENUM(`CLEANING`, `MAINTENANCE`, `REPAIR`, `REPLACEMENT`, `UTILITY`, `OTHER`)
- `amount` NUMERIC(15,2) NOT NULL
- `equipment_id` UUID FK → `equipment_assets.id` (nullable)
- `vendor_name` VARCHAR
- `description` TEXT
- `attachment_url` VARCHAR
- `status` ENUM(`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `PAID`) DEFAULT `DRAFT`
- `submitted_at` TIMESTAMPTZ
- `approved_by` UUID FK → `users.id`
- `approved_at` TIMESTAMPTZ — *(bổ sung so với v1.0)*
- `rejected_at` TIMESTAMPTZ
- `rejection_reason` TEXT
- `paid_at` TIMESTAMPTZ
- `created_by` UUID FK → `users.id`
- `created_at`, `updated_at`

#### `maintenance_logs`

- `id` UUID PK
- `equipment_id` UUID FK → `equipment_assets.id`
- `maintenance_type` ENUM(`PREVENTIVE`, `CORRECTIVE`, `REPLACEMENT`)
- `performed_at` DATE NOT NULL
- `vendor_name` VARCHAR
- `cost_amount` NUMERIC(15,2)
- `result_status` ENUM(`RESOLVED`, `UNRESOLVED`, `REPLACED`)
- `note` TEXT
- `created_by` UUID FK → `users.id`
- `created_at`, `updated_at`

---

## 7. Kiến trúc module NestJS đề xuất

```text
apps/nestjs-backend/src/modules
├─ auth           ← JWT, refresh token, guards
├─ users
├─ config         ← system_configs, settings API (bổ sung)
├─ dashboard
├─ personal-trainers
├─ pt-contracts
├─ attendance
├─ payroll
├─ members
├─ membership-plans
├─ member-assignments
├─ membership-invoices   ← thanh toán vé tập (bổ sung)
├─ products
├─ inventory
├─ sales
├─ expenses
├─ equipment
├─ maintenance
├─ reports
└─ audit          ← audit_logs (bổ sung)
```

### API chính đề xuất

> **Chuẩn response chung:**
> ```json
> {
>   "data": { ... } | [ ... ],
>   "meta": { "total": 100, "page": 1, "limit": 20 },
>   "error": null
> }
> ```
> **Chuẩn error response:**
> ```json
> {
>   "data": null,
>   "error": { "code": "RESOURCE_NOT_FOUND", "message": "PT not found" }
> }
> ```

#### Auth

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| POST | `/auth/login` | Đăng nhập | Public |
| POST | `/auth/refresh` | Làm mới access token | Public |
| POST | `/auth/logout` | Đăng xuất | All |
| GET | `/auth/me` | Thông tin user hiện tại | All |

#### Dashboard

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/dashboard/summary` | Thống kê tổng quan | Admin, Staff |
| GET | `/dashboard/revenue-chart` | Biểu đồ doanh thu | Admin |
| GET | `/dashboard/expense-chart` | Biểu đồ chi phí | Admin |

#### PT

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/pts` | Danh sách PT (filter, sort, page) | Admin |
| POST | `/pts` | Tạo PT mới | Admin |
| GET | `/pts/:id` | Chi tiết PT | Admin, PT (chính mình) |
| PATCH | `/pts/:id` | Cập nhật PT | Admin |
| DELETE | `/pts/:id` | Soft delete PT | Admin |
| GET | `/pts/:id/contracts` | Lịch sử hợp đồng | Admin |
| POST | `/pts/:id/contracts` | Tạo hợp đồng mới | Admin |
| PATCH | `/pts/:id/contracts/:contractId` | Cập nhật hợp đồng | Admin |

#### Attendance

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| POST | `/attendance/check-in` | Check In | PT |
| POST | `/attendance/check-out` | Check Out | PT |
| GET | `/attendance` | Toàn bộ lịch sử (filter by date, pt) | Admin |
| GET | `/attendance/pt/:ptId` | Lịch sử của một PT cụ thể | Admin |
| GET | `/attendance/me` | Lịch sử chấm công của chính PT đang đăng nhập | PT |
| PATCH | `/attendance/:id` | Chỉnh sửa ca (Admin only) | Admin |

#### Payroll

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/payroll/periods` | Danh sách kỳ lương | Admin |
| POST | `/payroll/periods` | Tạo kỳ lương | Admin |
| POST | `/payroll/generate` | Tính lương cho kỳ | Admin |
| GET | `/payroll/periods/:id` | Chi tiết kỳ lương | Admin |
| POST | `/payroll/periods/:id/approve` | Duyệt bảng lương | Admin |
| GET | `/payroll/pt/:ptId` | Lịch sử lương của một PT cụ thể | Admin |
| GET | `/payroll/me` | Lịch sử lương của chính PT đang đăng nhập | PT |

#### Members

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/members` | Danh sách members (filter, page) | Admin, Staff |
| POST | `/members` | Tạo member mới | Admin, Staff |
| GET | `/members/:id` | Chi tiết member | Admin, Staff |
| PATCH | `/members/:id` | Cập nhật member | Admin, Staff |
| DELETE | `/members/:id` | Soft delete member | Admin |

#### Membership Plans

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/membership-plans` | Danh sách gói vé | Admin, Staff |
| POST | `/membership-plans` | Tạo gói vé | Admin |
| PATCH | `/membership-plans/:id` | Cập nhật gói vé | Admin |
| DELETE | `/membership-plans/:id` | Vô hiệu hóa gói | Admin |

#### Member Memberships

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/member-memberships` | Danh sách vé member | Admin, Staff |
| POST | `/member-memberships` | Bán vé cho member | Admin, Staff |
| GET | `/member-memberships/:id` | Chi tiết vé | Admin, Staff |
| POST | `/member-memberships/:id/renew` | Gia hạn vé | Admin, Staff |
| POST | `/member-memberships/:id/cancel` | Hủy vé | Admin |

#### Member PT Assignments *(bổ sung, là nguồn sự thật cho PT phụ trách)*

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/member-assignments` | Danh sách phân công PT-member | Admin, Staff |
| POST | `/member-assignments` | Gán PT cho member | Admin, Staff |
| POST | `/member-assignments/:id/end` | Kết thúc phân công PT | Admin, Staff |
| GET | `/members/:id/pt-assignments` | Lịch sử PT của một member | Admin, Staff |

#### Membership Invoices *(bổ sung)*

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/membership-invoices` | Danh sách hóa đơn vé | Admin |
| GET | `/membership-invoices/:id` | Chi tiết hóa đơn vé | Admin, Staff |

#### Products and Inventory

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/products` | Danh sách sản phẩm | Admin, Staff |
| POST | `/products` | Tạo sản phẩm | Admin |
| PATCH | `/products/:id` | Cập nhật sản phẩm | Admin |
| DELETE | `/products/:id` | Soft delete sản phẩm | Admin |
| POST | `/inventory/import` | Nhập kho | Admin, Staff |
| POST | `/inventory/adjust` | Điều chỉnh tồn kho | Admin |
| GET | `/inventory/transactions` | Lịch sử giao dịch kho | Admin |

#### Sales

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/sales/invoices` | Danh sách hóa đơn dịch vụ | Admin, Staff |
| POST | `/sales/invoices` | Tạo hóa đơn | Admin, Staff |
| GET | `/sales/invoices/:id` | Chi tiết hóa đơn | Admin, Staff |
| POST | `/sales/invoices/:id/confirm` | Xác nhận hóa đơn | Admin, Staff |
| POST | `/sales/invoices/:id/cancel` | Hủy hóa đơn | Admin |

#### Expenses and Maintenance

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/expenses` | Danh sách phiếu chi | Admin |
| POST | `/expenses` | Tạo phiếu chi | Admin, Staff |
| GET | `/expenses/:id` | Chi tiết phiếu chi | Admin |
| PATCH | `/expenses/:id` | Cập nhật phiếu chi khi còn ở trạng thái `DRAFT` hoặc `REJECTED` | Admin, Staff |
| POST | `/expenses/:id/submit` | Gửi duyệt phiếu chi | Admin, Staff |
| POST | `/expenses/:id/approve` | Duyệt phiếu chi | Admin |
| POST | `/expenses/:id/reject` | Từ chối phiếu chi | Admin |
| POST | `/expenses/:id/mark-paid` | Đánh dấu đã chi trả | Admin |
| GET | `/equipment` | Danh sách thiết bị | Admin |
| POST | `/equipment` | Thêm thiết bị | Admin |
| PATCH | `/equipment/:id` | Cập nhật thiết bị | Admin |
| GET | `/maintenance` | Lịch sử bảo trì | Admin |
| POST | `/maintenance` | Ghi nhận bảo trì | Admin |

#### Reports

| Method | Endpoint | Query Params | Role |
|---|---|---|---|
| GET | `/reports/revenue` | `from`, `to`, `groupBy` | Admin |
| GET | `/reports/payroll` | `periodId` | Admin |
| GET | `/reports/inventory` | - | Admin |
| GET | `/reports/expenses` | `from`, `to`, `category` | Admin |
| GET | `/reports/profit` | `from`, `to` | Admin |
| GET | `/reports/revenue/export` | `format=pdf\|xlsx` | Admin |
| GET | `/reports/payroll/export` | `format=pdf\|xlsx` | Admin |

#### Settings *(bổ sung)*

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| GET | `/settings` | Toàn bộ cấu hình | Admin |
| PATCH | `/settings/:key` | Cập nhật một cấu hình | Admin |

---

## 8. Cấu trúc màn hình NextJS đề xuất

```text
apps/nextjs-frontend/src/app
├─ (auth)
│  └─ login/page.tsx
├─ dashboard/page.tsx
├─ pts
│  ├─ page.tsx               ← Danh sách PT
│  ├─ [id]/page.tsx          ← Chi tiết PT
│  ├─ [id]/contracts/page.tsx
│  └─ attendance/page.tsx
├─ payroll
│  ├─ page.tsx               ← Danh sách kỳ lương
│  └─ [periodId]/page.tsx    ← Chi tiết kỳ lương
├─ members
│  ├─ page.tsx               ← Danh sách members
│  ├─ [id]/page.tsx          ← Chi tiết member
│  └─ memberships/page.tsx   ← Mua / gia hạn vé
├─ membership-plans
│  └─ page.tsx
├─ membership-invoices        ← (bổ sung)
│  └─ page.tsx
├─ products/page.tsx
├─ inventory
│  ├─ page.tsx
│  └─ import/page.tsx
├─ invoices
│  ├─ page.tsx
│  └─ [id]/page.tsx
├─ expenses
│  ├─ page.tsx
│  └─ [id]/page.tsx
├─ equipment
│  ├─ page.tsx
│  └─ [id]/page.tsx
├─ maintenance/page.tsx
├─ reports
│  ├─ revenue/page.tsx
│  ├─ payroll/page.tsx
│  ├─ inventory/page.tsx
│  ├─ expenses/page.tsx
│  └─ profit/page.tsx
└─ settings/page.tsx          ← (bổ sung)
```

### Màn hình cần có

- Trang đăng nhập.
- Dashboard tổng quan.
- Danh sách PT / Chi tiết PT / Hợp đồng PT / Chấm công PT.
- Bảng lương PT (danh sách kỳ, chi tiết kỳ, duyệt lương).
- Danh sách members / Chi tiết member.
- Danh sách gói vé / Mua & gia hạn vé cho member.
- Hóa đơn vé tập.
- Danh sách sản phẩm dịch vụ.
- Nhập kho / Lịch sử giao dịch kho.
- Hóa đơn bán hàng dịch vụ.
- Phiếu chi vận hành.
- Quản lý thiết bị / Lịch sử bảo trì.
- Báo cáo thống kê (doanh thu, lương, chi phí, lợi nhuận, kho) + xuất PDF/Excel.
- Trang cấu hình chính sách (Settings).

---

## 9. Luồng nghiệp vụ chính

### 9.1 Đăng ký member và bán vé

```text
Nhân viên → Tạo hồ sơ member
         → Chọn gói vé (DAY / MONTH / YEAR)
         → Nếu gói có PT → Chọn PT phụ trách
         → Xác nhận thanh toán
         → Hệ thống tạo member_memberships (status=ACTIVE)
         → Hệ thống tạo membership_invoices (status=CONFIRMED)
         → Hệ thống tạo member_pt_assignments nếu có PT
```

### 9.2 PT chấm công

```text
PT → Check In → Hệ thống tạo attendance log (status=OPEN)
PT → Check Out → Hệ thống tính worked_hours
              → Nếu worked_hours ≥ min_valid_shift_hours → status=VALID, work_credit=1
              → Nếu worked_hours < min_valid_shift_hours → status=INVALID hoặc HALF (theo config)
              → Nếu worked_hours > standard_shift_hours → overtime_hours = worked_hours - standard_shift_hours
```

### 9.3 Bán sản phẩm dịch vụ

```text
Nhân viên → Tạo hóa đơn (status=DRAFT)
          → Thêm sản phẩm và số lượng
          → Xác nhận thanh toán → status=CONFIRMED
          → Hệ thống tạo inventory_transaction (type=SALE) → trừ tồn kho
```

### 9.4 Ghi nhận chi phí sửa chữa / thay mới

```text
Nhân viên → Tạo phiếu chi
           → Chọn loại chi phí & thiết bị liên quan
           → Ghi số tiền, mô tả, upload chứng từ
           → Submit duyệt → status=PENDING_APPROVAL
           → Admin duyệt hoặc từ chối
           → Nếu duyệt → approved_by, approved_at, status=APPROVED
           → Khi chi tiền thực tế → status=PAID, paid_at
           → Hệ thống đưa vào báo cáo chi phí vận hành
```

### 9.5 Tính lương PT cuối kỳ

```text
Admin → Tạo payroll_period (OPEN)
      → POST /payroll/generate → Hệ thống tính lương từng PT
        (lấy hợp đồng hiệu lực, tổng hợp attendance, overtime, hoa hồng)
      → Kết quả: pt_payrolls (status=PENDING_APPROVAL)
      → Admin review → POST /payroll/periods/:id/approve → status=APPROVED
      → Thanh toán thực tế → status=PAID
```

---

## 10. Báo cáo đề xuất

### 10.1 Báo cáo doanh thu

- Doanh thu theo ngày / tuần / tháng / năm.
- Doanh thu theo nguồn: vé tập, bán sản phẩm dịch vụ.
- So sánh doanh thu giữa các tháng.
- Xuất file: **PDF**, **Excel**.

### 10.2 Báo cáo PT

- Tổng số PT.
- Lương từng PT.
- Số ngày công hợp lệ.
- Số giờ tăng ca.
- Hoa hồng từng PT.
- Danh sách members PT đang phụ trách.
- Xuất file: **PDF**, **Excel**.

### 10.3 Báo cáo members

- Tổng số members.
- Members đang hoạt động.
- Members theo loại vé.
- Members sắp hết hạn vé (trong vòng 7 / 14 / 30 ngày).
- Members có PT phụ trách.

### 10.4 Báo cáo kho và dịch vụ

- Tồn kho hiện tại.
- Hàng bán chạy.
- Hàng sắp hết (dưới ngưỡng `minimum_stock_level`).
- Lịch sử nhập xuất kho.
- Xuất file: **Excel**.

### 10.5 Báo cáo chi phí

- Chi phí dọn dẹp.
- Chi phí bảo trì.
- Chi phí sửa chữa.
- Chi phí thay mới thiết bị.
- Tổng chi phí theo tháng.
- Thiết bị phát sinh chi phí nhiều nhất.
- Xuất file: **PDF**, **Excel**.

### 10.6 Báo cáo lợi nhuận

```text
Loi_nhuan_rong =
  Tong_doanh_thu
  - Gia_von_hang_ban (COGS)
  - Tong_luong_PT
  - Tong_chi_phi_van_hanh
```

- Lợi nhuận theo tháng / quý / năm.
- So sánh lợi nhuận giữa các kỳ.
- `COGS` được lấy từ giá vốn của các giao dịch `SALE` trong `inventory_transactions`.
- Xuất file: **PDF**, **Excel**.

---

## 11. Quy tắc phân quyền đề xuất

### Admin

- Toàn quyền CRUD trên mọi resource.
- Duyệt bảng lương và phiếu chi.
- Quản lý hợp đồng PT.
- Quản lý chính sách giá vé, thưởng, hoa hồng.
- Truy cập toàn bộ báo cáo và audit logs.
- Cấu hình Settings hệ thống.

### PT (Role permissions)

- Xem thông tin cá nhân (chỉ của mình).
- Check In / Check Out.
- Xem members được phân công.
- Xem lương của chính mình.
- **Không được** truy cập dữ liệu tài chính, hợp đồng PT khác, hoặc cấu hình hệ thống.

### Staff

- Tạo và cập nhật members.
- Bán vé và tạo membership invoices.
- Tạo hóa đơn dịch vụ và xác nhận thanh toán.
- Nhập kho (nếu được phân quyền).
- **Không được** xem hoặc sửa hợp đồng PT, bảng lương, báo cáo tài chính, Settings.

---

## 12. Gợi ý triển khai kỹ thuật

### Frontend NextJS

- Dùng App Router.
- Dùng `React Query (TanStack Query)` để gọi API, caching, invalidation.
- Dùng `React Hook Form` + `Zod` để validate form.
- Dùng `PrimeReact` hoặc UI hiện có trong boilerplate để làm dashboard, table, dialog, report filters.
- Implement route guard theo role (redirect nếu không đủ quyền).
- Lưu `access_token` trong memory (không dùng localStorage), `refresh_token` trong `httpOnly cookie`.

### Backend NestJS

- Tách module theo nghiệp vụ (xem mục 7).
- Dùng `MikroORM` với PostgreSQL.
- Dùng DTO trong `packages/shared` để chia sẻ type giữa frontend và backend.
- Dùng `JwtAuthGuard` + `RolesGuard` cho phân quyền.
- Với endpoint PT tự xem dữ liệu, ưu tiên route `.../me` để tránh lộ dữ liệu chéo.
- Implement `AuditInterceptor` để tự động ghi `audit_logs` cho các thao tác quan trọng.
- Dùng `Bull` hoặc `BullMQ` nếu cần xử lý tính lương bất đồng bộ ở quy mô lớn.

### PostgreSQL

- Tạo index cho:
  - `pt_attendance_logs.attendance_date`
  - `pt_attendance_logs.pt_id`
  - `sales_invoices.invoice_date`
  - `membership_invoices.invoice_date`
  - `operating_expenses.expense_date`
  - `operating_expenses.status`
  - `member_memberships.member_id`
  - `member_memberships.end_date` — phục vụ query vé sắp hết hạn
  - `member_pt_assignments.member_id`
  - `member_pt_assignments.pt_id`
  - `member_pt_assignments.status`
  - `inventory_transactions.product_id`
- Dùng foreign key để đảm bảo toàn vẹn dữ liệu.
- Các cột `deleted_at` cần có **partial index** (`WHERE deleted_at IS NULL`) để query nhanh trên dữ liệu chưa xóa.

---

## 13. Kết quả mong muốn của hệ thống

Sau khi triển khai, ứng dụng cần hỗ trợ:

- Xác thực và phân quyền rõ ràng theo 3 role: Admin, PT, Staff.
- Quản lý đầy đủ PT, members, vé tập.
- Theo dõi chính xác chấm công PT và tính lương theo hợp đồng, tăng ca, hoa hồng.
- Luồng thanh toán vé tập và sản phẩm dịch vụ rõ ràng, truy vết được.
- Quản lý PT phụ trách member bằng lịch sử phân công rõ ràng, không trùng nguồn dữ liệu.
- Quản lý nhập xuất tồn kho, cảnh báo hàng sắp hết.
- Quản lý chi phí vận hành, bảo trì và thay thế thiết bị với phiếu duyệt.
- Cung cấp báo cáo doanh thu, lợi nhuận, lương PT, kho với tính năng xuất PDF/Excel và có tính `COGS`.
- Ghi lại audit log cho các thao tác quan trọng phục vụ kiểm toán.
- Hệ thống cấu hình linh hoạt, Admin có thể chỉnh chính sách mà không cần deploy lại.

---

## 14. Tóm tắt ngắn gọn mô hình hệ thống

Ứng dụng quản lý phòng Gym gồm **7 phân hệ cốt lõi**:

1. `Auth & Config`: đăng nhập, phân quyền, cấu hình hệ thống.
2. `PT Management`: hồ sơ PT, hợp đồng, chấm công, bảng lương.
3. `Member Management`: hồ sơ member, vé tập, PT phụ trách.
4. `Sales Management`: bán vé (kèm hóa đơn riêng), bán sản phẩm dịch vụ.
5. `Inventory Management`: nhập kho, xuất kho, tồn kho, cảnh báo.
6. `Expense & Equipment Management`: chi phí, bảo trì, sửa chữa, thay mới thiết bị.
7. `Reports & Analytics`: doanh thu, chi phí, lương PT, lợi nhuận, thống kê vận hành — xuất PDF/Excel.

Tài liệu này có thể dùng làm nền tảng để tiếp tục:

- Thiết kế ERD chi tiết.
- Viết migration PostgreSQL.
- Tạo module NestJS.
- Tạo giao diện NextJS.
- Viết API, middleware, guards và báo cáo thống kê.
