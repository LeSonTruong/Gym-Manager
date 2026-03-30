# Gym Management System Specification

## 1. Tổng quan

Đây là tài liệu đặc tả cho ứng dụng quản lý phòng Gym xây dựng với:

- Frontend: `NextJS`
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

## 2. Vai trò người dùng

### 2.1 Admin

- Quản lý toàn bộ hệ thống.
- Quản lý PT, members, vé tập, sản phẩm dịch vụ, hóa đơn, tồn kho, chi phí.
- Quản lý hợp đồng PT: lương cơ bản, mức thưởng, mức tăng ca, hoa hồng.
- Xem báo cáo doanh thu, chi phí, lương, hiệu suất PT.

### 2.2 PT

- Xem thông tin cá nhân.
- Check In và Check Out ca làm việc.
- Xem members đang phụ trách.
- Xem lương tạm tính, giờ tăng ca, hoa hồng.

### 2.3 Nhân viên lễ tân / bán hàng

- Tạo member mới.
- Bán vé tập.
- Tạo hóa đơn bán sản phẩm dịch vụ.
- Ghi nhận nhập kho, xuất kho nếu được phân quyền.

---

## 3. Phạm vi chức năng chính

### 3.1 Dashboard tổng quan

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

### 3.2 Quản lý PT

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
- Mức thưởng theo hiệu suất.
- Hoa hồng theo gói tập PT phụ trách.
- Hoa hồng theo doanh số bán gói tập.
- Phụ cấp khác.
- Khoản phạt nếu có.
- Ngày hiệu lực hợp đồng.
- Ngày hết hạn hợp đồng.

### 3.3 Quản lý chấm công PT

Chức năng:

- PT Check In khi bắt đầu làm việc.
- PT Check Out khi kết thúc làm việc.
- Hệ thống tính tổng số giờ làm trong ngày.
- Xác định ca làm hợp lệ hay không hợp lệ.
- Tính số giờ tăng ca.
- Tổng hợp công theo ngày, tuần, tháng.

Quy tắc nghiệp vụ:

- Một PT chỉ được `Check In` một lần cho một ca đang mở.
- `Check Out` chỉ hợp lệ khi thời gian làm việc trong ngày đạt tối thiểu `5 giờ`.
- Nếu dưới `5 giờ`, hệ thống đánh dấu là `ca chưa đạt chuẩn` hoặc `không tính công`, tùy cấu hình Admin.
- Số giờ vượt quá số giờ chuẩn trong hợp đồng được tính là `Overtime`.
- Overtime được quy đổi thành tiền thưởng theo hợp đồng của PT.
- Admin có thể chỉnh quy tắc theo từng PT vì hợp đồng có thể khác nhau.

### 3.4 Quản lý members

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

### 3.5 Quản lý vé tập

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

### 3.6 Quản lý PT phụ trách member

- Một member có thể được gán PT phụ trách nếu gói vé có PT.
- Một PT có thể phụ trách nhiều members.
- Hệ thống ghi nhận:
  - Ngày bắt đầu phụ trách.
  - Ngày kết thúc phụ trách.
  - Gói tập liên quan.
  - Mức hoa hồng PT nhận từ gói này.

### 3.7 Quản lý bán hàng dịch vụ trong phòng Gym

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
- In hoặc xuất hóa đơn.

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

### 3.8 Quản lý nhập kho, xuất kho

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

### 3.9 Quản lý chi phí vận hành

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
- Chứng từ đính kèm.

### 3.10 Báo cáo và thống kê

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

---

## 4. Quy tắc nghiệp vụ chi tiết

### 4.1 Quy tắc vé tập

- Mỗi member có thể sở hữu nhiều gói vé theo thời gian.
- Tại một thời điểm, chỉ có một vé chính đang hoạt động nếu hệ thống chọn mô hình độc quyền.
- Vé có thể được gia hạn hoặc nâng cấp.
- Giá vé và ưu đãi được Admin cấu hình.
- Vé cao cấp có thể gắn PT phụ trách.

### 4.2 Quy tắc hợp đồng PT

