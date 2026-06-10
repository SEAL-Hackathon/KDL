# 02 — Module Web Booking (BK) · Prototype

> Mã module: **BK** · 35 FR · Nest module `booking` · Ước lượng **54 MD dev / 23.5 MD test**.
> Nền: [00-kien-truc-tong-the.md](00-kien-truc-tong-the.md) · Phân quyền: [01-phan-quyen-rbac.md](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Cổng **đặt dịch vụ online** cho khách (phòng/bungalow, vé tham quan, hoạt động trải nghiệm, đặt bàn nhà hàng) + **admin booking** nội bộ. Đây là module hướng-khách duy nhất (public web), cũng là nguồn doanh thu chính → liên kết trực tiếp OP (vận hành) và FM (doanh thu).

**Ranh giới**: BK lo từ tìm kiếm → đặt → thanh toán → quản lý đơn → review. Check-in vật lý thuộc OP-CHK; ghi nhận doanh thu kế toán thuộc FM-REV.

---

## 2. Danh sách FR (35)

**1. Xác thực & Tài khoản** (BK-AUTH) — *dev 6 / test 3*
| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| BK-AUTH-01 | Đăng ký tài khoản (OTP) | P1 | 2/1 |
| BK-AUTH-02 | Đăng nhập (SDT/Email/Google) | P1 | 2/1 |
| BK-AUTH-03 | Quên/đặt lại mật khẩu | P1 | 1/0.5 |
| BK-AUTH-04 | Quản lý hồ sơ cá nhân | P2 | 1/0.5 |

**2. Tìm kiếm & Danh mục** (BK-CAT) — *dev 9.5 / test 4*
| BK-CAT-01 | Trang chủ & banner | P1 | 1/0.5 |
| BK-CAT-02 | DS & lọc phòng/bungalow | P1 | 2/1 |
| BK-CAT-03 | Chi tiết phòng/lưu trú | P1 | 1.5/0.5 |
| BK-CAT-04 | DS vé tham quan | P1 | 1.5/0.5 |
| BK-CAT-05 | DS hoạt động trải nghiệm | P1 | 2/1 |
| BK-CAT-06 | Đặt bàn/set menu | P2 | 1.5/0.5 |

**3. Quy trình đặt** (BK-ORD) — *dev 7.5 / test 3.5*
| BK-ORD-01 | Kiểm tra khả dụng (lock 10') | P1 | 2/1 |
| BK-ORD-02 | Giỏ dịch vụ (cart) | P1 | 2/1 |
| BK-ORD-03 | Nhập thông tin đặt | P1 | 1/0.5 |
| BK-ORD-04 | Áp mã giảm giá/voucher | P2 | 1.5/0.5 |
| BK-ORD-05 | Xác nhận & tóm tắt đơn | P1 | 1/0.5 |

**4. Thanh toán** (BK-PAY) — *dev 7.5 / test 3*
| BK-PAY-01 | TT online VNPay/MoMo/Banking | P1 | 3/1 |
| BK-PAY-02 | Pay at resort (deposit 30%) | P2 | 1/0.5 |
| BK-PAY-03 | Lịch sử GD & hóa đơn | P1 | 1.5/0.5 |
| BK-PAY-04 | Hoàn tiền/refund | P2 | 2/1 |

**5. Quản lý đơn** (BK-BOOK) — *dev 5.5 / test 2.5*
| BK-BOOK-01 | DS đơn của tôi | P1 | 1/0.5 |
| BK-BOOK-02 | Chi tiết đơn & QR check-in | P1 | 1/0.5 |
| BK-BOOK-03 | Hủy đơn (phí theo mốc) | P1 | 1.5/0.5 |
| BK-BOOK-04 | Chỉnh sửa đặt phòng | P2 | 2/1 |

**6. Đánh giá** (BK-REV) *2.5/1* · **7. Thông báo** (BK-NOTI) *3.5/1.5* · **8. Admin** (BK-ADM) *12/5*
| BK-REV-01 | Gửi đánh giá sau dịch vụ | P2 | 1.5/0.5 |
| BK-REV-02 | Xem đánh giá khách khác | P2 | 1/0.5 |
| BK-NOTI-01 | Email/SMS xác nhận đơn | P1 | 1.5/0.5 |
| BK-NOTI-02 | Nhắc lịch trước check-in | P2 | 1/0.5 |
| BK-NOTI-03 | Push notification web | P3 | 1/0.5 |
| BK-ADM-01 | Dashboard đặt phòng real-time | P1 | 2/1 |
| BK-ADM-02 | DS đơn & tìm kiếm (export) | P1 | 2/0.5 |
| BK-ADM-03 | Xác nhận/hủy đơn thủ công | P1 | 1/0.5 |
| BK-ADM-04 | Quản lý phòng & tình trạng | P1 | 1.5/0.5 |
| BK-ADM-05 | CMS danh mục dịch vụ | P1 | 2/1 |
| BK-ADM-06 | Báo cáo doanh thu & công suất | P2 | 2/1 |
| BK-ADM-07 | Quản lý voucher | P2 | 1.5/0.5 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | approve | export | scope |
|-------------------|----------|:--:|:--:|:--:|:--:|:--:|------|
| Khách (BK.users) | đơn của mình | ✓ | ✓ | ✓(hủy/sửa) | — | — | own |
| `kd-dat-phong` Tổ Đặt phòng | BK-ORD/BOOK/PAY/NOTI | ✓ | ✓ | ✓ | — | ✓ | team |
| `lt-reception` Lễ tân | BK-BOOK-02 (QR), BK-ADM-03 | ✓ | ✓ | ✓ | ✓(Pay-at-resort) | — | team |
| `kd-noi-dung`/`kd-thiet-ke` | BK-CAT, BK-ADM-05 (CMS) | ✓ | ✓ | ✓ | — | — | team |
| `kd-revenue` Revenue | BK-ADM-06, FM-REV | ✓ | — | — | — | ✓ | block |
| Phó TGĐ Kinh doanh | toàn BK | ✓ | ✓ | ✓ | ✓ | ✓ | block |

**Quy tắc**: tài khoản **khách** (`BK.users`) tách hẳn tài khoản **nhân viên** (`core.users`). Khách chỉ thao tác đơn của mình (scope own). Hủy/refund tuân chính sách phí theo mốc (BK-BOOK-03).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.BK)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `users` | id, phone, email, password_hash, full_name, avatar_url, dob, google_id | tài khoản **khách** |
| `services` | id, type, name, description, images, price, capacity, status, meta_json | phòng/vé/activity/menu (type) |
| `bookings` | id, user_id→users, status, total_amount, deposit_amount, voucher_code, special_note | đơn cha |
| `booking_items` | id, booking_id→bookings, service_id→services, check_in, check_out, quantity, price_snapshot, discount_amount | dòng dịch vụ |
| `payments` | id, booking_id, amount `DECIMAL(18,4)`, gateway, tx_ref, status, paid_at, refunded_at | giao dịch |
| `reviews` | id, booking_id, user_id, rating, comment, images, reported | sau check-out |
| `notifications` | id, user_id, type, title, body, channel, sent_at, read_at | email/SMS/push |

Trạng thái `bookings.status`: `Chờ xác nhận → Đã xác nhận → Check-in → Completed → (Đã hủy)`. `price_snapshot` chốt giá tại thời điểm đặt (lịch sử giá đổi không ảnh hưởng đơn cũ).

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| POST `/auth/register` · `/auth/login` | BK-AUTH-01/02 | public |
| GET `/services?type=&from=&to=&pax=` | BK-CAT-02/04/05 | public |
| POST `/availability` (lock 10') | BK-ORD-01 | public |
| POST `/cart` · `/cart/checkout` | BK-ORD-02/05 | khách |
| POST `/payments/vnpay` · `/payments/momo` | BK-PAY-01 | khách |
| GET `/me/bookings` · `/me/bookings/:id` | BK-BOOK-01/02 | khách (own) |
| POST `/me/bookings/:id/cancel` | BK-BOOK-03 | khách (own) |
| POST `/admin/bookings/:id/confirm` | BK-ADM-03 | lễ tân/đặt phòng |
| CRUD `/admin/services` | BK-ADM-05 | CMS nội dung |
| GET `/admin/reports/revenue` | BK-ADM-06 | revenue/Phó TGĐ KD |

---

## 6. Màn hình UI

**Public (Next.js SSR)**: Trang chủ + banner · Danh sách/lọc phòng-vé-activity · Chi tiết dịch vụ (gallery, bản đồ, chính sách hủy) · Giỏ & checkout · Cổng thanh toán · "Đơn của tôi" + QR · Form đánh giá.
**Admin (CSR)**: Dashboard real-time (refresh 60s) · DS đơn + tìm kiếm/export · Quản lý phòng & tình trạng · CMS dịch vụ (upload ảnh, cấu hình giá lễ/weekend) · Quản lý voucher · Báo cáo doanh thu/công suất (chart).

---

## 7. Luồng nghiệp vụ chính

**Đặt & thanh toán**: tìm kiếm → `availability` lock tạm 10' → cart → nhập thông tin → áp voucher → xác nhận → cổng thanh toán (timeout 15') → thành công → tạo `booking` + `payment` → gửi email/SMS + QR (BK-NOTI-01) → (nếu quá hạn → tự hủy lock).
**Hủy/refund**: khách hủy → tính phí theo mốc thời gian → nếu đã trả online → refund tự động về nguồn (BK-PAY-04, log đầy đủ).
**Đồng bộ vận hành**: đơn `Đã xác nhận` → đẩy trạng thái phòng sang OP (OP-ROOM-01); check-in tại quầy quét QR (OP-CHK-01); `Completed` → FM ghi doanh thu (FM-REV-01).

---

## 8. NFR áp dụng

PERF-01 (≤3s @100CCU) · SCALE-01 (500 CCU) · SEC-05 (OWASP Top 10) · UX-01 (mobile-first) · UX-02 (i18n vi/en) · UX-03 (WCAG AA) · INT-01 (VNPay/MoMo) · INT-03 (Zalo/SMTP) · DATA-02 (DECIMAL tiền).

---

## 9. Tích hợp ngoài

- **Thanh toán**: VNPay, MoMo, Internet Banking (NFR-INT-01) — webhook xác nhận, đối soát với FM.
- **Thông báo**: Zalo OA + SMS gateway + SMTP, failover (NFR-INT-03).
- **Hóa đơn**: xuất hóa đơn điện tử qua FM (MISA/VNPT) khi khách yêu cầu (BK-PAY-03 → FM-REV-04).

---

## 10. Phụ thuộc module khác

- **→ OP**: trạng thái phòng (BK-ADM-04 ↔ OP-ROOM-01), QR check-in (BK-BOOK-02 → OP-CHK-01).
- **→ FM**: doanh thu tự động (FM-REV-01), hóa đơn VAT (FM-REV-04), refund (FM).
- **→ HR (gián tiếp)**: KPI lễ tân/đặt phòng lấy số review & số khách (HR-KPI-02).
- **← Marketing/CRM** (`kd-*`): nội dung CMS, voucher, chăm sóc khách (BK-NOTI/REV).

---

## 11. Ước lượng & Definition of Done

**Tổng: 54 MD dev / 23.5 MD test.** Trọng tâm P1: AUTH, CAT 02-05, ORD, PAY-01, BOOK 01-03, NOTI-01, ADM 01-05.

**DoD (P1)**: khách đăng ký→đặt phòng→thanh toán VNPay→nhận QR end-to-end chạy; admin xác nhận/hủy đơn + đồng bộ trạng thái phòng sang OP; doanh thu đẩy sang FM; lock khả dụng & timeout thanh toán hoạt động; audit log mọi thao tác admin; đạt PERF-01 ở môi trường staging.
