# 01 — Phân quyền: RBAC phân cấp + ABAC + SoD (Prototype lõi)

> Đây là **prototype quan trọng nhất**: lõi xác thực & phân quyền mà 9 module đều cắm vào. Triển khai trước tiên (Pha 0).
> Insight nền: **org-chart (`TO_DATA`) + `FR_MAP` (tổ → FR) đã là ma trận `vai trò × quyền` ở dạng thô.** Việc của lõi này là vật chất hóa nó.

---

## 1. Mô hình: hybrid RBAC + ABAC

Hệ thống KDL có 90 tổ, 24/7, CTV thời vụ, 9 module → **RBAC làm xương sống, ABAC cho ngữ cảnh, SoD cho kiểm soát nội bộ**. Không dùng RBAC thuần (thiếu ràng buộc dữ liệu), không ABAC thuần (khó audit, stakeholder khó hiểu).

### 4 trụ cột

1. **Vai trò phân cấp (Hierarchical RBAC)** — ánh xạ 1-1 từ org-chart.
2. **Quyền hạt mịn (Permission)** = `action × resource(module/FR)`.
3. **Phạm vi dữ liệu (Data Scope — ABAC)** = cùng quyền nhưng thấy bao nhiêu: `own / team / block / all` + ràng buộc ca/khu vực.
4. **Tách biệt trách nhiệm (SoD) & Maker-Checker** — người tạo ≠ người duyệt (FM, HR-SAL, VT-PRO).

---

## 2. Cây vai trò (ánh xạ từ org-chart)

```
SuperAdmin (IT — ql-phan-mem/ql-ha-tang)        scope: all (cấu hình hệ thống)
HĐQT                                            scope: all (CHỈ ĐỌC)
└─ Tổng Giám đốc (TGĐ)                           scope: all
   ├─ Phó TGĐ Nhân sự & Hỗ trợ                   scope: block {HR, FM, IT, Pháp chế}
   ├─ Phó TGĐ Kinh doanh                         scope: block {BK, Marketing, CRM}
   └─ Phó TGĐ Vận hành                           scope: block {Lưu trú, F&B, VG, SP, An ninh}
      └─ Trưởng khối / Trưởng phòng              scope: block (khối mình)
         └─ Tổ trưởng (.lvl-to)                  scope: team (tổ mình)
            ├─ Tổ phó                            scope: team (uỷ quyền khi tổ trưởng vắng)
            └─ Nhân viên                         scope: own (bản ghi của mình)
CTV / Nghệ nhân (khối Cộng tác viên)            scope: own + valid_to (auto-expire)
```

**Kế thừa**: vai trò cha có toàn bộ quyền của vai trò con **trong phạm vi của mình**. VD Phó TGĐ Vận hành thấy mọi FR của Lưu trú + F&B + VG + SP + An ninh; Tổ trưởng Lễ tân (`lt-reception`) chỉ thấy FR của tổ mình (`OP-CHK/OP-SVC/OP-ROOM`).

---

## 3. Quyền = action × resource

- **resource** = module hoặc FR sub-prefix (đã có sẵn 179 FR + sub-prefix).
- **action** ∈ `view · create · edit · delete · approve · export · config`.

> `FR_MAP[tổ]` = danh sách sub-prefix FR mà tổ đó phụ trách = **quyền mặc định** của tổ. Chỉ cần ghép chiều `action` là thành ma trận đầy đủ.

Ví dụ trích `FR_MAP`:
```
'lt-reception' : ['OP-CHK','OP-SVC','OP-ROOM']   → Lễ tân thao tác trên 3 nhóm FR này
'ql-luong-bhxh': ['HR-SAL','HR-ATT','FM-TAX']    → Tổ Lương thao tác lương/chấm công/thuế
'ql-ngan-quy'  : ['FM-REV','FM-EXP','FM-ACC']    → Ngân quỹ: thu/chi/kế toán
```

---

## 4. Lược đồ DB phân quyền (8 bảng lõi)

