# 99 — Kế hoạch Handover Dự án KDL Hà Tĩnh

> Lộ trình biến bộ đặc tả (179 FR / 9 module / org-chart 90 tổ) thành sản phẩm phần mềm, theo **vertical-slice** — không làm phẳng toàn bộ FR cùng lúc, mà dựng nền rồi nhân bản pattern.
> Đọc kèm: [00 Kiến trúc](00-kien-truc-tong-the.md) · [01 Phân quyền](01-phan-quyen-rbac.md) · 9 blueprint module [02](02-booking.md)–[10](10-cong-nghe-thong-tin.md).

---

## 1. Trạng thái artefact hiện có

| Artefact | Vai trò | Trạng thái |
|----------|---------|-----------|
| `KDL_Requirements_Full.csv` | Nguồn chân lý 179 FR | ✅ hoàn chỉnh |
| `charts_html/` (org-chart + data) | Trực quan hóa cơ cấu + ánh xạ FR_MAP | ✅ hoàn chỉnh |
| `docs/*.md` (bộ này) | 14 bản prototype/blueprint + workflow + handover | ✅ hoàn chỉnh |
| Codebase ứng dụng | NestJS/Next/Postgres | ⛔ **chưa bắt đầu** — là việc của các pha dưới |

→ Đội nhận bàn giao có đủ: đặc tả FR, cơ cấu tổ chức, mô hình phân quyền, schema phác thảo, ước lượng. Đủ để lập sprint plan và code ngay.

---

## 2. Ước lượng tổng hợp (man-day, từ CSV)

| Module | FR | Dev MD | Test MD | Tổng MD |
|--------|:--:|:------:|:-------:|:-------:|
| BK — Web Booking | 35 | 54.0 | 23.5 | 77.5 |
| HR — Nhân sự | 39 | 52.5 | 21.5 | 74.0 |
| FM — Tài chính | 26 | 45.0 | 19.5 | 64.5 |
| VT — Vật tư & Thiết bị | 24 | 34.0 | 13.0 | 47.0 |
| OP — Vận hành | 36 | 55.0 | 23.5 | 78.5 |
| SP — Spa & Wellness | 6 | 10.0 | 4.0 | 14.0 |
| VG — Vui chơi & Giải trí | 4 | 6.5 | 3.0 | 9.5 |
| NT — Nghệ thuật Dân gian | 4 | 6.0 | 2.0 | 8.0 |
| IT — Công nghệ thông tin | 5 | 8.5 | 3.5 | 12.0 |
| **Tổng FR** | **179** | **271.5** | **113.5** | **385.0** |

**Lưu ý quan trọng**: 385 MD là effort **chức năng (FR)** thuần theo CSV. **Chưa gồm**:
- **Pha 0 — Nền tảng** (Auth/RBAC/CASL/audit/seed/scaffold monorepo + CI/CD): ước lượng bổ sung **~25–35 MD** (không có trong CSV vì là hạ tầng kỹ thuật, không phải FR).
- NFR cross-cutting (27 NFR: hiệu năng, bảo mật, i18n, offline POS…), tích hợp sâu (VNPay/MoMo/MISA/eTax/HTKK), thiết kế UI/UX, DevOps, quản lý dự án.
- Hệ số rủi ro/buffer (khuyến nghị +20–30%).

→ **Tổng quy mô thực tế ước tính ~500–550 MD** (≈ 5–6 dev × 5–6 tháng). Dùng làm khung thương lượng, tinh chỉnh theo năng suất đội thực tế.

---

## 3. Lộ trình phân pha (vertical-slice)

```
Pha 0  Nền tảng          ──►  Pha 1  Lát mẫu      ──►  Pha 2  Lõi vận hành+tiền
  Auth/RBAC/CASL              HR  (own-data,SoD)        OP  (PMS, POS)
  audit/seed FR_MAP           BK  (public+admin)        FM  (SoD, thuế VN)
  IT-SEC-01, scaffold                                        │
       │                                                     ▼
       └──────────────────────────────────►  Pha 3  VT  ──►  Pha 4  SP·VG·NT·IT
```

