# CLAUDE.md — KDL Hà Tĩnh

> Tài liệu định hướng cho Claude Code. Đọc file này trước khi chỉnh sửa bất kỳ thứ gì.
> Ngôn ngữ dự án: **Tiếng Việt** (UI, dữ liệu, mã chức năng, comment đều bằng tiếng Việt). Giữ nguyên tiếng Việt khi sửa/bổ sung nội dung.

## 1. Dự án là gì

Bộ tài liệu **đặc tả & trực quan hóa** cho hệ thống phần mềm quản trị một **Khu Du Lịch (KDL) nghỉ dưỡng tại Hà Tĩnh** (resort: lưu trú + F&B + spa + vui chơi giải trí + nghệ thuật dân gian Ví Dặm). Đây **chưa phải là codebase ứng dụng** — chưa có backend/frontend thật. Hiện tại repo gồm:

1. **`KDL_Requirements_Full.csv`** — nguồn chân lý (source of truth) cho **toàn bộ yêu cầu chức năng (FR)**.
2. **`charts_html/index.html`** (+ `charts_html/data/*.js`) — slide deck HTML tĩnh, trực quan hóa **sơ đồ cơ cấu tổ chức** của KDL và liên kết từng bộ phận tới đặc tả phần mềm (FR/NFR/Schema). Host tĩnh trên Vercel.

Mục tiêu của bộ tài liệu: làm cầu nối giữa **cơ cấu tổ chức nhân sự** (ai làm gì) và **yêu cầu phần mềm** (FR / NFR / schema DB) để phục vụ ước lượng, lập kế hoạch phát triển và trao đổi với stakeholder.

## 2. Cấu trúc thư mục

```
KDL_HaTinh/
├── CLAUDE.md                     # file này
├── KDL_Requirements_Full.csv     # 179 yêu cầu chức năng (FR) — NGUỒN CHÂN LÝ
├── docs/                         # 13 bản prototype + kế hoạch handover (xem mục 8)
│   ├── README.md                 #   mục lục + cách đọc
│   ├── 00-kien-truc-tong-the.md  #   nền: stack, modular monolith, NFR
│   ├── 01-phan-quyen-rbac.md     #   LÕI phân quyền RBAC+ABAC+SoD
│   ├── 02..10-*.md               #   9 blueprint module (BK/HR/FM/VT/OP/SP/VG/NT/IT)
│   └── 99-handover-plan.md       #   lộ trình phân pha + ước lượng + rủi ro
└── charts_html/                  # thư mục deploy Vercel — entry: index.html
    ├── index.html                # shell: CSS + markup 9 slide + logic render (~1045 dòng)
    └── data/                     # dữ liệu thuần, tách khỏi HTML để tối ưu token ngữ cảnh
        ├── org-data.js           #   const SLIDES (9 slide) + const TO_DATA (90 tổ/bộ phận)
        ├── reqs-data.js          #   const REQS_DATA (179 FR — bản ánh xạ của CSV)
        └── mapping-data.js       #   const FR_MAP + NFR_DATA + SCHEMA_DATA
```

Không có build system, không `package.json`, không dependency. `index.html` nạp 3 file `data/*.js` qua `<script src>` (xem mục 5) — chạy được cả khi mở local (`file://`) lẫn host tĩnh trên Vercel. Để xem: mở `index.html` trong trình duyệt.

> **Lịch sử**: trước đây có `index.html` (org-chart thuần, v1) và `index_v2.html` (thêm tab FR/NFR/Schema). v2 đã được tách dữ liệu ra `data/` rồi thay thế hẳn `index.html`; bản v1 cũ còn truy được trong git (commit `e2544c0`).

## 3. `KDL_Requirements_Full.csv` — nguồn chân lý

CSV, header: `Module, Mã CN, Tên chức năng, Mô tả chi tiết, Business Rules / Validation, Man-Day Dev, Man-Day Test, Độ ưu tiên`.

- **179 dòng yêu cầu chức năng** (FR), mỗi dòng một mã chức năng duy nhất.
- **Quy ước mã chức năng**: `<MODULE>-<SUB>-<NN>`, ví dụ `BK-AUTH-01`, `HR-SAL-02`, `OP-ROOM-03`.
- **Độ ưu tiên**: `P1` (bắt buộc/cốt lõi) › `P2` › `P3`.
- **Man-Day Dev / Test**: ước lượng công sức (đơn vị ngày-người) — dùng để tính tổng effort.

