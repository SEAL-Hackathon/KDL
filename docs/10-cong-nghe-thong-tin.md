# 10 — Module Công nghệ thông tin (IT) · Prototype

> Mã module: **IT** · 5 FR · Nest module `it` · Ước lượng **8.5 MD dev / 3.5 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md).

---

## 1. Mục tiêu & phạm vi

Quản trị **hạ tầng & vận hành hệ thống** của KDL: inventory thiết bị IT, **giám sát uptime & cảnh báo**, **helpdesk nội bộ**, **bảo mật/phân quyền tập trung**, **sao lưu & phục hồi thảm họa (DR)**. IT là module **nền vận hành** — đặc biệt IT-SEC-01 (phân quyền tập trung) gắn trực tiếp với lõi RBAC (docs/01); đội `ql-phan-mem` chính là người triển khai toàn bộ hệ thống này.

---

## 2. Danh sách FR (5)

| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| IT-INF-01 | Danh mục thiết bị & hạ tầng IT (link VT) | P2 | 1.5/0.5 |
| IT-INF-02 | Giám sát uptime & cảnh báo sự cố (MTTR) | P1 | 2/1 |
| IT-HLP-01 | Helpdesk — tiếp nhận & xử lý sự cố IT | P1 | 1.5/0.5 |
| IT-SEC-01 | Phân quyền tập trung & kiểm soát truy cập | P1 | 1.5/0.5 |
| IT-BAK-01 | Sao lưu tự động & kế hoạch DR | P1 | 2/1 |

---

## 3. Vai trò & phân quyền

| Vai trò (org-key) | Resource | view | create | edit | config | scope |
|-------------------|----------|:--:|:--:|:--:|:--:|------|
| `ql-phan-mem` Tổ Phần mềm/Dữ liệu | IT-SEC, IT-BAK, IT-INF | ✓ | ✓ | ✓ | ✓ | all |
| `ql-ha-tang` Tổ Hạ tầng | IT-INF, IT-HLP, IT-SEC | ✓ | ✓ | ✓ | ✓ | block(IT) |
| **SuperAdmin** | toàn hệ thống + cấu hình RBAC | ✓ | ✓ | ✓ | ✓ | all |
| Mọi NV/bộ phận | IT-HLP-01 (báo sự cố) | ✓(ticket mình) | ✓ | — | — | own |
| TGĐ | IT-INF-02 (báo cáo uptime) | ✓ | — | — | — | all |

**IT-SEC-01 = mặt vận hành của lõi RBAC**: cấp/thu hồi quyền theo chức danh; **NV nghỉ việc thu hồi toàn bộ quyền trong 24h** (trigger từ HR-EMP-05); **2FA bắt buộc admin**; **review quyền mỗi quý** (NFR-SEC-03). Mọi thay đổi quyền ghi `audit_log` (docs/01).

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.IT)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `it_assets` | id, name, category, serial, location, status, warranty_expiry, purchased_at, linked_vt_id | link `VT.assets`; cảnh báo bảo hành 30 ngày |
| `helpdesk_tickets` | id, reporter_id, dept_id, priority, description, attachment, assigned_to, status, opened_at, closed_at | Khẩn 30'/Cao 4h |
| `security_events` | id, type, system, user_id, ip_address, action, timestamp | nhật ký bảo mật |
| `backup_records` | id, type, target, started_at, finished_at, size_mb, status, verified_at | lưu 30 ngày; test khôi phục/quý |

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| CRUD `/it/assets` | IT-INF-01 | tổ hạ tầng |
| GET `/it/uptime` · webhook alert | IT-INF-02 | IT/TGĐ |
| CRUD `/it/tickets` | IT-HLP-01 | mọi NV / IT |
| POST `/it/access/grant` · `/it/access/revoke` | IT-SEC-01 | SuperAdmin/IT |
| GET `/it/backups` · POST `/it/dr/test` | IT-BAK-01 | tổ phần mềm |

---

## 6. Màn hình UI

Inventory thiết bị IT (vòng đời, bảo hành) · **Dashboard uptime** (trạng thái service PMS/ERP/web/email, lịch sử downtime, MTTR) · Helpdesk (tạo/phân công/đóng ticket theo SLA) · Quản lý truy cập tập trung (cấp/thu hồi quyền, danh sách tài khoản hệ thống) · Sao lưu & DR (lịch backup, kết quả test khôi phục).

---

## 7. Luồng nghiệp vụ chính

**Helpdesk**: NV báo sự cố (web/app, mô tả + ảnh + mức ưu tiên) → IT tiếp nhận, phân loại (Khẩn/Cao/Bình thường) → phân công, xử lý theo SLA (Khẩn 30', Cao 4h) → đóng ticket + lưu lịch sử.
**Giám sát**: monitor uptime service cốt lõi → service down >2' → alert email/SMS → ghi downtime/MTTR → báo cáo uptime gửi TGĐ cuối tháng (SLA nội bộ ≥99.5%).
**Phân quyền vòng đời**: NV vào → cấp quyền theo chức danh; NV nghỉ (HR-EMP-05) → thu hồi toàn bộ ≤24h; review quý.
**Backup/DR**: backup tự động hàng ngày → kiểm tra toàn vẹn → test khôi phục thực tế mỗi quý (biên bản); RPO ≤24h, RTO ≤4h cho PMS/ERP.

---

## 8. NFR áp dụng (IT là chủ sở hữu nhiều NFR hệ thống)

AVAIL-01 (uptime ≥99.5%) · AVAIL-02 (maintenance window) · **SEC-02 (2FA), SEC-03 (RBAC), SEC-04 (audit)** · **DATA-03 (backup RPO≤24h/RTO≤4h)** · MNT-01 (log tập trung 90 ngày, alert) · MNT-02 (12-factor) · SCALE-03 (thêm node ≤30').

---

## 9. Tích hợp ngoài

Hệ thống monitoring (uptime/alert email-SMS); cổng/agent backup & DR; quản lý tài khoản tập trung PMS/ERP/email/VPN/NAS; liên kết camera/access control với An ninh (`an-cctv`/`an-the-tu`).

---

## 10. Phụ thuộc module khác

- **→ tất cả module**: phân quyền tập trung (IT-SEC-01 ↔ lõi RBAC docs/01), giám sát uptime, backup/DR.
- **← HR**: thu hồi quyền khi nghỉ việc (IT-SEC-01 ← HR-EMP-05).
- **↔ VT**: thiết bị IT liên kết danh mục tài sản (IT-INF-01 ↔ VT-CAT).
- **↔ OP/An ninh**: camera, access control, sự cố hạ tầng (`an-cctv`, `an-ky-thuat`).

---

## 11. Ước lượng & Definition of Done

**Tổng: 8.5 MD dev / 3.5 MD test.** Trọng tâm P1: IT-INF-02, IT-HLP-01, IT-SEC-01, IT-BAK-01.

**DoD (P1)**: helpdesk vận hành theo SLA; dashboard uptime + alert khi service down; phân quyền tập trung cấp/thu hồi + thu hồi tự động khi NV nghỉ + 2FA admin; backup hàng ngày + test khôi phục đạt RPO/RTO; audit + log tập trung chạy. **IT-SEC-01 triển khai cùng Pha 0 (lõi RBAC).**
