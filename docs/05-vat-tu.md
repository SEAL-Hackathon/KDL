# 05 — Module Vật tư & Thiết bị (VT) · Prototype

> Mã module: **VT** · 24 FR · Nest module `inventory` · Ước lượng **34 MD dev / 13 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Quản lý **tài sản cố định + vật tư tiêu hao + bảo trì thiết bị + mua sắm/đấu thầu** cho toàn KDL. Cung cấp dữ liệu tồn kho real-time cho F&B (food cost), buồng phòng (amenities), kỹ thuật (phụ tùng), và chi phí cho FM. Mã thiết bị in QR dán; định mức tiêu hao theo bộ phận.

**Ranh giới**: VT lo kho & tài sản & bảo trì; phê duyệt chi tiền thuộc FM; sự cố kỹ thuật phát sinh thuộc OP-TECH (tạo phiếu bảo trì sang VT-MNT).

---

## 2. Danh sách FR (24)

**1. Danh mục Tài sản** (VT-CAT) *dev 5.5/test 2.5* · **2. Nhập kho** (VT-IMP) *3.5/1.5* — SoD
| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| VT-CAT-01 | Danh mục loại tài sản | P1 | 1/0.5 |
| VT-CAT-02 | DS thiết bị cố định (QR-code) | P1 | 2/1 |
| VT-CAT-03 | Quản lý vị trí/khu vực | P1 | 1/0.5 |
| VT-CAT-04 | Danh mục vật tư tiêu hao (định mức) | P1 | 1.5/0.5 |
| VT-IMP-01 | Lập phiếu nhập kho | P1 | 1.5/0.5 |
| VT-IMP-02 | Duyệt phiếu nhập (thủ kho→KT) | P1 | 1/0.5 |
| VT-IMP-03 | Lịch sử nhập kho | P2 | 1/0.5 |

**3. Xuất kho** (VT-EXP) *4/1.5* · **4. Tồn kho & Cảnh báo** (VT-STK) *4.5/1.5*
| VT-EXP-01 | Lập phiếu xuất kho (≤ tồn) | P1 | 1.5/0.5 |
| VT-EXP-02 | Xuất theo định mức bộ phận | P2 | 1.5/0.5 |
| VT-EXP-03 | Lịch sử xuất kho | P2 | 1/0.5 |
| VT-STK-01 | Theo dõi tồn kho real-time | P1 | 1.5/0.5 |
| VT-STK-02 | Cảnh báo tồn kho tối thiểu | P1 | 1.5/0.5 |
| VT-STK-03 | Kiểm kê kho định kỳ (chênh >5%) | P2 | 1.5/0.5 |

**5. Bảo trì Thiết bị** (VT-MNT) *6/2.5*
| VT-MNT-01 | Lập lịch bảo trì định kỳ | P2 | 1.5/0.5 |
| VT-MNT-02 | Phiếu bảo trì/sửa chữa | P1 | 2/1 |
| VT-MNT-03 | Lịch sử bảo trì từng TB | P2 | 1/0.5 |
| VT-MNT-04 | Tài sản hết khấu hao/thanh lý | P3 | 1.5/0.5 |

**6. Báo cáo** (VT-RPT) *4/1.5* · **7. Mua sắm & Đấu thầu** (VT-PRO) *6.5/2* — **SoD**
| VT-RPT-01 | BC tồn kho & nhập xuất tháng | P1 | 1.5/0.5 |
| VT-RPT-02 | BC chi phí vật tư theo bộ phận | P2 | 1.5/0.5 |
| VT-RPT-03 | BC tình trạng thiết bị | P2 | 1/0.5 |
| VT-PRO-01 | Lập kế hoạch mua sắm (ngưỡng) | P2 | 1.5/0.5 |
| VT-PRO-02 | Quản lý nhà cung cấp (duyệt NCC) | P1 | 1.5/0.5 |
| VT-PRO-03 | Báo giá & so sánh NCC | P2 | 2/0.5 |
| VT-PRO-04 | Theo dõi đơn đặt hàng (PO) | P2 | 1.5/0.5 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | approve | scope |
|-------------------|----------|:--:|:--:|:--:|:--:|------|
| `fb-kho` Thủ kho (F&B) | VT-IMP/EXP/STK/CAT | ✓ | ✓(maker) | ✓ | — | team |
| Bộ phận nhận vật tư | VT-EXP-01 (yêu cầu xuất) | ✓ | ✓ | — | — | own |
| QL kho / Kế toán | VT-IMP-02 (duyệt nhập) | ✓ | — | — | **✓(checker)** | block |
| `lt-dien`/`lt-co-khi` Kỹ thuật | VT-MNT (bảo trì) | ✓ | ✓ | ✓ | — | team |
| Phòng mua sắm | VT-PRO | ✓ | ✓ | ✓ | — | block(VT) |
| Trưởng phòng | VT-PRO-03 (chọn NCC) | ✓ | — | — | **✓** | block |
| Phó TGĐ Vận hành/NS | toàn VT | ✓ | ✓ | ✓ | ✓ | block |