```
users
  id, employee_id?, username, password_hash, status,
  mfa_enabled, last_login_at, created_at, deleted_at
  (employee_id → HR.employees; tài khoản khách dùng BK.users riêng)

roles                         -- vai trò, gắn với 1 tổ trong org-chart
  id, code, name, org_key?, parent_id?, level, is_system
  (org_key = key trong TO_DATA, vd 'lt-reception'; parent_id = vai trò cha → kế thừa)

permissions                   -- action × resource
  id, action, resource        -- vd ('approve','FM-EXP'), ('view','OP-ROOM')

role_permission               -- ma trận N-N
  role_id, permission_id

user_role                     -- gán vai trò cho user + phạm vi + thời hạn
  id, user_id, role_id, scope, scope_ref?, valid_from, valid_to?
  (scope ∈ own|team|block|all; valid_to cho CTV/thời vụ/uỷ quyền)

data_scope_rules              -- ABAC: ràng buộc bổ sung
  id, role_id, resource, condition_json
  (vd {field:'shift', op:'=', value:'$user.shift'} — chỉ thấy dữ liệu ca mình)

approval_flow / approval_step -- Maker-Checker (xem mục 6)
  flow: id, resource, name
  step: id, flow_id, order, approver_role_id, threshold_min?, threshold_max?

audit_log                     -- NFR-SEC-04: 100% write ops
  id, user_id, action, resource, record_id, before_json, after_json, ip, created_at
```

Soft-delete (`deleted_at`) áp cho `users`, `roles`. `audit_log` **append-only**, không sửa/xóa.

---

## 5. Seed roles/permissions tự động từ org-chart

Thay vì gõ tay ma trận, **sinh seed từ dữ liệu đã có** (`TO_DATA`, `FR_MAP`, `REQS_DATA`):

```
Với mỗi tổ key ∈ TO_DATA:
  tạo role(code=key, name=TO_DATA[key].name, org_key=key)
  subs   = FR_MAP[key]                       // ['OP-CHK','OP-SVC',...]
  với mỗi sub ∈ subs:
    với mỗi action ∈ defaultActions(sub):    // xem bảng dưới
      permission = upsert(action, sub)
      role_permission += (role, permission)

  // gán scope mặc định theo cấp:
  Tổ trưởng → user_role.scope = 'team'
  Nhân viên → 'own'   (trừ nghiệp vụ chung của tổ)
  Phó TGĐ   → 'block' (gộp module của các tổ trực thuộc)
  TGĐ/HĐQT  → 'all'   (HĐQT chỉ action 'view')
```

`defaultActions(sub)` — heuristic theo loại sub-prefix, **review thủ công sau khi sinh**:
| Loại sub-prefix | Action mặc định |
|-----------------|-----------------|
| `*-RPT`, `*-ADM` dashboard | `view, export` |
| `*-SAL`, `*-EXP`, `*-BUD`, `*-PRO` (tiền) | `view, create` (KHÔNG có `approve` — tách cho cấp duyệt) |
| nghiệp vụ tác nghiệp (`OP-*`, `BK-ORD`…) | `view, create, edit` |
| cấu hình (`*-CAT`, CMS) | `view, create, edit, delete` |

→ Lần đầu sinh ra ~90 role + vài trăm permission khớp đúng cơ cấu; đội triển khai chỉ tinh chỉnh ngoại lệ.

---

## 6. Tách biệt trách nhiệm & Maker-Checker (SoD)

**Bắt buộc** cho luồng tiền & nhân sự nhạy cảm. Người **tạo** ≠ người **duyệt**.

| Luồng | Maker | Checker | Ngưỡng |
|-------|-------|---------|--------|
| Chi phí (FM-EXP-01/02) | NV phòng ban | Kế toán → KTT → TGĐ | >5tr: KTT · >20tr: TGĐ |
| Lương (HR-SAL-02) | Tổ Lương | Kế toán trưởng ký | toàn bộ kỳ lương |
| Ngân sách (FM-BUD-01) | P. Tài chính | TGĐ phê duyệt | toàn bộ |
| Mua sắm (VT-PRO) | Phòng yêu cầu | Trưởng phòng → (đấu thầu) | >20tr: 3 báo giá · >200tr: đấu thầu |
| Kỷ luật sa thải (HR-DIS-02) | HR | TGĐ ký | sa thải |
| Nhập kho (VT-IMP-02) | Thủ kho | QL kho/Kế toán | toàn bộ |