### 9 module và mã prefix

| Mã | Module | Số FR | Phạm vi |
|----|--------|------|---------|
| `BK` | Web Booking | 35 | Đặt phòng/vé/dịch vụ online: xác thực, tìm kiếm, đặt, thanh toán, quản lý đơn, review, thông báo, admin booking |
| `HR` | Nhân sự | 39 | Hồ sơ NV, ca kíp & chấm công, phép, lương, KPI, đào tạo, khen thưởng/kỷ luật, cộng tác viên (CTV) |
| `FM` | Tài chính | 26 | Ngân sách, thu/doanh thu, chi phí, kế toán tổng hợp, thuế & pháp lý, báo cáo tài chính |
| `VT` | Vật tư & Thiết bị | 24 | Danh mục tài sản, nhập/xuất kho, tồn kho, bảo trì thiết bị, mua sắm & đấu thầu |
| `OP` | Vận hành | 36 | Buồng phòng, F&B/nhà hàng, check-in/out, yêu cầu & phàn nàn khách, kỹ thuật, an ninh, báo cáo vận hành |
| `SP` | Spa & Wellness | 6 | Đặt lịch spa, dịch vụ & giá, báo cáo |
| `VG` | Vui chơi & Giải trí | 4 | Vé & kiểm soát lượt khách, checklist an toàn thiết bị, báo cáo |
| `NT` | Nghệ thuật Dân gian | 4 | Lịch biểu diễn (Ví Dặm), hợp đồng & thù lao nghệ nhân CTV, báo cáo — **đặc thù văn hóa Hà Tĩnh** |
| `IT` | Công nghệ thông tin | 5 | Hạ tầng & giám sát uptime, helpdesk, bảo mật/phân quyền, sao lưu & DR |

> Các sub-prefix (ví dụ `BK-AUTH`, `HR-SAL`, `OP-FNB`...) gom nhóm chức năng trong một module. Đây là khóa liên kết quan trọng giữa CSV và org chart (xem `FR_MAP` ở mục 5).

**Khi cập nhật yêu cầu**: CSV là nơi sửa đầu tiên. Sau đó đồng bộ sang `REQS_DATA` trong `charts_html/data/reqs-data.js` (xem mục 5). Hai nguồn này phải khớp nhau.

## 4. `index.html` — công cụ org-chart + đặc tả phần mềm

**Slide deck một trang** kiểu org-chart, ngôn ngữ Việt: 9 slide (`slide-0` … `slide-8`), CSS sơ đồ cây tổ chức, điều hướng (sidebar + phím mũi tên + zoom + in).

**9 slide = cấu trúc tổ chức KDL:**
- Slide 0: **Tổng quan** — `HĐQT → Tổng GĐ → 3 Phó TGĐ → 8 Khối chức năng`
- Slide 1–8: 8 khối — Quản lý & Điều hành · Kinh doanh & Marketing · Lưu trú · Ẩm thực (F&B) · Vui chơi & Giải trí · Spa & Wellness · An ninh – Trật tự · Cộng tác viên.

3 Phó TGĐ: **Nhân sự & Hỗ trợ**, **Kinh doanh**, **Vận hành**.

### Panel chi tiết 4 tab (tính năng cốt lõi)

Click vào một **Tổ** (`.lvl-to`) trên sơ đồ → mở panel bên phải có **4 tab**, biến org chart thành công cụ tra cứu đặc tả phần mềm theo từng bộ phận:

| Tab | Nội dung | Nguồn dữ liệu (JS) |
|-----|----------|--------------------|
| 👥 **Nhân sự** | Tổ trưởng/phó, ca, vai trò, sĩ số | `TO_DATA` |
| 📋 **FR** | Các yêu cầu chức năng mà bộ phận này phụ trách, gom theo sub-prefix, kèm mô tả + business rules + badge P1/P2/P3 | `REQS_DATA` lọc qua `FR_MAP` |
| ⚙️ **NFR** | Yêu cầu phi chức năng liên quan (hiệu năng, bảo mật, khả dụng, mở rộng, dữ liệu, UX, tích hợp, vận hành) | `NFR_DATA` |
| 🗄️ **Schema** | Các bảng DB của module liên quan + cột | `SCHEMA_DATA` |

