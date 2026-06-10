# 08 — Module Vui chơi & Giải trí (VG) · Prototype

> Mã module: **VG** · 4 FR · Nest module `entertainment` · Ước lượng **6.5 MD dev / 3 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Vận hành **khu vui chơi & thể thao**: kiểm soát vé & lượt khách theo khu (chống vượt sức chứa), **checklist an toàn thiết bị trò chơi hàng ngày**, ghi nhận & xử lý sự cố an toàn. Liên kết vé với đơn booking (BK-CAT-04/05) và phiếu bảo trì (VT-MNT). An toàn là ưu tiên số 1 — sự cố nghiêm trọng (tai nạn) đóng khu trong 5 phút.

---

## 2. Danh sách FR (4)

| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| VG-OPS-01 | Quản lý vé & kiểm soát lượt khách (QR, sức chứa) | P1 | 2/1 |
| VG-OPS-02 | Checklist an toàn thiết bị hàng ngày (ký ĐT) | P1 | 1.5/0.5 |
| VG-OPS-03 | Ghi nhận & xử lý sự cố an toàn | P1 | 1.5/1 |
| VG-RPT-01 | Báo cáo lượt khách & doanh thu khu vui chơi | P2 | 1.5/0.5 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | scope |
|-------------------|----------|:--:|:--:|:--:|------|
| `vg-tro-choi` Vận hành trò chơi | VG-OPS-01/02 | ✓ | ✓ | ✓ | team |
| `vg-an-toan` An toàn khu vui chơi | VG-OPS-02/03 | ✓ | ✓ | ✓ | team |
| `sw-cuu-ho`/cứu hộ | VG-OPS-03 (sự cố) | ✓ | ✓ | — | team |
| QL khu vui chơi (Supervisor) | toàn VG | ✓ | ✓ | ✓ | team |
| Phó TGĐ Vận hành | toàn VG + RPT | ✓ | ✓ | ✓ | block |

**Chặn cứng**: khu **không mở** khi checklist an toàn chưa hoàn thành (VG-OPS-02); thiết bị không đạt → tạm dừng + tạo phiếu bảo trì VT-MNT ngay.

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.VG)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `venue_tickets` | id, booking_item_id, qr_code, area, scanned_at, scan_count | liên kết đơn BK; vé dùng trong ngày |
| `safety_checklists` | id, area, device_id, inspector_id, status, issues_json, checked_at | mở ca; ký điện tử |
| `incident_reports` | id, area, type, severity, description, image_urls, handled_by, closed_at | ảnh hiện trường + PDF |

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| POST `/vg/tickets/scan` (đếm lượt, cảnh báo sức chứa) | VG-OPS-01 | NV cổng |
| POST `/vg/checklists` (mở ca) | VG-OPS-02 | NV vận hành/an toàn |
| POST `/vg/incidents` | VG-OPS-03 | an toàn/cứu hộ |
| GET `/vg/reports` | VG-RPT-01 | QL/Phó TGĐ VH |

---

## 6. Màn hình UI

Quét vé tại cổng + bộ đếm lượt khách real-time theo khu (cảnh báo vượt sức chứa) · Checklist mở ca từng thiết bị (cơ học/điện/vệ sinh/biển báo, ký điện tử) · Form sự cố (phân loại mức độ, ảnh, theo dõi xử lý) · Báo cáo lượt khách/doanh thu/giờ cao điểm.

---

## 7. Luồng nghiệp vụ chính

**Mở ca**: NV điền checklist từng thiết bị → đạt → khu mở; không đạt → tạm dừng thiết bị + phiếu bảo trì VT-MNT. **Vào khu**: khách quét QR vé (liên kết đơn BK) → đếm lượt → cảnh báo khi gần/vượt sức chứa. **Sự cố**: tạo báo cáo → mức nghiêm trọng (tai nạn người) → đóng khu + báo quản lý 5' + lưu ảnh + biên bản PDF.

---

## 8. NFR áp dụng

PERF-02 · SCALE-03 · SEC-04 (audit checklist/sự cố) · DATA-01/04 · MNT-01 (cảnh báo sức chứa/an toàn).

## 9. Tích hợp ngoài

Quét QR/barcode tại cổng; vé bán qua web booking (BK-CAT-04/05); thiết bị liên kết bảo trì VT.

## 10. Phụ thuộc module khác

- **← BK**: vé từ đơn booking (VG-OPS-01 ← BK-CAT-04/05).
- **→ VT**: thiết bị không đạt → phiếu bảo trì (VG-OPS-02 → VT-MNT).
- **↔ OP/An ninh**: an toàn & cứu hộ (VG-OPS-03 ↔ OP-SEC, `sw-cuu-ho`).
- **↔ NT**: sự kiện/lễ hội phối hợp (`vg-ke-hoach` → NT-SCH).
- **→ FM**: doanh thu vé (FM-REV-05/OP-RPT-04).

## 11. Ước lượng & Definition of Done

**Tổng: 6.5 MD dev / 3 MD test.** Toàn bộ VG-OPS là P1.
**DoD (P1)**: quét vé + đếm lượt + cảnh báo sức chứa; checklist chặn mở khu khi chưa hoàn thành + sinh phiếu bảo trì; báo cáo sự cố với ảnh + escalate; lượt khách & doanh thu khớp vé BK.