| Pha | Phạm vi | Mục tiêu | DoD pha |
|-----|---------|----------|---------|
| **0 — Nền tảng** | Monorepo scaffold (apps/api, apps/web, libs) · core Auth (JWT+2FA) · **RBAC+ABAC bằng CASL** · audit log · **seed roles/permissions tự động từ FR_MAP** · IT-SEC-01 · CI/CD | Một user đăng nhập, được gán vai trò theo org-chart, bị chặn/cho phép đúng theo quyền; audit ghi đầy đủ | docs/01 chạy thực: 3 ma trận mẫu (lễ tân/ngân quỹ/nghệ nhân) thực thi đúng scope |
| **1 — Lát mẫu** | **HR** (giàu phân quyền: own-data lương/chấm công + SoD duyệt lương) + **BK** (public web + admin, thanh toán) | Chốt pattern module để nhân bản: controller/service/policy/dto, data-scope, maker-checker, tích hợp ngoài | HR DoD + BK DoD (xem [03](03-nhan-su.md)/[02](02-booking.md) mục 11) |
| **2 — Lõi vận hành + tiền** | **OP** (PMS, POS offline) + **FM** (SoD đa cấp, thuế VN, hóa đơn ĐT) | Vòng đời lưu trú end-to-end + dòng tiền khép kín BK→OP→FM | OP DoD + FM DoD |
| **3 — Kho** | **VT** (kho, bảo trì, mua sắm) | Cung cấp tồn kho/chi phí cho OP-F&B và FM | VT DoD |
| **4 — Dịch vụ chuyên biệt** | **SP · VG · NT · IT** (phần còn lại) | Hoàn thiện trải nghiệm + đặc thù Hà Tĩnh (Ví Dặm) + vận hành IT | DoD từng module |

**Nguyên tắc thứ tự**: ưu tiên **P1 trước** trong mỗi pha; module phụ thuộc cao (OP↔BK↔FM) làm gần nhau; IT-SEC-01 nằm ở Pha 0 vì là mặt vận hành của lõi phân quyền.

---

## 4. Phụ thuộc liên module (rút từ FR_MAP)

```
        ┌─────────► FM (doanh thu, thuế, chi phí) ◄──────────┐
        │            ▲          ▲           ▲                │
   BK ──┼──► OP ─────┘          │           │                │
   (đặt) │   (vận hành) ──► VT ─┘      HR ──┘           SP·VG·NT
        │      │                    (lương→thuế)         (doanh thu,
        └──────┘                    (CTV→NT)              thù lao)
   core/RBAC (docs/01) ◄─── IT-SEC-01 ──► mọi module
```

- **BK → OP**: trạng thái phòng, QR check-in.
- **BK/OP → FM**: doanh thu tự động, hóa đơn, thu quầy.
- **OP/F&B → VT**: nguyên liệu theo recipe; bảo trì.
- **HR → FM**: TNCN, BHXH; **HR ↔ NT**: CTV nghệ nhân.
- **IT-SEC-01 → tất cả**: phân quyền tập trung.

→ Khuyến nghị làm **core + BK + OP + FM** thành xương sống trước (chiếm ~75% effort & rủi ro tích hợp), 5 module còn lại cắm vào.

---

## 5. Quy ước handover

**Môi trường**: `dev` (local, Docker Postgres+Redis) → `staging` (đầy đủ tích hợp sandbox VNPay/MISA) → `prod`. Config 12-factor qua `.env` (NFR-MNT-02).

**Definition of Ready (bắt đầu một FR)**: có mã FR trong CSV + blueprint module tương ứng + vai trò/quyền xác định trong docs/01 + schema entity rõ + tiêu chí nghiệm thu.

**Definition of Done (chung mọi FR)**: code + test (unit ≥ test-MD ước lượng) + qua PoliciesGuard (RBAC/ABAC) + audit log + soft-delete + i18n vi/en + đạt NFR liên quan + review + merge.

