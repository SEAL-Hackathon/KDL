# 09 — Module Nghệ thuật Dân gian (NT) · Prototype

> Mã module: **NT** · 4 FR · Nest module `folkart` · Ước lượng **6 MD dev / 2 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).
> **Đặc thù văn hóa Hà Tĩnh — điểm nhấn sản phẩm, KHÔNG phải module phụ.**

---

## 1. Mục tiêu & phạm vi

Quản lý **lịch biểu diễn nghệ thuật dân gian** (trọng tâm **Hát Ví Dặm Nghệ Tĩnh — di sản UNESCO 2014**, múa dân gian, nhạc cụ truyền thống), **phân công nghệ nhân**, **hợp đồng & thù lao CTV nghệ nhân**, và báo cáo hoạt động. Đây là yếu tố khác biệt hóa của KDL Hà Tĩnh: biểu diễn thường xuyên phục vụ du khách, xuất bản lịch lên web booking.

**Đặc thù**: nghệ nhân là **CTV** (dùng chung hồ sơ với HR-CTV); thù lao >2tr/lần khấu trừ TNCN 10%; ưu tiên nghệ nhân có danh hiệu của tỉnh Hà Tĩnh.

---

## 2. Danh sách FR (4)

| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| NT-SCH-01 | Quản lý lịch biểu diễn (xuất bản web) | P1 | 2/0.5 |
| NT-SCH-02 | Phân công nghệ nhân theo buổi (SMS) | P1 | 1.5/0.5 |
| NT-CON-01 | Hợp đồng & thù lao CTV nghệ nhân | P2 | 1.5/0.5 |
| NT-RPT-01 | Báo cáo hoạt động & chi phí nghệ thuật | P3 | 1/0.5 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | scope |
|-------------------|----------|:--:|:--:|:--:|------|
| `vg-ke-hoach`/`vg-le-tan-sk` Điều phối SK | NT-SCH | ✓ | ✓ | ✓ | team |
| `vg-bieu-dien`/`vg-hat-vi-dam` Trưởng đội NT | NT-SCH-02, NT-CON | ✓ | ✓ | ✓ | team |
| `ctv-hat-vi-dam`/`ctv-nhac-cu` Nghệ nhân (CTV) | NT-SCH (lịch của mình), NT-CON (thù lao mình) | ✓(own) | — | — | own + valid_to |
| HR/CTV (`ql-dao-tao`) | NT-CON ↔ HR-CTV | ✓ | ✓ | ✓ | block(HR) |
| Phó TGĐ Vận hành | toàn NT | ✓ | ✓ | ✓ | block |

Nghệ nhân là CTV → tài khoản **scope own + valid_to** (auto-expire theo hợp đồng, xem docs/01 mục 7). Nghệ nhân ký xác nhận điện tử hợp đồng (NT-CON-01) & xác nhận lịch qua SMS (NT-SCH-02).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.NT)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `performance_schedules` | id, title, type, venue, start_at, duration_min, artists_json, published | cố định T7/CN + lễ hội; xuất bản web |
| `performance_contracts` | id, artist_id, type, rate `DECIMAL`, period_start, period_end, signed_at, status | theo buổi/mùa/dự án; ký điện tử |

`artist_id` → `HR.collaborators` (dùng chung hồ sơ CTV). Thành tích số buổi diễn từng nghệ nhân lưu để ưu tiên phân công.

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| CRUD `/nt/schedules` · POST `/nt/schedules/:id/publish` | NT-SCH-01 | điều phối SK |
| POST `/nt/schedules/:id/assign` (SMS) | NT-SCH-02 | trưởng đội NT |
| CRUD `/nt/contracts` · POST `/nt/payouts` | NT-CON-01 | HR/CTV |
| GET `/nt/reports` | NT-RPT-01 | QL/Phó TGĐ VH |

---

## 6. Màn hình UI

Lịch biểu diễn tuần/tháng (loại tiết mục, địa điểm, giờ, thời lượng) + nút xuất bản web booking · Phân công nghệ nhân/nhạc công theo buổi (cảnh báo thiếu người: tối thiểu 3 nghệ nhân + 2 nhạc công/buổi Ví Dặm) · Hợp đồng & thù lao CTV (ký điện tử, khấu trừ TNCN) · Báo cáo số buổi/lượt khách/chi phí (liên kết đánh giá BK-REV).

---

## 7. Luồng nghiệp vụ chính

Lập lịch tuần/tháng (cố định T7/CN + lễ hội) → xuất bản lên web booking (NT-SCH-01) → phân công nghệ nhân từ danh sách CTV, xác nhận SMS, cảnh báo thiếu người (NT-SCH-02) → sau buổi diễn ghi nhận thành tích → tổng hợp thù lao tháng, khấu trừ TNCN 10% nếu >2tr/lần, liên kết HR-CTV/FM (NT-CON-01) → báo cáo hoạt động & đóng góp doanh thu gián tiếp (NT-RPT-01).

---

## 8. NFR áp dụng

PERF-02 · UX-02 (lịch diễn song ngữ trên web) · SEC-03/04 · DATA-04 · INT-03 (SMS xác nhận nghệ nhân).

## 9. Tích hợp ngoài

SMS/Zalo xác nhận lịch nghệ nhân (INT-03); lịch diễn hiển thị trên web booking (BK-CAT); thù lao → kế toán/thuế FM.

## 10. Phụ thuộc module khác

- **↔ HR**: nghệ nhân = CTV, dùng chung `collaborators` + thù lao (NT-CON ↔ HR-CTV-03).
- **→ FM**: chi phí thù lao + TNCN (FM-TAX).
- **→ BK**: xuất bản lịch diễn (NT-SCH-01 → BK-CAT); đánh giá khách (NT-RPT ← BK-REV).
- **↔ VG**: sự kiện/lễ hội, âm thanh-ánh sáng-sân khấu (`vg-am-thanh`, `vg-bieu-dien`), phục trang → VT-EXP.

## 11. Ước lượng & Definition of Done

**Tổng: 6 MD dev / 2 MD test.** Trọng tâm P1: NT-SCH-01/02.
**DoD (P1)**: lập & xuất bản lịch diễn lên web; phân công nghệ nhân + xác nhận SMS + cảnh báo thiếu người; hợp đồng/thù lao liên thông HR-CTV với khấu trừ TNCN; tôn trọng tính đặc thù Ví Dặm (di sản UNESCO).