## 5. Mô hình dữ liệu JS (`charts_html/data/*.js`)

**Dữ liệu tách khỏi HTML, nạp qua `<script src>` ngay trước `<script>` logic** trong `index.html`. Các `<script>` cổ điển dùng chung **global lexical scope**, nên `const` khai báo trong file dữ liệu hiển thị cho script logic — không cần `window.`/`export`.

> ⚠️ **Thứ tự nạp bắt buộc**: 3 file `data/*.js` phải đứng TRƯỚC `<script>` logic, vì IIFE `init()` chạy ngay khi parse và dùng `SLIDES`. Đừng đảo thứ tự hay thêm `defer`/`type=module`.

Các cấu trúc dữ liệu chính:

- **`SLIDES`** (`data/org-data.js`): mảng metadata 9 slide (nav, icon, title, sub).
- **`TO_DATA`** (`data/org-data.js`): từ điển `key → {name, parent, color, leader, deputy, ca, roles[], total, note}` cho mỗi **Tổ/bộ phận** click được (90 tổ). Key ví dụ: `ql-ke-toan-th`, `lt-reception`, `fb-bep-nong`, `vg-hat-vi-dam`, `ctv-hat-vi-dam`...
- **`REQS_DATA`** (`data/reqs-data.js`): từ điển `mã FR → {module, sub, name, desc, rules, devMD, testMD, priority}` (179 FR). **Đây là bản sao của CSV ở dạng JS** — phải giữ đồng bộ với `KDL_Requirements_Full.csv`.
- **`FR_MAP`** (`data/mapping-data.js`): **bảng ánh xạ** `key tổ (TO_DATA) → [danh sách sub-prefix FR]` (90 mục, mỗi tổ một mục). Liên kết giữa **bộ phận nhân sự** và **chức năng phần mềm** họ phụ trách. Ví dụ `'lt-reception':['OP-CHK','OP-SVC','OP-ROOM']`.
- **`NFR_DATA`** (`data/mapping-data.js`): mảng 27 NFR `{code, cat, name, target, modules[]}`. `cat` ∈ `PERF/SEC/AVAIL/SCALE/DATA/UX/INT/MNT`. NFR hiển thị nếu `modules` chứa `'ALL'` hoặc giao với module của bộ phận.
- **`SCHEMA_DATA`** (`data/mapping-data.js`): từ điển `module → [{entity, cols[]}]` — phác thảo schema DB cho 9 module.

> Logic render (`showTo`, `renderFR/NFR/Schema`, nav, zoom) vẫn nằm trong `<script>` của `index.html`. Khi cần đọc dữ liệu, mở thẳng file `data/*.js` tương ứng thay vì cả `index.html`.

### Cách panel ráp dữ liệu lại (quan trọng khi sửa)

`showTo(key)` được gọi khi click một Tổ → đọc `TO_DATA[key]` cho tab Nhân sự, rồi gọi:
- `renderFR(key)`: lấy `FR_MAP[key]` → lọc `REQS_DATA` theo các sub-prefix đó.
- `renderNFR(key)`: từ `FR_MAP[key]` rút ra module gốc (2 ký tự đầu) → lọc `NFR_DATA`.
- `renderSchema(key)`: từ module gốc → lấy `SCHEMA_DATA[module]`.

→ **Muốn một bộ phận hiển thị đúng FR/NFR/Schema, mắt xích quyết định là `FR_MAP`.** Thêm Tổ mới: phải thêm vào cả `TO_DATA`, gắn `onclick="showTo('key')"` trong HTML slide, và thêm mapping vào `FR_MAP`.

## 6. Quy ước khi chỉnh sửa