- Mỗi PT có thể có nhiều hợp đồng theo thời gian, nhưng chỉ một hợp đồng hiệu lực tại một thời điểm.
- Thông số lương, thưởng, hoa hồng lấy từ hợp đồng đang hiệu lực.
- Admin có thể sửa hợp đồng và lưu lịch sử thay đổi.

### 4.3 Quy tắc chấm công

- Mỗi ngày PT có thể có một hoặc nhiều ca nếu hệ thống cho phép.
- Một ca hợp lệ cần có `check_in_at` và `check_out_at`.
- `Thời gian làm việc = check_out_at - check_in_at`.
- Nếu thời gian làm việc dưới `5 giờ`:
  - Không tính công, hoặc
  - Tính công nửa ca, tùy chính sách Admin.
- Nếu thời gian làm việc vượt `giờ chuẩn/ngày` trong hợp đồng thì phần vượt là `overtime_hours`.

### 4.4 Quy tắc tính lương PT

Công thức đề xuất:

```text
Luong_thuc_nhan =
  Luong_co_ban_theo_hop_dong
  + Thuong_cham_cong
  + Thuong_tang_ca
  + Hoa_hong_goi_tap
  + Hoa_hong_ban_hang
  + Phu_cap
  - Khau_tru
```

Trong đó:

- `Lương cơ bản` có thể là lương tháng cố định hoặc lương theo công.
- `Thưởng chấm công` dựa trên số ca hợp lệ hoặc số ngày công đạt chuẩn.
- `Thưởng tăng ca = overtime_hours x overtime_rate`.
- `Hoa hồng gói tập` tính theo phần trăm hoặc số tiền cố định cho các member/gói PT phụ trách.
- `Hoa hồng bán hàng` áp dụng nếu PT có bán gói tập hoặc dịch vụ.
- `Khấu trừ` áp dụng theo hợp đồng hoặc vi phạm nội quy.

### 4.5 Quy tắc sản phẩm và hóa đơn

- Mỗi hóa đơn có nhiều dòng sản phẩm.
- Khi hóa đơn được xác nhận, hệ thống tự động trừ tồn kho.
- Hủy hóa đơn cần sinh bút toán kho ngược nếu hàng chưa sử dụng.

### 4.6 Quy tắc chi phí sửa chữa và thay mới thiết bị

- Thiết bị có thể có nhiều lần bảo trì / sửa chữa.
- Nếu thiết bị không thể sửa chữa, tạo phiếu thay thế thiết bị.
- Chi phí thay mới được đưa vào báo cáo chi phí vận hành.

---

## 5. Thiết kế cơ sở dữ liệu PostgreSQL

## 5.1 Nhóm bảng người dùng và phân quyền

### `users`

- `id`
- `email`
- `password_hash`
- `role` (`ADMIN`, `PT`, `STAFF`)
- `status`
- `created_at`
- `updated_at`

### `user_profiles`

- `id`
- `user_id`
- `full_name`
- `phone`
- `address`
- `avatar_url`
- `date_of_birth`

## 5.2 Nhóm bảng PT

### `personal_trainers`

- `id`
- `user_id`
- `code`
- `specialty`
- `experience_years`
- `hire_date`
- `employment_status`
- `notes`

### `pt_contracts`

- `id`
- `pt_id`
- `contract_code`
- `salary_type`
- `base_salary`
- `required_work_days`
- `min_valid_shift_hours`
- `standard_shift_hours`
- `overtime_rate_per_hour`
- `attendance_bonus`
- `sales_commission_percent`
- `package_commission_percent`
- `allowance_amount`
- `deduction_rules`
- `effective_from`
- `effective_to`
- `is_active`

### `pt_attendance_logs`

- `id`
- `pt_id`
- `attendance_date`
- `check_in_at`
- `check_out_at`
- `worked_hours`
- `valid_hours`
- `overtime_hours`
- `status`
- `note`

### `pt_payroll_periods`

- `id`
- `code`
- `month`
- `year`
- `start_date`
- `end_date`
- `status`

### `pt_payrolls`

- `id`
- `payroll_period_id`
- `pt_id`
- `contract_id`
- `base_salary_amount`
- `attendance_bonus_amount`
- `overtime_amount`
- `package_commission_amount`
- `sales_commission_amount`
- `allowance_amount`
- `deduction_amount`
- `total_amount`
- `generated_at`
- `approved_by`

