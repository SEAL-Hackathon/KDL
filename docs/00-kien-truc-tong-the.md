# 00 — Kiến trúc tổng thể (Prototype nền)

> Tài liệu nền cho toàn bộ prototype KDL Hà Tĩnh. Đọc file này **trước** mọi doc module.
> Mỗi `docs/*.md` là một **bản prototype** (blueprint đủ để dev bắt tay code). File này định nghĩa stack, kiến trúc, quy ước chung mà 9 module đều tuân theo.

---

## 1. Mục tiêu kiến trúc

Biến bộ đặc tả (179 FR / 9 module / org-chart 90 tổ) thành **một hệ phần mềm quản trị KDL** vận hành 24/7, tích hợp hệ sinh thái Việt Nam (thanh toán, hóa đơn điện tử, SMS/Zalo), tuân thủ kế toán – thuế VN, và **phân quyền theo đúng cơ cấu tổ chức**.

Nguyên tắc nền: **bám org-chart**. Cơ cấu tổ chức (`TO_DATA`) + ánh xạ `FR_MAP` (tổ → FR) chính là hạt giống của mô hình phân quyền và phân rã module — không thiết kế lại từ đầu, mà "vật chất hóa" mối liên kết đã có.

---

## 2. Stack công nghệ (đã chốt)

| Lớp | Công nghệ | Lý do |
|-----|-----------|-------|
| Backend | **NestJS (TypeScript)** | Modular sẵn — 9 module nghiệp vụ = 9 Nest module; DI + Guard hợp RBAC |
| ORM / DB | **Prisma + PostgreSQL** | Quan hệ chặt (FK), migration rõ ràng, JSON column cho cấu hình linh hoạt |
| Phân quyền | **CASL** (ability) | Diễn đạt được cả `action × subject` (RBAC) lẫn điều kiện `where` (ABAC/data-scope) |
| Frontend | **Next.js + React** | SSR cho web booking (SEO), CSR cho admin nội bộ; tái dùng được org-chart hiện có |
| Auth | **JWT** (access + refresh) | Stateless, 24h access; refresh rotation |
| Cache/Queue | **Redis** (BullMQ) | Lock đặt phòng, job báo cáo đêm, gửi email/SMS bất đồng bộ |

**Kiến trúc tổng: Modular Monolith** — một codebase, một deployable, ranh giới module rõ ràng (mỗi module = một bounded context). **Không** microservices ở giai đoạn prototype (DevOps nặng, chưa cần scale độc lập). Module có thể tách dịch vụ về sau nếu cần (NFR-SCALE-03).

---

## 3. Cấu trúc thư mục đề xuất

```
app/
├── apps/
│   ├── api/                      # NestJS backend
│   │   └── src/
│   │       ├── core/             # Auth, RBAC, audit, config, prisma — xem docs/01
│   │       ├── modules/
│   │       │   ├── booking/      # BK  (docs/02)
│   │       │   ├── hr/           # HR  (docs/03)
│   │       │   ├── finance/      # FM  (docs/04)
│   │       │   ├── inventory/    # VT  (docs/05)
│   │       │   ├── operation/    # OP  (docs/06)
│   │       │   ├── spa/          # SP  (docs/07)
│   │       │   ├── entertainment/# VG  (docs/08)
│   │       │   ├── folkart/      # NT  (docs/09)
│   │       │   └── it/           # IT  (docs/10)
│   │       └── main.ts
│   └── web/                      # Next.js frontend
│       ├── (public)/             # Web booking — khách (BK)
│       └── (admin)/              # Bảng điều hành nội bộ — nhân viên
├── libs/
│   ├── shared/                   # DTO, types, hằng số, util dùng chung
│   └── db/                       # Prisma schema + migrations + seed
├── prisma/
│   └── schema.prisma
└── .env                          # 12-factor config (NFR-MNT-02)
```