- **Không thêm framework/build tool.** Giữ kiến trúc thuần: `index.html` (CSS + logic inline) + `data/*.js` (dữ liệu, nạp qua `<script src>`). Không thêm dependency ngoài, không bundler.
- **Tiếng Việt** cho mọi nội dung hiển thị, tên chức năng, comment dữ liệu.
- **Đồng bộ CSV ↔ `REQS_DATA`** (`data/reqs-data.js`): khi đổi yêu cầu, sửa cả hai; giữ mã FR, độ ưu tiên, man-day khớp nhau.
- **Thêm một Tổ mới** phải đụng 3 chỗ: thêm vào `TO_DATA` (`data/org-data.js`), gắn `onclick="showTo('key')"` vào markup slide trong `index.html`, và thêm mapping vào `FR_MAP` (`data/mapping-data.js`).
- **Mã FR bất biến**: không đổi mã chức năng đã có (chúng được tham chiếu chéo, ví dụ `VG-OPS-01` nhắc tới `BK-CAT-04/05`). Thêm mới thì cấp số `-NN` kế tiếp trong sub-prefix.
- **Style theo block sẵn có**: CSS chia khối rõ ràng (SIDEBAR / MAIN LAYOUT / TREE COMPONENTS / CLICK PANEL). Thêm style mới vào đúng khối. Cấp độ box dùng class `lvl-*` (`lvl-hdqt/bgd/ptgd/khoi/phong/to/ctv/nghe`).
- **Palette màu**: xanh đậm `#1a365d` (HĐQT/brand), xanh `#2b6cb0`, teal `#2c7a7b` (khối), cam/vàng `#d69e2e`/`#f6ad55` (CTV & nghệ nhân — đặc thù văn hóa).
- **Sau khi sửa, mở `index.html` trong trình duyệt để kiểm chứng** (không có test tự động). Kiểm tra: điều hướng slide, click Tổ mở panel, 4 tab render đúng. Lưu ý mở qua HTTP (Vercel/Live Server) hoặc double-click đều chạy.

## 7. Bối cảnh nghiệp vụ cần nhớ

- **Đặc thù Hà Tĩnh**: Đội Nghệ thuật Dân gian (hát **Ví Dặm**, nghệ nhân CTV) và ẩm thực đặc sản địa phương là điểm nhấn — đừng coi là module phụ.
- **Vận hành 24/7**: KDL chạy liên tục, có ca đêm + phụ cấp; nhiều nghiệp vụ ràng buộc theo ca (HR-ATT, OP-SEC).
- **Lực lượng thời vụ & CTV** lớn (mùa lễ tháng 4–9): `HR-CTV`, `NT-CON` xử lý hợp đồng/thù lao ngoài biên chế.
- **Tuân thủ kế toán/thuế VN**: chuẩn TT200, VAS, thuế GTGT 10%, TNCN lũy tiến, BHXH/BHYT/BHTN — phản ánh trong module `FM`.
- **Tích hợp nội địa**: cổng thanh toán VNPay/MoMo, hóa đơn điện tử MISA/VNPT, Zalo OA/SMS (xem `NFR-INT-*`).

## 8. Bộ prototype & handover (`docs/`)

Thư mục `docs/` là **bước cầu nối từ đặc tả sang triển khai phần mềm**: mỗi file `.md` là **một bản prototype** (blueprint đủ để dev bắt tay code). Đây **chưa phải code ứng dụng** — vẫn là tài liệu, nhưng ở tầng thiết kế kỹ thuật (kiến trúc + phân quyền + schema + API + UI + ước lượng).

**Stack đã chốt** (ghi trong `docs/00`): Modular Monolith — **NestJS + Prisma + PostgreSQL** (backend), **Next.js + React** (frontend), **CASL** cho RBAC/ABAC. Chưa có codebase; `docs/99` là kế hoạch handover.

| File | Nội dung |
|------|----------|
| `docs/README.md` | Mục lục 13 file + cách đọc |
| `docs/00-kien-truc-tong-the.md` | Nền: stack, modular monolith, folder structure, quy ước chung, 27 NFR |
| `docs/01-phan-quyen-rbac.md` | **Lõi phân quyền** RBAC phân cấp + ABAC (data-scope) + SoD/Maker-Checker; **seed roles/permissions tự động từ `FR_MAP`** |
| `docs/02..10-*.md` | 9 blueprint module (BK/HR/FM/VT/OP/SP/VG/NT/IT), mỗi file theo **khung 11 mục** |
| `docs/99-handover-plan.md` | Lộ trình phân pha (vertical-slice), ước lượng man-day (179 FR = 385 MD; thực tế ~500–550 MD), phụ thuộc liên module, rủi ro, đội ngũ |

**Khung 11 mục mỗi blueprint module**: 1.Mục tiêu & phạm vi · 2.Danh sách FR (từ CSV) · 3.Vai trò & phân quyền · 4.Mô hình dữ liệu (schema) · 5.API chính · 6.Màn hình UI · 7.Luồng nghiệp vụ · 8.NFR áp dụng · 9.Tích hợp ngoài · 10.Phụ thuộc module · 11.Ước lượng & DoD.