## 5.3 Nhóm bảng members và vé tập

### `members`

- `id`
- `code`
- `full_name`
- `phone`
- `email`
- `gender`
- `date_of_birth`
- `address`
- `height_cm`
- `weight_kg`
- `fitness_goal`
- `health_note`
- `joined_at`
- `status`

### `membership_plans`

- `id`
- `code`
- `name`
- `plan_type` (`DAY`, `MONTH`, `YEAR`)
- `price`
- `duration_days`
- `visit_limit`
- `is_unlimited`
- `includes_pt`
- `pt_session_limit`
- `benefits`
- `status`

### `member_memberships`

- `id`
- `member_id`
- `plan_id`
- `assigned_pt_id`
- `start_date`
- `end_date`
- `remaining_visits`
- `price_at_purchase`
- `status`

### `member_pt_assignments`

- `id`
- `member_id`
- `pt_id`
- `membership_id`
- `commission_type`
- `commission_value`
- `started_at`
- `ended_at`
- `status`

## 5.4 Nhóm bảng bán hàng dịch vụ

### `products`

- `id`
- `sku`
- `name`
- `category`
- `unit`
- `cost_price`
- `sell_price`
- `quantity_in_stock`
- `minimum_stock_level`
- `status`

### `sales_invoices`

- `id`
- `invoice_no`
- `member_id`
- `seller_user_id`
- `invoice_date`
- `subtotal_amount`
- `discount_amount`
- `total_amount`
- `payment_method`
- `status`
- `note`

### `sales_invoice_items`

- `id`
- `invoice_id`
- `product_id`
- `quantity`
- `unit_price`
- `line_total`

## 5.5 Nhóm bảng kho

### `inventory_transactions`

- `id`
- `product_id`
- `transaction_type`
- `reference_type`
- `reference_id`
- `quantity`
- `unit_cost`
- `transaction_date`
- `created_by`
- `note`

### `purchase_receipts`

- `id`
- `receipt_no`
- `supplier_name`
- `receipt_date`
- `total_amount`
- `status`
- `note`

### `purchase_receipt_items`

- `id`
- `receipt_id`
- `product_id`
- `quantity`
- `unit_cost`
- `line_total`

## 5.6 Nhóm bảng chi phí vận hành và thiết bị

### `equipment_assets`

- `id`
- `asset_code`
- `name`
- `category`
- `purchase_date`
- `purchase_cost`
- `status`
- `condition_status`
- `location`
- `note`

### `operating_expenses`

- `id`
- `expense_no`
- `expense_date`
- `category`
- `amount`
- `equipment_id`
- `vendor_name`
- `description`
- `attachment_url`
- `approved_by`

### `maintenance_logs`

- `id`
- `equipment_id`
- `maintenance_type`
- `performed_at`
- `vendor_name`
- `cost_amount`
- `result_status`
- `note`

---

## 6. Kiến trúc module NestJS đề xuất

```text
apps/nestjs-backend/src/modules
├─ auth
├─ users
├─ dashboard
├─ personal-trainers
├─ pt-contracts
├─ attendance
├─ payroll
├─ members
├─ membership-plans
├─ member-assignments
├─ products
├─ inventory
├─ sales
├─ expenses
├─ equipment
├─ maintenance
└─ reports
```

### API chính đề xuất

#### Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/revenue-chart`
- `GET /dashboard/expense-chart`

#### PT

- `GET /pts`
- `POST /pts`
- `GET /pts/:id`
- `PATCH /pts/:id`
- `GET /pts/:id/contracts`
- `POST /pts/:id/contracts`

#### Attendance

- `POST /attendance/check-in`
- `POST /attendance/check-out`
- `GET /attendance`
- `GET /attendance/pt/:ptId`

#### Payroll

- `POST /payroll/generate`
- `GET /payroll/periods`
- `GET /payroll/pt/:ptId`

#### Members

- `GET /members`
- `POST /members`
- `GET /members/:id`
- `PATCH /members/:id`

#### Membership Plans

