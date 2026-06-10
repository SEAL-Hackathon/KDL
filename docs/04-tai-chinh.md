# 04 — Module Tài chính (FM) · Prototype

> Mã module: **FM** · 26 FR · Nest module `finance` · Ước lượng **45 MD dev / 19.5 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md) — FM áp **SoD/Maker-Checker nặng nhất** + tuân thủ kế toán/thuế VN.

---

## 1. Mục tiêu & phạm vi

Quản trị tài chính – kế toán toàn KDL: **ngân sách, thu/doanh thu, chi phí (duyệt đa cấp), kế toán tổng hợp, thuế & pháp lý, báo cáo tài chính**. Tuân thủ **TT200/2014, VAS, VAT 10%, TNCN lũy tiến, BHXH/BHYT/BHTN**. Là điểm hội tụ số liệu từ BK (doanh thu), HR (lương/thuế), VT (chi phí vật tư), OP (thu tại quầy).

**Đặc thù kiểm soát**: maker ≠ checker; bút toán khóa kỳ không xóa; đối soát quỹ 2 người.

---

## 2. Danh sách FR (26)

**1. Ngân sách** (FM-BUD) *dev 5/test 2.5* — SoD
| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| FM-BUD-01 | Lập ngân sách năm (TGĐ duyệt, version) | P1 | 2/1 |
| FM-BUD-02 | Theo dõi thực hiện (cảnh báo vượt >10%) | P1 | 2/1 |
| FM-BUD-03 | Điều chỉnh ngân sách (audit) | P2 | 1/0.5 |

**2. Thu & Doanh thu** (FM-REV) *9.5/4*
| FM-REV-01 | Ghi nhận doanh thu booking tự động | P1 | 2/1 |
| FM-REV-02 | Thu tiền mặt tại quầy (đối soát ca) | P1 | 1.5/0.5 |
| FM-REV-03 | Đối soát doanh thu cuối ngày | P1 | 2/1 |
| FM-REV-04 | Hóa đơn VAT điện tử (MISA/VNPT) | P1 | 2.5/1 |
| FM-REV-05 | Báo cáo doanh thu theo dịch vụ | P1 | 1.5/0.5 |

**3. Chi phí & Thanh toán** (FM-EXP) *7.5/3* — **Maker-Checker**
| FM-EXP-01 | Lập đề xuất chi/thanh toán | P1 | 1.5/0.5 |
| FM-EXP-02 | Phê duyệt chi đa cấp (escalate 48h) | P1 | 2/1 |
| FM-EXP-03 | Ghi nhận TT nhà cung cấp (công nợ) | P1 | 1.5/0.5 |
| FM-EXP-04 | Tạm ứng nhân viên (≤50% lương) | P2 | 1/0.5 |
| FM-EXP-05 | Báo cáo chi phí theo bộ phận | P1 | 1.5/0.5 |

**4. Kế toán tổng hợp** (FM-ACC) *8.5/3.5*
| FM-ACC-01 | Sổ nhật ký thu chi (TT200, khóa kỳ) | P1 | 2/1 |
| FM-ACC-02 | Công nợ phải thu (cảnh báo quá hạn) | P1 | 1.5/0.5 |
| FM-ACC-03 | Công nợ phải trả | P1 | 1.5/0.5 |
| FM-ACC-04 | Đối soát ngân hàng (import sao kê) | P2 | 2/1 |
| FM-ACC-05 | Quản lý quỹ tiền mặt (2 người kiểm) | P1 | 1.5/0.5 |

**5. Thuế & Pháp lý** (FM-TAX) *7/3*
| FM-TAX-01 | Tính & kê khai VAT 10% (XML eTax) | P1 | 2/1 |
| FM-TAX-02 | Quyết toán TNCN (HTKK) | P1 | 2/1 |
| FM-TAX-03 | BHXH/BHYT/BHTN (cổng BHXH ĐT) | P1 | 1.5/0.5 |
| FM-TAX-04 | Hợp đồng kinh tế (cảnh báo hết hạn) | P2 | 1.5/0.5 |

