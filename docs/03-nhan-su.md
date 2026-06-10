# 03 — Module Nhân sự (HR) · Prototype

> Mã module: **HR** · 39 FR · Nest module `hr` · Ước lượng **52.5 MD dev / 21.5 MD test**.
> Nền: [00](00-kien-truc-tong-the.md) · Phân quyền: [01](01-phan-quyen-rbac.md) — HR là **lát cắt mẫu giàu phân quyền nhất** (own-data lương/chấm công + SoD duyệt lương).

---

## 1. Mục tiêu & phạm vi

Quản trị toàn vòng đời nhân sự cho KDL vận hành **24/7**: hồ sơ, hợp đồng, **ca kíp & chấm công**, phép, **lương & phụ cấp ca đêm**, KPI, đào tạo, khen thưởng/kỷ luật, và **cộng tác viên (CTV) thời vụ**. HR cũng là nguồn dữ liệu cho phân quyền lõi (employee → user) và cho thuế TNCN/BHXH bên FM.

**Đặc thù**: phụ cấp ca đêm, tăng ca cuối tuần ×1.5/lễ ×2; CTV không BHXH; mùa lễ T4–9 bùng nhân sự thời vụ.

---

## 2. Danh sách FR (39)

**1. Hồ sơ NV** (HR-EMP) *dev 6.5/test 3* · **2. Ca kíp & Chấm công** (HR-ATT) *10/4*
| Mã | Tên | P | Dev/Test |
|----|-----|:-:|:-:|
| HR-EMP-01 | Quản lý hồ sơ NV (CCCD unique) | P1 | 2/1 |
| HR-EMP-02 | Phân loại theo bộ phận | P1 | 1/0.5 |
| HR-EMP-03 | Hợp đồng lao động (cảnh báo hết hạn) | P1 | 1.5/0.5 |
| HR-EMP-04 | Tài liệu đính kèm | P2 | 1/0.5 |
| HR-EMP-05 | Lịch sử nghỉ việc/tái nhận | P2 | 1/0.5 |
| HR-ATT-01 | Quản lý ca (sáng/chiều/đêm/HC) | P1 | 1.5/0.5 |
| HR-ATT-02 | Xếp ca & phân công tuần | P1 | 2/1 |
| HR-ATT-03 | Chấm công thủ công (import Excel) | P1 | 2/1 |
| HR-ATT-04 | Tính giờ làm/tăng ca tự động | P1 | 2/0.5 |
| HR-ATT-05 | Chấm công NV thời vụ | P2 | 1/0.5 |
| HR-ATT-06 | Báo cáo chấm công tháng | P1 | 1.5/0.5 |

**3. Phép** (HR-LEA) *4/1.5* · **4. Lương** (HR-SAL) *7.5/3* — **SoD**
| HR-LEA-01 | Đăng ký nghỉ phép | P1 | 1.5/0.5 |
| HR-LEA-02 | Duyệt nghỉ phép (cảnh báo thiếu ca) | P1 | 1.5/0.5 |
| HR-LEA-03 | Theo dõi ngày phép còn lại | P1 | 1/0.5 |
| HR-SAL-01 | Cấu hình lương cơ bản & phụ cấp | P1 | 1.5/0.5 |
| HR-SAL-02 | Tính lương tự động (lock kỳ) | P1 | 2/1 |
| HR-SAL-03 | Các khoản trừ (BHXH/TNCN/phạt) | P1 | 1.5/0.5 |
| HR-SAL-04 | Phiếu lương cá nhân (ký ĐT) | P2 | 1/0.5 |
| HR-SAL-05 | Báo cáo quỹ lương (KT/GĐ) | P1 | 1.5/0.5 |

**5. KPI** (HR-KPI) *4/1.5* · **6. Quản trị** (HR-ADM) *3.5/1.5* — **RBAC + Audit**
| HR-KPI-01 | Định nghĩa KPI theo bộ phận | P2 | 1.5/0.5 |
| HR-KPI-02 | Nhập kết quả KPI (link booking) | P2 | 1.5/0.5 |
| HR-KPI-03 | Báo cáo đánh giá NV | P2 | 1/0.5 |
| HR-ADM-01 | **Phân quyền RBAC** | P1 | 1/0.5 |
| HR-ADM-02 | Dashboard NS tổng quát | P1 | 1.5/0.5 |
| HR-ADM-03 | **Nhật ký kiểm toán (audit log)** | P1 | 1/0.5 |