**SoD**: thủ kho lập phiếu nhập (maker) ≠ QL kho/KT duyệt (checker, VT-IMP-02); chọn NCC trúng cần chữ ký Trưởng phòng (VT-PRO-03). **Ngưỡng mua sắm**: >20tr lấy 3 báo giá; >200tr đấu thầu (VT-PRO-01).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.VT)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `supply_catalog` | id, code, name, unit, category, min_stock, daily_quota, supplier_id | định mức/cảnh báo |
| `supply_imports` | id, catalog_id, supplier_id, qty, unit_price `DECIMAL(18,4)`, invoice_no, received_at, approved_by | phiếu đã duyệt không sửa |
| `supply_exports` | id, catalog_id, dept_id, qty, reason, approved_by, exported_at | ≤ tồn kho |
| `stock_ledger` | id, catalog_id, qty_on_hand, last_updated | cập nhật real-time sau nhập/xuất |
| `maintenance_orders` | id, asset_id, symptom, tech_id, parts_cost, status, opened_at, closed_at | từ OP-TECH |

Bổ sung: `assets` (thiết bị cố định: mã QR, vị trí, năm mua, giá trị, khấu hao, tình trạng), `suppliers` (NCC: MST, đánh giá, hồ sơ pháp lý), `purchase_orders` (PO).

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| CRUD `/assets` (QR) · `/supply-catalog` | VT-CAT | thủ kho |
| POST `/imports` (maker) · POST `/imports/:id/approve` | VT-IMP-01/02 | thủ kho / QL kho |
| POST `/exports` | VT-EXP-01 | bộ phận / thủ kho |
| GET `/stock` · GET `/stock/alerts` | VT-STK-01/02 | thủ kho/QL |
| POST `/stocktakes` | VT-STK-03 | thủ kho |
| CRUD `/maintenance-orders` | VT-MNT-02 | kỹ thuật |
| CRUD `/suppliers` · POST `/quotations/compare` | VT-PRO-02/03 | mua sắm |
| POST `/purchase-orders` | VT-PRO-04 | mua sắm |

---

## 6. Màn hình UI

Danh mục tài sản + in QR · Danh mục vật tư + định mức · Phiếu nhập + duyệt · Phiếu xuất + so định mức · **Tồn kho real-time** + cảnh báo tối thiểu · Kiểm kê (nhập thực tế, chênh lệch) · Lịch & phiếu bảo trì · Khấu hao/thanh lý · Quản lý NCC + so sánh báo giá · Theo dõi PO · Báo cáo tồn kho/chi phí/tình trạng TB.

---

## 7. Luồng nghiệp vụ chính

**Nhập → tồn**: mua hàng (PO) → nhận hàng → thủ kho lập phiếu nhập (maker, IMP-01) → QL kho/KT duyệt (checker, IMP-02) → cập nhật `stock_ledger` (STK-01) → ghi công nợ phải trả sang FM (FM-EXP-03).
**Xuất theo định mức**: bộ phận yêu cầu → kiểm tồn (≤ tồn) → xuất (EXP-01) → so định mức, cảnh báo vượt >20% (EXP-02) → trừ tồn real-time.
**Bảo trì**: OP-TECH tạo phiếu sự cố → sinh `maintenance_order` (MNT-02) → KTV xử lý + chi phí phụ tùng → đóng phiếu → lịch sử & khấu hao (MNT-03/04).
**Mua sắm**: kế hoạch (PRO-01, theo ngưỡng) → lấy báo giá nhiều NCC → so sánh chọn NCC (PRO-03, Trưởng phòng ký) → tạo PO (PRO-04) → nhận hàng → phiếu nhập.

---

## 8. NFR áp dụng

DATA-01 (FK, không orphan) · DATA-02 (DECIMAL giá trị) · DATA-04 (soft-delete) · SCALE-02 (×10 dữ liệu) · SEC-03/04 (RBAC, audit phiếu) · PERF-02 (API ≤500ms) · MNT-01 (cảnh báo tồn/bảo trì real-time).

---

## 9. Tích hợp ngoài

Chủ yếu nội bộ. Cảnh báo qua email/Zalo (tồn tối thiểu, bảo trì sắp đến hạn, NCC) — INT-03. Liên kết hồ sơ NCC với hợp đồng kinh tế FM-TAX-04.

---

## 10. Phụ thuộc module khác

- **→ FM**: chi phí nhập kho/mua sắm → công nợ phải trả (FM-EXP-03), báo cáo chi phí vật tư.
- **↔ OP/F&B**: xuất nguyên liệu theo recipe (VT-EXP ← OP-FNB-06), amenities/minibar (OP-ROOM-04), phiếu bảo trì (VT-MNT ← OP-TECH-02).
- **↔ IT**: thiết bị IT liên kết danh mục tài sản (IT-INF-01 ↔ VT-CAT).
- **↔ VG/SP**: checklist an toàn thiết bị → phiếu bảo trì (VG-OPS-02, `sw-van-hanh-gym` → VT-MNT).

---

## 11. Ước lượng & Definition of Done

**Tổng: 34 MD dev / 13 MD test.** Trọng tâm P1: CAT-01/02/03/04, IMP-01/02, EXP-01, STK-01/02, MNT-02, RPT-01, PRO-02.

**DoD (P1)**: tạo danh mục vật tư/thiết bị (QR) → nhập kho qua duyệt → xuất kho trừ tồn real-time → cảnh báo tồn tối thiểu chạy; phiếu bảo trì liên thông từ OP-TECH; chi phí nhập đẩy sang FM; SoD nhập kho thực thi; báo cáo tồn/nhập/xuất tháng khớp ledger.