**6. Báo cáo Tài chính** (FM-RPT) *7.5/3.5*
| FM-RPT-01 | Báo cáo KQKD (P&L, VAS) | P1 | 2/1 |
| FM-RPT-02 | Bảng cân đối kế toán (TT200) | P1 | 2/1 |
| FM-RPT-03 | Lưu chuyển tiền tệ (VAS 24) | P2 | 1.5/0.5 |
| FM-RPT-04 | Dashboard tài chính (TGĐ/KTT) | P1 | 2/1 |

---

## 3. Vai trò & phân quyền (SoD trọng tâm)

| Vai trò (org-key) | Resource | view | create(maker) | approve(checker) | export | scope |
|-------------------|----------|:--:|:--:|:--:|:--:|------|
| Phòng ban (mọi tổ) | FM-EXP-01 (đề xuất chi) | ✓ | ✓ | — | — | own |
| `ql-ke-toan-cp` KT chi phí | FM-EXP, FM-ACC, FM-BUD | ✓ | ✓ | ✓(cấp 1) | ✓ | block(FM) |
| `ql-ngan-quy` Ngân quỹ | FM-REV, FM-EXP, FM-ACC-05 | ✓ | ✓ | — | ✓ | block(FM) |
| `ql-ke-toan-th` KT tổng hợp | FM-ACC, FM-RPT, FM-BUD | ✓ | ✓ | — | ✓ | block(FM) |
| Kế toán trưởng (KTT) | FM-EXP, FM-BUD, FM-RPT-02 | ✓ | — | **✓** | ✓ | block |
| `ql-kiem-soat` Kiểm soát NB | FM-RPT, HR-ADM | ✓ | — | — | ✓ | block |
| TGĐ | toàn FM | ✓ | — | **✓(cấp cao)** | ✓ | all |

**Ngưỡng duyệt chi (FM-EXP-01/02)**: >5tr → KTT; >20tr → TGĐ; timeout 48h tự escalate. **SoD**: người lập phiếu ≠ người duyệt. **Quỹ tiền mặt (FM-ACC-05)**: 2 người kiểm quỹ. **Bút toán khóa kỳ (FM-ACC-01)** không sửa/xóa — chỉ bút toán điều chỉnh.

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.FM)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `budgets` | id, dept_id, period, category, planned_amount, approved_by, version, locked | version hóa; không sửa sau duyệt |
| `revenues` | id, source, ref_id, amount `DECIMAL(18,4)`, service_type, date, created_by | source: booking/quầy; ref_id→bookings |
| `expenses` | id, dept_id, requester_id, category, amount, invoice_no, status, approved_by, approved_at, paid_at | workflow đa cấp |
| `chart_of_accounts` | id, code, name, type, parent_id | TK kế toán TT200 |
| `tax_records` | id, type, period, amount, filed_at, file_url | VAT/TNCN/BHXH; XML/HTKK |

Bổ sung khi triển khai: bảng `cash_ledger` (quỹ theo ca), `receivables`/`payables` (công nợ), liên kết `approval_flow` (docs/01).

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| POST `/budgets` · POST `/budgets/:id/approve` | FM-BUD-01 | KT / TGĐ |
| POST `/expenses` (maker) · POST `/expenses/:id/approve` (checker) | FM-EXP-01/02 | phòng ban / KTT-TGĐ |
| GET `/revenues/reconcile?date=` | FM-REV-03 | ngân quỹ |
| POST `/invoices/vat` (MISA/VNPT) | FM-REV-04 | ngân quỹ/KT |
| POST `/bank/import` | FM-ACC-04 | KT tổng hợp |
| GET `/tax/vat?period=` (XML) · `/tax/pit` (HTKK) | FM-TAX-01/02 | KT/KTT |
| GET `/reports/pnl` · `/reports/balance-sheet` | FM-RPT-01/02 | KTT/TGĐ |

---

## 6. Màn hình UI