**Checklist bàn giao cuối dự án**: source + README chạy được · migration + seed (roles từ FR_MAP) · biến môi trường mẫu · tài liệu API (OpenAPI) · hướng dẫn vận hành (backup/DR, monitoring) · ma trận phân quyền đã review · nghiệm thu P1 từng module.

---

## 6. Rủi ro & giảm thiểu

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|--------|-----------|-----------|
| Tích hợp VN (VNPay/MoMo/MISA/eTax/HTKK/BHXH) chậm, sandbox khó | Cao | Làm sớm ở Pha 1-2, có mock/adapter; đệm thời gian |
| Tuân thủ kế toán TT200/VAS/thuế sai | Cao | Có kế toán/kiểm soát nội bộ review FM; SoD + bút toán bất biến |
| Vận hành 24/7 + POS offline | TB-Cao | NFR-AVAIL-03: offline ≥4h + sync; test ngắt mạng |
| Mùa vụ T4–9 bùng CTV/thời vụ | TB | Vai trò có hạn dùng (valid_to) auto-expire; chấm công thời vụ |
| Đặc thù Ví Dặm bị xem nhẹ | TB | NT là điểm nhấn sản phẩm, không cắt giảm; xuất bản web |
| Đồng bộ CSV ↔ docs ↔ code lệch | TB | Quy tắc đồng bộ 4 nguồn (xem CLAUDE.md mục 8) |

---

## 7. Đội ngũ đề xuất (tham chiếu org-chart `ql-phan-mem`)

- 1 **Tech Lead/Architect** (Pha 0 + review xuyên suốt) · 3–4 **Fullstack/Backend** (NestJS) · 1–2 **Frontend** (Next.js) · 1 **DBA/Data** (Prisma, báo cáo) · 1 **QA** (test theo test-MD) · 1 **PM/PMO**.
- Cố vấn nghiệp vụ: 1 **Kế toán trưởng** (FM), 1 **Quản lý vận hành** (OP/Lưu trú/F&B) — nghiệm thu theo pha.

---

## 8. Liên kết các bản prototype

| # | Doc | Module/Chủ đề |
|---|-----|---------------|
| 00 | [Kiến trúc tổng thể](00-kien-truc-tong-the.md) | Stack, modular monolith, quy ước, 27 NFR |
| 01 | [Phân quyền RBAC](01-phan-quyen-rbac.md) | Lõi Auth/RBAC/ABAC/SoD |
| 02 | [Booking](02-booking.md) | BK (35 FR) |
| 03 | [Nhân sự](03-nhan-su.md) | HR (39 FR) |
| 04 | [Tài chính](04-tai-chinh.md) | FM (26 FR) |
| 05 | [Vật tư](05-vat-tu.md) | VT (24 FR) |
| 06 | [Vận hành](06-van-hanh.md) | OP (36 FR) |
| 07 | [Spa & Wellness](07-spa-wellness.md) | SP (6 FR) |
| 08 | [Vui chơi](08-vui-choi.md) | VG (4 FR) |
| 09 | [Nghệ thuật Dân gian](09-nghe-thuat-dan-gian.md) | NT (4 FR) |
| 10 | [Công nghệ thông tin](10-cong-nghe-thong-tin.md) | IT (5 FR) |
---

## 9. Workflow BA & Setup Plan

Doc bo sung: [11-workflow-tong-the.md](11-workflow-tong-the.md).

Dung tai lieu nay truoc khi vao sprint planning. No gom 179 FR thanh 7 workflow xuyen module:
W1 Booking -> Check-in, W2 Stay -> Checkout, W3 Room Turnover, W4 SLA/Escalation, W5 Inventory -> Expense, W6 Workforce -> Payroll, W7 Access/Audit/DR.

Nguyen tac implement: chot workflow va rule voi khach truoc, sau do moi bung thanh backlog FR/module.