**Insight nền**: org-chart (`TO_DATA`) + `FR_MAP` (tổ → FR) **đã là ma trận `vai trò × quyền`** ở dạng thô → `docs/01` chỉ "vật chất hóa" nó (sinh role/permission tự động từ `FR_MAP`).

**Quy tắc đồng bộ khi đổi yêu cầu (4 nguồn, theo thứ tự)**:
`KDL_Requirements_Full.csv` → `charts_html/data/reqs-data.js` (REQS_DATA) → `docs/<module>.md` (mục 2 & ước lượng) → `docs/01-phan-quyen-rbac.md` (nếu đụng vai trò/quyền). Bốn nguồn phải khớp số FR & man-day.

## 9. Prototype mock UI tĩnh (`prototype/`)

`prototype/` là SPA mock UI thuần frontend cho phần mềm quản trị KDL Hà Tĩnh. Không có backend, API thật, database, framework, dependency, `package.json` hay build step. Entry là `prototype/index.html`, mở trực tiếp bằng double-click (`file://`) hoặc deploy static trên Vercel đều chạy.

Cấu trúc chính:
- `prototype/index.html`: shell sidebar 9 module, topbar chọn vai trò, vùng render.
- `prototype/assets/css/app.css`: design system dashboard theo palette `charts_html`.
- `prototype/assets/js/components.js`: bảng, badge, KPI, modal, toast.
- `prototype/assets/js/app.js`: hash-router, RBAC mock, render màn hình và tương tác sống.
- `prototype/data/_bridge.js`: bridge đọc lại `charts_html/data/org-data.js`, `reqs-data.js`, `mapping-data.js` để dùng `TO_DATA`, `REQS_DATA`, `FR_MAP`, `SCHEMA_DATA` thật.
- `prototype/data/mock-*.js`: dữ liệu vận hành giả cho phòng, POS, booking, nhân sự, tài chính, vật tư, spa, vui chơi, nghệ thuật Ví Dặm, IT.

Các tương tác demo hiện có: đổi trạng thái phòng, lọc phòng theo tầng/trạng thái, thêm order F&B, chuyển vòng đời order POS, check-in khách, check-out gom tiền phòng/F&B/minibar, ghi doanh thu FM, tự tạo việc dọn phòng, lập/duyệt phiếu chi theo SoD. Bộ chọn vai trò lọc menu client-side theo `FR_MAP`/module được cấp và minh họa `scope own` cho nghệ nhân/nhân viên.

Prototype có thể xuất/nhập state JSON từ topbar để lưu kịch bản demo. Mọi thao tác chính ghi `audit` trong localStorage và xem được tại module CNTT → `Audit log`.

Các nâng cấp vận hành mock cần giữ khi sửa tiếp: check-out mở hóa đơn tổng trước khi xác nhận; chặn check-out nếu còn order F&B chưa sẵn sàng; order charge-to-room dừng ở `Chờ check-out` và chỉ được tính tiền khi checkout phòng; housekeeping có lifecycle `Chờ dọn → Đang dọn → Chờ kiểm → Đạt/Không đạt`; yêu cầu khách dùng SLA tính theo `openedAt`; CNTT có `Health check` để phát hiện state bất thường.

Topbar có bộ chọn kịch bản demo (`Ngày thường`, `Cuối tuần đông khách`, `Sự cố vận hành`, `Duyệt chi cao điểm`) để reset state theo tình huống UAT. Module OP có màn `Trung tâm vận hành` gom booking chờ check-in, checkout sẵn sàng/bị chặn, POS, SLA và buồng phòng. POS có phiếu bếp giả lập; modal checkout có nút in hóa đơn.

Nút `Bước demo` trên topbar và trong `Trung tâm vận hành` chạy tuần tự một demo script: booking → check-in, POS, checkout, housekeeping, SLA, health check. Module CNTT có màn `Nguồn FR/Schema` để tra trực tiếp `REQS_DATA`, `FR_MAP`, `SCHEMA_DATA` theo module.

Khi sửa prototype: chỉ chỉnh trong `prototype/` trừ khi cập nhật tài liệu hướng dẫn này. Không chạm `charts_html/`, `docs/`, CSV; các file đó chỉ được nạp lại làm dữ liệu nguồn.