**7. Đào tạo** (HR-TRAIN) *6.5/2.5* · **8. Khen thưởng/Kỷ luật** (HR-DIS) *4.5/2* · **9. CTV** (HR-CTV) *6.5/2.5*
| HR-TRAIN-01..05 | Kế hoạch / khóa / đăng ký / chứng chỉ / báo cáo đào tạo | P2–P3 | 1.5,1.5,1,1.5,1 / 0.5 mỗi |
| HR-DIS-01 | Khen thưởng | P2 | 1/0.5 |
| HR-DIS-02 | Biên bản kỷ luật (sa thải: TGĐ ký) | P1 | 1.5/0.5 |
| HR-DIS-03 | Lịch sử khen/kỷ | P2 | 1/0.5 |
| HR-DIS-04 | Khiếu nại nội bộ (bảo mật) | P3 | 1/0.5 |
| HR-CTV-01 | Hồ sơ CTV (không BHXH) | P2 | 1.5/0.5 |
| HR-CTV-02 | Lịch & phân công CTV (SMS) | P2 | 1.5/0.5 |
| HR-CTV-03 | Thanh toán thù lao CTV (TNCN 10%) | P2 | 1.5/0.5 |
| HR-CTV-04 | Đánh giá chất lượng CTV | P3 | 1/0.5 |
| HR-CTV-05 | Báo cáo CTV theo mùa/quý | P3 | 1/0.5 |

---

## 3. Vai trò & phân quyền (trọng tâm module)

| Vai trò (org-key) | Resource | view | create | edit | approve | scope |
|-------------------|----------|:--:|:--:|:--:|:--:|------|
| Nhân viên (mọi NV) | ca của mình, phiếu lương của mình, đăng ký phép | ✓ | ✓(phép) | — | — | **own** |
| Tổ trưởng/QL bộ phận | chấm công, KPI, duyệt phép **tổ mình** | ✓ | ✓ | ✓ | ✓(phép) | **team** |
| `ql-tuyen-dung` Tuyển dụng | HR-EMP, HR-ADM | ✓ | ✓ | ✓ | — | block(HR) |
| `ql-luong-bhxh` Tổ Lương | HR-SAL, HR-ATT, FM-TAX | ✓ | ✓(maker) | ✓ | — | block(HR) |
| `ql-dao-tao` Đào tạo | HR-TRAIN, HR-DIS | ✓ | ✓ | ✓ | — | block(HR) |
| Kế toán trưởng | HR-SAL-02/05 | ✓ | — | — | **✓(checker)** | block |
| Phó TGĐ NS&HT / TGĐ | toàn HR | ✓ | ✓ | ✓ | ✓ | all |

**Luật cốt lõi (HR-ADM-01)**: *"NV không được xem lương NV khác cùng cấp"* → data-scope **own** cứng cho phiếu lương; quỹ lương (HR-SAL-05) chỉ kế toán & GĐ. **SoD lương (HR-SAL-02)**: Tổ Lương lập (maker) ≠ KTT ký duyệt (checker). **Audit (HR-ADM-03)**: mọi sửa hồ sơ/chấm công/duyệt phép ghi before-after.

---

## 4. Mô hình dữ liệu (SCHEMA_DATA.HR)

| Entity | Cột chính | Ghi chú |
|--------|-----------|---------|
| `employees` | id, code, full_name, cccd(unique), dob, gender, phone, email, avatar, dept_id, pos_id, contract_type, hire_date, status, deleted_at | tuổi 18–60; status: Đang làm/Nghỉ/Tạm nghỉ/Theo mùa |
| `departments` | id, name, khoi, manager_id | khớp org-chart |
| `positions` | id, name, dept_id, salary_base, allowances_json | lương theo chức danh |
| `attendances` | id, emp_id, date, shift, check_in, check_out, overtime_h, late_min, note, approved_by | gắn `shift`; sửa cần lý do+duyệt |
| `leaves` | id, emp_id, type, start_date, end_date, reason, status, approved_by, approved_at | năm/bệnh/không lương |
| `salaries` | id, emp_id, period, base, allowances, overtime_pay, deductions, net `DECIMAL(18,4)`, status, issued_at | lock kỳ trước ngày 5 |
| `kpis` | id, emp_id, period, metric, target, actual, score, reviewed_by | link số liệu booking |
| `collaborators` | id, full_name, cccd, specialty, phone, email, rate, status | CTV — không BHXH |

---

## 5. API chính (đề xuất)