Lập & theo dõi ngân sách (chart kế hoạch vs thực tế, cảnh báo vượt) · Lập phiếu chi + **luồng duyệt** (trạng thái, escalate) · Thu tiền mặt + đối soát cuối ca/cuối ngày · Quản lý hóa đơn VAT điện tử · Sổ nhật ký + khóa kỳ · Công nợ phải thu/trả (cảnh báo hạn) · Quỹ tiền mặt · Kê khai thuế (VAT/TNCN/BHXH) · **Dashboard tài chính** real-time (doanh thu ngày, chi phí, lợi nhuận lũy kế, công suất) · Báo cáo P&L / cân đối / lưu chuyển.

---

## 7. Luồng nghiệp vụ chính

**Duyệt chi (Maker-Checker)**: phòng ban lập phiếu + hóa đơn (EXP-01) → Kế toán kiểm → nếu >5tr KTT duyệt → nếu >20tr TGĐ duyệt (EXP-02, timeout 48h escalate) → ghi công nợ phải trả (EXP-03) → thanh toán → bút toán sổ nhật ký (ACC-01).
**Doanh thu → đối soát**: đơn BK Completed → ghi doanh thu tự động (REV-01) + thu quầy (REV-02) → cuối ngày đối soát online + quầy + sao kê NH (REV-03, chênh >100k giải trình) → cuối tháng P&L (RPT-01).
**Thuế kỳ**: tổng hợp VAT đầu ra/vào → kê khai XML eTax (TAX-01); thu nhập NV từ HR → TNCN HTKK (TAX-02); trích BHXH → cổng BHXH (TAX-03).

---

## 8. NFR áp dụng

DATA-02 (DECIMAL(18,4) — **bắt buộc**, không mất precision) · SEC-02 (2FA) · SEC-03 (RBAC) · SEC-04 (audit toàn bộ bút toán) · DATA-04 (soft-delete, cấm hard-delete bút toán) · PERF-04 (batch báo cáo đêm) · INT-01 (cổng thanh toán đối soát) · INT-02 (hóa đơn điện tử MISA/VNPT).

---

## 9. Tích hợp ngoài

- **Hóa đơn điện tử** MISA/VNPT (INT-02): phát hành/hủy/tra cứu VAT (FM-REV-04).
- **eTax** (XML VAT), **HTKK** (TNCN), **cổng BHXH điện tử** (FM-TAX-01/02/03).
- **Ngân hàng**: import sao kê CSV/Excel đối soát (FM-ACC-04); cổng thanh toán đối soát doanh thu (INT-01).

---

## 10. Phụ thuộc module khác

- **← BK**: doanh thu booking tự động (FM-REV-01 ← BK Completed); refund.
- **← HR**: lương → TNCN (FM-TAX-02), BHXH (FM-TAX-03); thù lao CTV.
- **← VT**: chi phí mua sắm/nhập kho → công nợ phải trả (FM-EXP-03 ← VT-PRO/IMP).
- **← OP**: thu tiền mặt nhà hàng/dịch vụ (FM-REV-02 ← OP-FNB-05, OP-CHK-02).
- **→ tất cả khối**: ngân sách & báo cáo chi phí theo bộ phận (FM-BUD/EXP-05).

---

## 11. Ước lượng & Definition of Done

**Tổng: 45 MD dev / 19.5 MD test.** Trọng tâm P1: BUD-01/02, REV (toàn bộ), EXP-01/02/03/05, ACC-01/02/03/05, TAX-01/02/03, RPT-01/02/04.

**DoD (P1)**: phiếu chi chạy hết luồng maker→checker đa cấp + escalate; doanh thu BK tự động vào sổ + đối soát cuối ngày khớp; xuất hóa đơn VAT điện tử thật (sandbox MISA/VNPT); kê khai VAT/TNCN/BHXH ra file đúng định dạng; P&L & cân đối kế toán khớp số phân hệ; bút toán khóa kỳ bất biến; tiền dùng DECIMAL(18,4) toàn bộ; audit đầy đủ.
