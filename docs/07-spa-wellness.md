# 07 — Module Spa & Wellness (SP) · Prototype

> Mã module: **SP** · 6 FR · Nest module `spa` · Ước lượng **10 MD dev / 4 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Đặt lịch & vận hành **Spa – Massage – Trị liệu – Gym – Yoga** cho KDL: đặt lịch (online + tại quầy), quản lý phòng trị liệu & kỹ thuật viên (KTV), danh mục dịch vụ & giá, combo/thẻ trả trước, báo cáo. Dịch vụ Spa cũng bán qua web booking (BK) và là nguồn doanh thu bổ sung cho OP/FM.

**Đặc thù**: sử dụng thảo dược địa phương Hà Tĩnh (lá ngải, gừng, quế chi); lưu sở thích KTV của khách VIP để ưu tiên.

---

## 2. Danh sách FR (6)

| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| SP-BOOK-01 | Đặt lịch Spa (online & tại quầy) | P1 | 2/1 |
| SP-BOOK-02 | Quản lý lịch & tình trạng phòng trị liệu | P1 | 1.5/0.5 |
| SP-BOOK-03 | Check-in Spa & phân công KTV | P1 | 1.5/0.5 |
| SP-SERV-01 | Danh mục dịch vụ & giá Spa | P1 | 1.5/0.5 |
| SP-SERV-02 | Liệu trình/combo & thẻ dịch vụ (prepaid) | P2 | 2/1 |
| SP-RPT-01 | Báo cáo doanh thu & hiệu suất Spa | P2 | 1.5/0.5 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | scope |
|-------------------|----------|:--:|:--:|:--:|------|
| `sw-le-tan-spa` Lễ tân Spa | SP-BOOK, SP-RPT | ✓ | ✓ | ✓ | team |
| `sw-massage`/`sw-cham-soc-da`/`sw-xong-hoi` KTV | SP-BOOK (lịch của mình), SP-SERV | ✓ | — | ✓(trạng thái) | own/team |
| Quản lý Spa (Supervisor) | toàn SP | ✓ | ✓ | ✓ | team(block Spa) |
| Khách (BK.users) | đặt lịch Spa | ✓ | ✓ | — | own |
| Phó TGĐ Vận hành | toàn SP | ✓ | ✓ | ✓ | block |

Không phân công KTV đang bận ca khác (SP-BOOK-03); KTV được hỏi ưu tiên trước khi phân công (SP-BOOK-01).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.SP)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `spa_services` | id, name, category, duration_min, price `DECIMAL`, price_weekend, active, images | giá thường/cuối tuần/lễ |
| `spa_bookings` | id, guest_id, service_id, therapist_id, room_id, slot_start, slot_end, status, created_at | 1 khách/slot/phòng |
| `therapist_schedules` | id, therapist_id, date, shift, available, assigned_booking_id | tránh trùng ca |

Bổ sung: `spa_packages`/`prepaid_cards` cho combo & thẻ trả trước (SP-SERV-02: không hoàn tiền mặt, hết hạn 12 tháng, chuyển nhượng ≤1 lần).

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| POST `/spa/bookings` | SP-BOOK-01 | khách/lễ tân Spa |
| GET `/spa/rooms/status` | SP-BOOK-02 | lễ tân/KTV |
| POST `/spa/bookings/:id/checkin` (assign KTV) | SP-BOOK-03 | lễ tân Spa |
| CRUD `/spa/services` | SP-SERV-01 | QL Spa |
| POST `/spa/cards` (prepaid) | SP-SERV-02 | QL Spa |
| GET `/spa/reports` | SP-RPT-01 | QL Spa |

---

## 6. Màn hình UI

Lịch đặt Spa (timeline phòng × khung giờ) · Sơ đồ phòng trị liệu real-time (Trống/Đang phục vụ/Dọn/Bảo trì) · Check-in + phân công KTV · Danh mục dịch vụ & giá + ảnh · Combo & thẻ trả trước (số dư, số buổi) · Báo cáo doanh thu theo dịch vụ/KTV (tự gửi 23:00).

---

## 7. Luồng nghiệp vụ chính

Khách đặt (web/lễ tân, trước ≥30') → xác nhận slot (1 khách/phòng) → check-in, phân công KTV rảnh (ưu tiên KTV quen của VIP) → ghi giờ bắt đầu/kết thúc → thanh toán (tiền/charge-to-room/trừ thẻ) → cập nhật phòng → báo cáo cuối ngày.

---

## 8. NFR áp dụng

PERF-02 · UX-01 (mobile booking) · SEC-03/04 · DATA-02 (giá/thẻ tiền) · SCALE-03 · INT-01 (thanh toán online qua BK).

## 9. Tích hợp ngoài

Bán dịch vụ qua web booking (BK-CAT); thanh toán online (INT-01); thảo dược lấy từ kho VT (`sw-xong-hoi` → VT-EXP).

## 10. Phụ thuộc module khác

- **↔ BK**: đặt Spa online (SP-BOOK ↔ BK-CAT/ORD); thể thao dưới nước liên kết VG.
- **→ OP/FM**: charge-to-room (OP-CHK), doanh thu (FM-REV).
- **→ VT**: xông hơi/thảo dược tiêu hao (VT-EXP); bảo trì thiết bị gym (`sw-van-hanh-gym` → VT-MNT/OP-TECH).
- **← HR**: lịch ca KTV (HR-ATT).

## 11. Ước lượng & Definition of Done

**Tổng: 10 MD dev / 4 MD test.** Trọng tâm P1: SP-BOOK-01/02/03, SP-SERV-01.
**DoD (P1)**: khách đặt Spa online/quầy → phân công KTV không trùng ca → check-in/out → doanh thu sang FM; danh mục dịch vụ hiển thị trên web booking; báo cáo doanh thu theo KTV.