| Method · Path | FR | Quyền |
|---------------|-----|-------|
| CRUD `/employees` | HR-EMP-01..05 | tuyển dụng |
| GET `/me/attendances` · `/me/salary/:period` | HR-ATT/SAL | NV (own) |
| POST `/attendances/import` | HR-ATT-03 | tổ trưởng |
| POST `/shifts/assign` | HR-ATT-02 | tổ trưởng |
| POST `/leaves` · POST `/leaves/:id/approve` | HR-LEA-01/02 | NV / QL bộ phận |
| POST `/payroll/run?period=` (maker) | HR-SAL-02 | Tổ Lương |
| POST `/payroll/:period/approve` (checker) | HR-SAL-02 | KTT |
| GET `/reports/payroll` | HR-SAL-05 | KT/GĐ |
| CRUD `/collaborators` · POST `/collaborators/payout` | HR-CTV | đào tạo/CTV |

---

## 6. Màn hình UI

Hồ sơ NV (hợp đồng, tài liệu, cảnh báo hết hạn) · **Lịch ca** tuần theo bộ phận · Chấm công + import Excel · **Self-service NV**: ca của tôi, phiếu lương, đăng ký phép, số ngày phép còn lại · Duyệt phép (QL) · **Bảng lương** + lock kỳ + ký duyệt · Dashboard NS (đang làm/vắng/hợp đồng sắp hết/quỹ lương) · Đào tạo & chứng chỉ · Khen thưởng/kỷ luật · Quản lý CTV + phân công + thù lао.

---

## 7. Luồng nghiệp vụ chính

**Chấm công → lương**: xếp ca tuần (HR-ATT-02) → chấm công/import (03) → tự tính giờ + tăng ca (04, cuối tuần ×1.5/lễ ×2) → cuối kỳ Tổ Lương chạy `payroll/run` (maker) → áp khoản trừ BHXH 8%/BHYT 1.5%/TNCN lũy tiến (SAL-03) → KTT ký duyệt (checker) → lock kỳ → phát phiếu lương ký điện tử (SAL-04).
**Phép**: NV đăng ký (LEA-01) → hệ cảnh báo nếu ca <2 NV → QL bộ phận duyệt 24h (LEA-02) → trừ quỹ phép (LEA-03).
**CTV mùa vụ**: tạo hồ sơ (CTV-01) → phân công sự kiện + xác nhận SMS (CTV-02) → tổng hợp thù lao, khấu trừ TNCN 10% nếu >2tr/lần (CTV-03) → liên kết NT-CON/FM.

---

## 8. NFR áp dụng

SEC-01 (mã hóa CCCD/lương AES-256) · SEC-02 (2FA cho HR) · SEC-03 (RBAC) · SEC-04 (audit 100%) · DATA-02 (DECIMAL lương) · DATA-04 (soft-delete) · PERF-04 (batch lương đêm ≤5') · INT-03 (SMS xác nhận CTV).

---

## 9. Tích hợp ngoài

- **SMS/Zalo** (INT-03): xác nhận lịch CTV, nhắc hợp đồng sắp hết hạn.
- Xuất dữ liệu sang **FM**: TNCN (FM-TAX-02), BHXH (FM-TAX-03), quỹ lương (chi phí).
- Export Excel báo cáo chấm công/đào tạo; HTKK gián tiếp qua FM.

---

## 10. Phụ thuộc module khác

- **→ core/RBAC**: employee → user; trạng thái nghỉ việc (HR-EMP-05) trigger thu hồi quyền (IT-SEC-01 / docs/01).
- **→ FM**: lương → thuế TNCN/BHXH (HR-SAL ↔ FM-TAX), thù lao CTV → chi phí.
- **← BK/OP**: KPI lễ tân/buồng phòng lấy số review & số phòng (HR-KPI-02 ← BK-REV, OP-ROOM-03).
- **↔ NT**: CTV nghệ nhân dùng chung `collaborators` (HR-CTV ↔ NT-CON).

---

## 11. Ước lượng & Definition of Done

**Tổng: 52.5 MD dev / 21.5 MD test.** Trọng tâm P1: EMP-01/02/03, toàn ATT, LEA, SAL, ADM-01/02/03, DIS-02.

**DoD (P1)**: tạo hồ sơ NV → xếp ca → chấm công → chạy lương (maker) → KTT duyệt (checker) → phát phiếu lương (NV chỉ thấy của mình) end-to-end; data-scope own/team/block thực thi đúng (NV không xem được lương người khác); audit log đầy đủ; cảnh báo hợp đồng hết hạn 30 ngày; batch lương đạt PERF-04.