Engine: `approval_flow` định nghĩa các bước theo `threshold`; bản ghi vào trạng thái `pending` → chạy tuần tự `approval_step`; **timeout 48h tự escalate** (FM-EXP-02). Mọi bước ghi `audit_log`.

---

## 7. Các cơ chế doanh nghiệp bắt buộc

- **Least privilege**: user mới = 0 quyền, phải gán vai trò.
- **2FA** (NFR-SEC-02): bắt buộc vai trò admin & nhạy cảm (FM, HR, IT); khuyến nghị NV.
- **Uỷ quyền (delegation)**: tổ trưởng vắng ca → cấp `user_role` tạm cho tổ phó với `valid_to` = hết ca. Thực tế 24/7.
- **CTV/thời vụ auto-expire**: `user_role.valid_to` theo hợp đồng; job đêm vô hiệu hóa khi hết hạn (mùa lễ T4–9).
- **Thu hồi khi nghỉ việc** (IT-SEC-01): NV nghỉ → thu hồi toàn bộ quyền trong 24h; trigger từ HR-EMP-05 (đổi trạng thái → vô hiệu `users`).
- **Review định kỳ** (NFR-SEC-03): rà soát ma trận quyền mỗi quý.

---

## 8. Triển khai trong NestJS (CASL)

- `CaslAbilityFactory` dựng `ability` từ `user_role` + `role_permission` + `data_scope_rules` mỗi request (cache theo phiên).
- `@CheckPolicies(ability => ability.can('approve','FM-EXP'))` trên controller.
- `PoliciesGuard` chặn ở tầng route; data-scope áp ở tầng service qua Prisma `where` (vd tự chèn `{ shift: user.shift }`, `{ dept_id: user.dept_id }`, `{ created_by: user.id }` theo scope).
- `AuditInterceptor` ghi `audit_log` cho mọi mutation.

---

## 9. Ma trận mẫu (3 tổ điển hình)

**`lt-reception` — Tổ Lễ tân chính** (scope team, ca 24/7):
| Resource | view | create | edit | approve | export |
|----------|:--:|:--:|:--:|:--:|:--:|
| OP-CHK (check-in/out) | ✓ | ✓ | ✓ | — | — |
| OP-SVC (yêu cầu khách) | ✓ | ✓ | ✓ | — | — |
| OP-ROOM (trạng thái phòng) | ✓ | — | ✓ | — | — |

**`ql-ngan-quy` — Tổ Ngân quỹ** (scope team, SoD áp dụng):
| Resource | view | create | edit | approve | export |
|----------|:--:|:--:|:--:|:--:|:--:|
| FM-REV (thu/doanh thu) | ✓ | ✓ | ✓ | — | ✓ |
| FM-EXP (chi) | ✓ | ✓ | — | — | ✓ |
| FM-ACC (kế toán) | ✓ | ✓ | ✓ | — | ✓ |
→ `approve` FM-EXP thuộc về KTT/TGĐ, **không** thuộc tổ tạo phiếu (SoD).

**`ctv-hat-vi-dam` — Nghệ nhân Ví Dặm** (scope own, `valid_to` theo hợp đồng):
| Resource | view | create | edit |
|----------|:--:|:--:|:--:|
| NT-SCH (lịch diễn của mình) | ✓ | — | — |
| HR-CTV (hồ sơ/thù lao của mình) | ✓ (own) | — | — |
→ chỉ xem lịch & thù lао **của chính mình**; tài khoản tự khóa khi hết hạn hợp đồng.

---

## 10. Liên hệ

- Nền kỹ thuật: [00-kien-truc-tong-the.md](00-kien-truc-tong-the.md)
- FR gốc: HR-ADM-01 (RBAC), HR-ADM-03 (audit log), IT-SEC-01 (phân quyền tập trung).
- NFR: SEC-02 (2FA), SEC-03 (RBAC), SEC-04 (audit).
- Module áp SoD nặng nhất: [04-tai-chinh.md](04-tai-chinh.md), [03-nhan-su.md](03-nhan-su.md), [05-vat-tu.md](05-vat-tu.md).