Mỗi Nest module gói: `*.controller.ts` (API) · `*.service.ts` (nghiệp vụ) · `*.dto.ts` · `*.policy.ts` (CASL rules của module).

---

## 4. Quy ước chung (mọi module bắt buộc tuân thủ)

| Quy ước | Chi tiết | Tham chiếu NFR |
|---------|----------|----------------|
| **Soft-delete** | Mọi bảng nghiệp vụ có `deleted_at`; cấm hard-delete | NFR-DATA-04 |
| **Audit log** | 100% thao tác ghi (create/update/delete/approve) → bảng `audit_log` (ai/khi/giá trị trước-sau) | NFR-SEC-04 |
| **Tiền tệ** | Kiểu `DECIMAL(18,4)`; không dùng float | NFR-DATA-02 |
| **Toàn vẹn** | FK constraints đầy đủ; không orphan record | NFR-DATA-01 |
| **i18n** | Tiếng Việt mặc định + English; key-based | NFR-UX-02 |
| **Config** | 12-factor; secret/URL qua biến môi trường, không hard-code | NFR-MNT-02 |
| **Mã hóa** | AES-256 at rest cho dữ liệu nhạy cảm (CCCD, lương); TLS 1.2+ in transit | NFR-SEC-01 |
| **Timestamp** | `created_at`, `updated_at` UTC trên mọi bảng | — |
| **Phân trang** | API list mặc định cursor/offset pagination | NFR-PERF-02 |
| **RBAC/ABAC** | Mọi endpoint qua `PoliciesGuard` (CASL); xem docs/01 | NFR-SEC-03 |

**Định dạng API**: REST, prefix `/api/v1`. Response chuẩn `{ data, meta, error }`. Lỗi theo HTTP status + mã lỗi nội bộ.

---

## 5. 9 Module ↔ Schema ↔ Doc

| Mã | Module | Nest module | Bảng chính (SCHEMA_DATA) | Doc |
|----|--------|-------------|--------------------------|-----|
| BK | Web Booking (35 FR) | `booking` | users, services, bookings, booking_items, payments, reviews, notifications | [02](02-booking.md) |
| HR | Nhân sự (39 FR) | `hr` | employees, departments, positions, attendances, leaves, salaries, kpis, collaborators | [03](03-nhan-su.md) |
| FM | Tài chính (26 FR) | `finance` | budgets, revenues, expenses, chart_of_accounts, tax_records | [04](04-tai-chinh.md) |
| VT | Vật tư & Thiết bị (24 FR) | `inventory` | supply_catalog, supply_imports, supply_exports, stock_ledger, maintenance_orders | [05](05-vat-tu.md) |
| OP | Vận hành (36 FR) | `operation` | room_status, fnb_orders, check_ins, service_requests, tech_tickets, security_incidents | [06](06-van-hanh.md) |
| SP | Spa & Wellness (6 FR) | `spa` | spa_services, spa_bookings, therapist_schedules | [07](07-spa-wellness.md) |
| VG | Vui chơi & Giải trí (4 FR) | `entertainment` | venue_tickets, safety_checklists, incident_reports | [08](08-vui-choi.md) |
| NT | Nghệ thuật Dân gian (4 FR) | `folkart` | performance_schedules, performance_contracts | [09](09-nghe-thuat-dan-gian.md) |
| IT | Công nghệ thông tin (5 FR) | `it` | it_assets, helpdesk_tickets, security_events, backup_records | [10](10-cong-nghe-thong-tin.md) |