- `GET /membership-plans`
- `POST /membership-plans`
- `PATCH /membership-plans/:id`

#### Member Memberships

- `POST /member-memberships`
- `GET /member-memberships`
- `GET /member-memberships/:id`
- `POST /member-memberships/:id/renew`

#### Products and Inventory

- `GET /products`
- `POST /products`
- `POST /inventory/import`
- `POST /inventory/adjust`
- `GET /inventory/transactions`

#### Sales

- `GET /sales/invoices`
- `POST /sales/invoices`
- `GET /sales/invoices/:id`

#### Expenses and Maintenance

- `GET /expenses`
- `POST /expenses`
- `GET /equipment`
- `POST /equipment`
- `POST /maintenance`

#### Reports

- `GET /reports/revenue`
- `GET /reports/payroll`
- `GET /reports/inventory`
- `GET /reports/expenses`
- `GET /reports/profit`

---

## 7. Cấu trúc màn hình NextJS đề xuất

```text
apps/nextjs-frontend/src/app
├─ dashboard
├─ pts
│  ├─ page.tsx
│  ├─ [id]/page.tsx
│  ├─ contracts/page.tsx
│  └─ attendance/page.tsx
├─ payroll
├─ members
│  ├─ page.tsx
│  ├─ [id]/page.tsx
│  └─ memberships/page.tsx
├─ membership-plans
├─ products
├─ inventory
├─ invoices
├─ expenses
├─ equipment
├─ maintenance
├─ reports
└─ settings
```

### Màn hình cần có

- Dashboard tổng quan.
- Danh sách PT.
- Chi tiết PT.
- Hợp đồng PT.
- Chấm công PT.
- Bảng lương PT.
- Danh sách members.
- Chi tiết member.
- Danh sách gói vé.
- Mua / gia hạn vé cho member.
- Danh sách sản phẩm dịch vụ.
- Nhập kho.
- Xuất kho.
- Hóa đơn bán hàng.
- Phiếu chi vận hành.
- Quản lý thiết bị.
- Báo cáo thống kê.
- Trang cấu hình chính sách lương, thưởng, hoa hồng.

---

## 8. Luồng nghiệp vụ chính

### 8.1 Đăng ký member và bán vé

1. Nhân viên tạo hồ sơ member.
2. Chọn gói vé: ngày, tháng hoặc năm.
3. Nếu gói có PT, chọn PT phụ trách.
4. Hệ thống tạo bản ghi membership.
5. Hệ thống ghi nhận doanh thu vé.

### 8.2 PT chấm công

1. PT Check In.
2. Hệ thống tạo ca làm đang mở.
3. PT Check Out cuối ca.
4. Hệ thống tính số giờ làm.
5. Nếu số giờ đạt từ 5 giờ trở lên, ca được tính hợp lệ.
6. Phần giờ vượt chuẩn được tính tăng ca.

### 8.3 Bán sản phẩm dịch vụ

1. Nhân viên tạo hóa đơn.
2. Chọn member hoặc khách lẻ.
3. Thêm sản phẩm và số lượng.
4. Xác nhận thanh toán.
5. Hệ thống trừ tồn kho và ghi doanh thu dịch vụ.

### 8.4 Ghi nhận chi phí sửa chữa / thay mới

1. Tạo phiếu chi.
2. Chọn loại chi phí: dọn dẹp, bảo trì, sửa chữa, thay mới.
3. Nếu liên quan thiết bị, gắn thiết bị tương ứng.
4. Ghi số tiền, mô tả, chứng từ.
5. Hệ thống đưa dữ liệu vào báo cáo chi phí.

### 8.5 Tính lương PT cuối kỳ

1. Chọn kỳ lương.
2. Hệ thống lấy hợp đồng PT còn hiệu lực.
3. Tổng hợp ca làm hợp lệ, giờ tăng ca, hoa hồng.
4. Tính lương từng PT.
5. Admin duyệt bảng lương.

---

## 9. Báo cáo đề xuất

### 9.1 Báo cáo doanh thu

- Doanh thu theo ngày / tuần / tháng / năm.
- Doanh thu theo nguồn:
  - Vé tập.
  - Bán sản phẩm dịch vụ.
