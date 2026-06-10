# 06 — Module Vận hành (OP) · Prototype

> Mã module: **OP** · 36 FR (lớn nhất) · Nest module `operation` · Ước lượng **55 MD dev / 23.5 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Trái tim vận hành **24/7** của KDL: **buồng phòng, F&B/nhà hàng (POS), check-in/out, yêu cầu & phàn nàn khách, kỹ thuật, an ninh, báo cáo vận hành**. Đây là PMS (Property Management System) lõi — đồng bộ chặt với BK (đặt phòng) và VT (vật tư/bảo trì), nuôi số liệu KPI cho HR và doanh thu cho FM.

**Đặc thù**: ràng buộc theo **ca**; POS cần **offline ≥4h** (NFR-AVAIL-03); nhiều SLA thời gian (phản hồi 10', xử lý 30', sự cố khẩn 15').

---

## 2. Danh sách FR (36)

**1. Buồng phòng** (OP-ROOM) *dev 9.5/test 4*
| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| OP-ROOM-01 | Trạng thái phòng real-time | P1 | 2/1 |
| OP-ROOM-02 | Phân công dọn phòng theo ca | P1 | 2/1 |
| OP-ROOM-03 | Kiểm tra phòng sau dọn (inspection) | P1 | 1.5/0.5 |
| OP-ROOM-04 | Minibar & amenities | P2 | 1.5/0.5 |
| OP-ROOM-05 | Yêu cầu dịch vụ phòng | P2 | 1.5/0.5 |
| OP-ROOM-06 | Báo cáo buồng phòng theo ca | P2 | 1/0.5 |

**2. F&B & Nhà hàng** (OP-FNB) *12/5*
| OP-FNB-01 | Quản lý bàn & khu vực | P1 | 2/1 |
| OP-FNB-02 | Ghi order tại bàn (POS, in bếp) | P1 | 2/1 |
| OP-FNB-03 | Yêu cầu đặc biệt & dị ứng | P1 | 1/0.5 |
| OP-FNB-04 | Thực đơn & giá (CMS F&B) | P2 | 2/0.5 |
| OP-FNB-05 | Thanh toán nhà hàng (charge to room) | P1 | 1.5/0.5 |
| OP-FNB-06 | Kiểm soát nguyên liệu (food cost) | P2 | 2/1 |
| OP-FNB-07 | Báo cáo F&B ngày/tháng | P1 | 1.5/0.5 |

**3. Check-in/out** (OP-CHK) *9/4*
| OP-CHK-01 | Check-in khách (QR/CCCD) | P1 | 2/1 |
| OP-CHK-02 | Check-out & thanh toán cuối | P1 | 2/1 |
| OP-CHK-03 | Early check-in/Late check-out | P2 | 1/0.5 |
| OP-CHK-04 | Walk-in booking (cọc 100%) | P1 | 1.5/0.5 |
| OP-CHK-05 | Quản lý thẻ từ & chìa khóa | P2 | 1/0.5 |
| OP-CHK-06 | Lịch sử lưu trú & CRM (VIP) | P2 | 1.5/0.5 |

**4. Yêu cầu & Phàn nàn** (OP-SVC) *6/2.5* · **5. Kỹ thuật** (OP-TECH) *6.5/3*
| OP-SVC-01 | Tiếp nhận & phân công yêu cầu | P1 | 1.5/0.5 |
| OP-SVC-02 | Xử lý khiếu nại (cấp 1-3) | P1 | 2/1 |
| OP-SVC-03 | Báo cáo chất lượng & NPS | P2 | 1.5/0.5 |
| OP-SVC-04 | Concierge & thông tin địa phương | P3 | 1/0.5 |
| OP-TECH-01 | Tiếp nhận sự cố kỹ thuật (khẩn 15') | P1 | 1.5/0.5 |
| OP-TECH-02 | Điều phối & theo dõi KTV (ảnh) | P1 | 1.5/1 |
| OP-TECH-03 | Lịch bảo dưỡng hệ thống định kỳ | P2 | 1.5/0.5 |
| OP-TECH-04 | Checklist kỹ thuật hàng ngày | P2 | 1/0.5 |
| OP-TECH-05 | Báo cáo kỹ thuật tháng | P2 | 1/0.5 |

**6. An ninh & An toàn** (OP-SEC) *5.5/2* · **7. Báo cáo Vận hành** (OP-RPT) *6.5/3*
| OP-SEC-01 | Nhật ký trực ca an ninh (giao ca) | P1 | 1.5/0.5 |
| OP-SEC-02 | Kiểm soát khách & phương tiện ra vào | P1 | 1.5/0.5 |
| OP-SEC-03 | Báo cáo & xử lý sự cố an ninh | P1 | 1.5/0.5 |
| OP-SEC-04 | Kiểm tra PCCC & HSE định kỳ | P2 | 1/0.5 |
| OP-RPT-01 | Báo cáo vận hành ngày (07:00) | P1 | 2/1 |
| OP-RPT-02 | Dashboard vận hành real-time | P1 | 2/1 |
| OP-RPT-03 | Báo cáo công suất phòng (RevPAR/ADR) | P1 | 1.5/0.5 |
| OP-RPT-04 | Báo cáo dịch vụ bổ sung theo tháng | P2 | 1/0.5 |

---

## 3. Vai trò & phân quyền (ràng buộc theo ca)

| Vai trò (org-key) | Resource | view | create | edit | scope + ràng buộc |
|-------------------|----------|:--:|:--:|:--:|------|
| `lt-reception` Lễ tân | OP-CHK, OP-SVC, OP-ROOM | ✓ | ✓ | ✓ | team + **shift** |
| `lt-don-phong` Dọn phòng | OP-ROOM-01/02 | ✓ | — | ✓(trạng thái) | team |
| `lt-kiem-phong` Kiểm phòng | OP-ROOM-03/04 | ✓ | ✓ | ✓ | team |
| `fb-phuc-vu-ban`/`fb-thu-ngan` | OP-FNB | ✓ | ✓ | ✓ | team + **shift** |
| `lt-dien`/`lt-co-khi` Kỹ thuật | OP-TECH | ✓ | ✓ | ✓ | team |
| `an-truc-ngay`/`an-truc-dem` Bảo vệ | OP-SEC | ✓ | ✓ | ✓ | team + **shift** |
| Trưởng ca / Trưởng bộ phận | toàn nhóm mình | ✓ | ✓ | ✓ | team |
| Phó TGĐ Vận hành | toàn OP | ✓ | ✓ | ✓ | block |

**Ràng buộc ca (ABAC)**: nhân viên chỉ thao tác dữ liệu trong **ca trực của mình** (`data_scope_rules` với `shift = $user.shift`). Giao ca an ninh có biên bản ký nhận (OP-SEC-01). Khiếu nại cấp 2-3 escalate Quản lý/TGĐ (OP-SVC-02).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.OP)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `room_status` | id, room_no, floor, type, status, updated_by, updated_at | Trống sạch/Có khách/Cần dọn/Bảo trì/Đặt trước |
| `fnb_orders` | id, table_id, waiter_id, items_json, special_req, status, total `DECIMAL`, created_at, closed_at | POS; charge to room |
| `check_ins` | id, booking_id, guest_name, cccd_image, card_issued, room_id, actual_in, actual_out, extra_charges | walk-in tạo tại chỗ |
| `service_requests` | id, guest_id, room_id, type, description, status, assigned_to, completed_at | SLA 10'/30' |
| `tech_tickets` | id, location, description, urgency, assigned_to, status, cost, opened_at, closed_at | khẩn 15' |
| `security_incidents` | id, type, location, severity, description, handled_by, status, reported_at | cấp nghiêm trọng báo TGĐ 15' |

`items_json` lưu order F&B; cân nhắc tách `order_items` khi cần food-cost chi tiết (OP-FNB-06 ↔ VT recipe).

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| GET/PATCH `/rooms/:no/status` | OP-ROOM-01 | lễ tân/buồng phòng |
| POST `/housekeeping/assign` · `/inspections` | OP-ROOM-02/03 | tổ trưởng buồng phòng |
| POST `/fnb/orders` (in bếp) · `/fnb/orders/:id/pay` | OP-FNB-02/05 | phục vụ/thu ngân |
| POST `/checkins` (QR/walk-in) · `/checkouts` | OP-CHK-01/02/04 | lễ tân |
| POST `/service-requests` · `/complaints` | OP-SVC-01/02 | lễ tân/GRO |
| POST `/tech-tickets` · PATCH `/tech-tickets/:id` | OP-TECH-01/02 | mọi NV / kỹ thuật |
| POST `/security/logbook` · `/security/incidents` | OP-SEC-01/03 | bảo vệ |
| GET `/reports/daily` · `/dashboard/ops` | OP-RPT-01/02 | trưởng ca/BLĐ |

---

## 6. Màn hình UI

**Sơ đồ phòng** real-time (màu trạng thái) + phân công dọn + inspection (ảnh) · **POS F&B** (sơ đồ bàn, ghi order, in bếp, cảnh báo dị ứng đỏ, split bill, charge to room) · Màn check-in/out (quét QR/CCCD, giao thẻ từ, hóa đơn tổng) · Walk-in · Tiếp nhận yêu cầu/khiếu nại + phân công + SLA timer · Phiếu sự cố kỹ thuật (ảnh trước/sau) · Nhật ký trực ca an ninh + giao ca · **Dashboard vận hành** (xanh/vàng/đỏ theo KPI) · Báo cáo ngày/công suất (RevPAR, ADR).

---

## 7. Luồng nghiệp vụ chính

**Vòng đời lưu trú**: đơn BK xác nhận → check-in quét QR + xác minh CCCD + giao thẻ từ (CHK-01) → phòng "Có khách" (ROOM-01) → dịch vụ trong kỳ (room service SVC-01, F&B charge-to-room FNB-05, minibar ROOM-04) → check-out tổng hợp chi phí + xuất hóa đơn (CHK-02) → phòng "Cần dọn" → dọn + inspection (ROOM-02/03) → "Trống sạch".
**Order F&B**: phục vụ ghi order POS → in phiếu bếp (cảnh báo dị ứng) → phục vụ → thanh toán/charge-to-room → trừ nguyên liệu theo recipe (FNB-06 → VT-EXP) → báo cáo food-cost 28-32%.
**Sự cố kỹ thuật**: báo hỏng (TECH-01, khẩn 15') → điều phối KTV (TECH-02, ảnh) → nếu cần phụ tùng → phiếu bảo trì VT-MNT → đóng.
**Báo cáo đêm**: 23:00 F&B → 07:00 daily report tự gửi BLĐ (RPT-01).

---

## 8. NFR áp dụng

PERF-03 (POS ≤1s) · AVAIL-01 (uptime 99.5%) · **AVAIL-03 (POS offline ≥4h, auto-sync)** · SCALE-01 (500 CCU) · UX-02 (i18n) · SEC-04 (audit) · DATA-01/04 · MNT-01 (alert real-time) · PERF-04 (báo cáo đêm).

---

## 9. Tích hợp ngoài

- **Thiết bị**: tablet NV buồng phòng/POS đồng bộ trạng thái; máy in bếp; đầu đọc thẻ từ; quét QR/CCCD.
- **Thanh toán** tại quầy/nhà hàng → FM-REV-02 (INT-01).
- **Camera/CCTV & access control** liên kết an ninh (OP-SEC ↔ IT-INF, `an-cctv`).

---

## 10. Phụ thuộc module khác

- **↔ BK**: trạng thái phòng (OP-ROOM-01 ↔ BK-ADM-04), check-in từ đơn (OP-CHK-01 ← BK-BOOK-02), walk-in tạo booking tại chỗ.
- **→ FM**: thu tiền mặt nhà hàng/check-out (FM-REV-02 ← OP-FNB-05/OP-CHK-02), doanh thu dịch vụ.
- **↔ VT**: nguyên liệu food-cost (OP-FNB-06 → VT-EXP), amenities/minibar (OP-ROOM-04), phiếu bảo trì (OP-TECH-02 → VT-MNT).
- **→ HR**: KPI buồng phòng/lễ tân/F&B (OP-ROOM-03, OP-SVC-01 → HR-KPI-02); ràng buộc ca (HR-ATT).
- **↔ IT/An ninh**: CCTV, access control, sự cố hạ tầng.

---

## 11. Ước lượng & Definition of Done

**Tổng: 55 MD dev / 23.5 MD test.** Trọng tâm P1: ROOM-01/02/03, FNB-01/02/03/05/07, CHK-01/02/04, SVC-01/02, TECH-01/02, SEC-01/02/03, RPT-01/02/03.

**DoD (P1)**: check-in từ đơn BK → trạng thái phòng đồng bộ 2 chiều → POS F&B ghi order + in bếp + charge-to-room → check-out hóa đơn tổng → doanh thu sang FM; POS chạy offline ≥4h và auto-sync; SLA timer yêu cầu/khiếu nại + escalate; sự cố kỹ thuật liên thông VT-MNT; nhật ký an ninh + giao ca; daily report tự gửi 07:00; ràng buộc ca thực thi; đạt PERF-03.