**Liên kết chéo cốt lõi** (suy từ `FR_MAP`):
- **BK ↔ OP**: trạng thái phòng (BK-ADM-04 ↔ OP-ROOM-01), check-in (BK-BOOK-02 → OP-CHK-01).
- **BK → FM**: doanh thu tự động khi đơn Completed (FM-REV-01).
- **OP/F&B → VT**: xuất nguyên liệu theo recipe (OP-FNB-06 → VT-EXP).
- **HR ↔ FM**: lương → thuế TNCN, BHXH (HR-SAL ↔ FM-TAX).
- **NT/VG → HR**: thù lao nghệ nhân/CTV (NT-CON ↔ HR-CTV).
- **IT → tất cả**: phân quyền tập trung (IT-SEC-01 ↔ docs/01), giám sát uptime (IT-INF-02).

---

## 6. Danh mục 27 NFR (yêu cầu phi chức năng toàn hệ thống)

| Nhóm | Mã | Mục tiêu |
|------|-----|----------|
| **PERF** | PERF-01 | Web booking ≤3s load p95 @100 CCU |
| | PERF-02 | API nội bộ ≤500ms p95 |
| | PERF-03 | POS F&B ≤1s/order |
| | PERF-04 | Batch báo cáo đêm ≤5 phút/10.000 records |
| **SEC** | SEC-01 | AES-256 at rest; TLS 1.2+ |
| | SEC-02 | 2FA bắt buộc admin |
| | SEC-03 | RBAC, không privilege escalation, review/quý |
| | SEC-04 | Audit trail 100% write, lưu ≥90 ngày |
| | SEC-05 | OWASP Top 10 (web booking) |
| **AVAIL** | AVAIL-01 | Uptime ≥99.5%/tháng |
| | AVAIL-02 | Maintenance window 02:00–04:00 |
| | AVAIL-03 | POS offline ≥4h, auto-sync |
| **SCALE** | SCALE-01 | 500 CCU không giảm hiệu năng |
| | SCALE-02 | ×10 dữ liệu không refactor schema |
| | SCALE-03 | Thêm node ≤30 phút |
| **DATA** | DATA-01 | FK, không orphan |
| | DATA-02 | DECIMAL(18,4) tài chính |
| | DATA-03 | Backup RPO≤24h, RTO≤4h |
| | DATA-04 | Soft-delete bắt buộc |
| **UX** | UX-01 | Responsive mobile-first |
| | UX-02 | i18n vi/en |
| | UX-03 | WCAG 2.1 AA |
| **INT** | INT-01 | VNPay + MoMo + Banking |
| | INT-02 | Hóa đơn điện tử MISA/VNPT |
| | INT-03 | Zalo OA + SMTP failover |
| **MNT** | MNT-01 | Log tập trung, 90 ngày, alert real-time |
| | MNT-02 | 12-factor, không hard-code secret |

> Nguồn: `charts_html/data/mapping-data.js` → `NFR_DATA`. Mỗi doc module trích lại các NFR áp dụng cho module đó ở mục 8.

---

## 7. Đặc thù nghiệp vụ phải nhớ khi thiết kế

- **24/7**: ca sáng/chiều/đêm + phụ cấp; nhiều nghiệp vụ ràng buộc theo ca (OP-SEC, HR-ATT). Dữ liệu phải gắn `shift`.
- **Mùa vụ T4–9**: lực lượng CTV/thời vụ lớn → vai trò có hạn dùng (`valid_to`), auto-expire (xem docs/01).
- **Tuân thủ VN**: TT200, VAS, VAT 10%, TNCN lũy tiến, BHXH/BHYT/BHTN — phản ánh trong FM.
- **Đặc thù Hà Tĩnh**: Ví Dặm (UNESCO 2014) + ẩm thực đặc sản là **điểm nhấn sản phẩm**, không phải module phụ (xem docs/09).

---

## 8. Liên hệ các doc khác

- Cơ chế phân quyền chi tiết (bảng, seed, SoD): **[01-phan-quyen-rbac.md](01-phan-quyen-rbac.md)**
- 9 blueprint module: **[02](02-booking.md)** … **[10](10-cong-nghe-thong-tin.md)**
- Lộ trình triển khai & bàn giao: **[99-handover-plan.md](99-handover-plan.md)**