- So sánh doanh thu giữa các tháng.

### 9.2 Báo cáo PT

- Tổng số PT.
- Lương từng PT.
- Số ngày công hợp lệ.
- Số giờ tăng ca.
- Hoa hồng từng PT.
- Danh sách members PT đang phụ trách.

### 9.3 Báo cáo members

- Tổng số members.
- Members đang hoạt động.
- Members theo loại vé.
- Members sắp hết hạn vé.
- Members có PT phụ trách.

### 9.4 Báo cáo kho và dịch vụ

- Tồn kho hiện tại.
- Hàng bán chạy.
- Hàng sắp hết.
- Lịch sử nhập xuất kho.

### 9.5 Báo cáo chi phí

- Chi phí dọn dẹp.
- Chi phí bảo trì.
- Chi phí sửa chữa.
- Chi phí thay mới thiết bị.
- Tổng chi phí theo tháng.

### 9.6 Báo cáo lợi nhuận

```text
Loi_nhuan = Tong_doanh_thu - Tong_luong_PT - Tong_chi_phi_van_hanh
```

---

## 10. Quy tắc phân quyền đề xuất

### Admin

- Toàn quyền CRUD.
- Duyệt bảng lương.
- Quản lý hợp đồng PT.
- Quản lý chính sách giá vé, thưởng, hoa hồng.

### PT

- Xem thông tin cá nhân.
- Check In / Check Out.
- Xem members được phân công.
- Xem lương của chính mình.

### Staff

- Quản lý members.
- Bán vé.
- Tạo hóa đơn dịch vụ.
- Quản lý nhập xuất kho theo phân quyền.
- Không được sửa hợp đồng PT và cấu hình lương.

---

## 11. Gợi ý triển khai kỹ thuật

### Frontend NextJS

- Dùng App Router.
- Dùng `React Query` để gọi API.
- Dùng `React Hook Form` + `Zod` để validate form.
- Dùng `PrimeReact` hoặc UI hiện có trong boilerplate để làm dashboard, table, dialog, report filters.

### Backend NestJS

- Tách module theo nghiệp vụ.
- Dùng `MikroORM` với PostgreSQL.
- Dùng DTO trong `packages/shared` để chia sẻ type giữa frontend và backend.
- Dùng guard theo role cho `ADMIN`, `PT`, `STAFF`.

### PostgreSQL

- Tạo index cho:
  - `attendance_date`
  - `invoice_date`
  - `expense_date`
  - `member_id`
  - `pt_id`
- Dùng foreign key để đảm bảo toàn vẹn dữ liệu.

---

## 12. Kết quả mong muốn của hệ thống

Sau khi triển khai, ứng dụng cần hỗ trợ:

- Quản lý đầy đủ PT, members, vé tập.
- Theo dõi chính xác chấm công PT.
- Tính lương PT theo hợp đồng, tăng ca và hoa hồng.
- Theo dõi doanh thu từ vé và sản phẩm dịch vụ.
- Quản lý nhập xuất tồn kho.
- Quản lý chi phí vận hành, bảo trì và thay thế thiết bị.
- Cung cấp báo cáo phục vụ quản trị phòng Gym.

---

## 13. Tóm tắt ngắn gọn mô hình hệ thống

Ứng dụng quản lý phòng Gym gồm 6 phân hệ cốt lõi:

1. `PT Management`: hồ sơ PT, hợp đồng, chấm công, bảng lương.
2. `Member Management`: hồ sơ member, vé tập, PT phụ trách.
3. `Sales Management`: bán vé, bán sản phẩm dịch vụ, hóa đơn.
4. `Inventory Management`: nhập kho, xuất kho, tồn kho.
5. `Expense & Equipment Management`: chi phí, bảo trì, sửa chữa, thay mới thiết bị.
6. `Reports & Analytics`: doanh thu, chi phí, lương PT, lợi nhuận, thống kê vận hành.

Tài liệu này có thể dùng làm nền tảng để tiếp tục:

- Thiết kế ERD.
- Viết migration PostgreSQL.
- Tạo module NestJS.
- Tạo giao diện NextJS.
- Viết API và báo cáo thống kê.
