# Bộ Prototype & Handover - KDL Hà Tĩnh

> Mỗi file `.md` trong thư mục này là một bản prototype/blueprint đủ để chuyển từ đặc tả (`KDL_Requirements_Full.csv` + org-chart `charts_html/`) sang kế hoạch triển khai phần mềm.

## Cách Đọc

1. **Bắt đầu từ nền**: [00-kien-truc-tong-the.md](00-kien-truc-tong-the.md) - stack, kiến trúc modular monolith, quy ước chung, NFR.
2. **Đọc lõi phân quyền**: [01-phan-quyen-rbac.md](01-phan-quyen-rbac.md) - RBAC + ABAC + SoD, ánh xạ từ org-chart và `FR_MAP`.
3. **Đọc 9 blueprint module**: [02](02-booking.md) đến [10](10-cong-nghe-thong-tin.md), mỗi module theo cùng khung 11 mục.
4. **Đọc workflow BA**: [11-workflow-tong-the.md](11-workflow-tong-the.md) - gom 179 FR thành 7 workflow chính, câu hỏi chốt với khách hàng và setup plan.
5. **Đọc kế hoạch handover**: [99-handover-plan.md](99-handover-plan.md) - phân pha, ước lượng, phụ thuộc, rủi ro, đội ngũ.

## Mục Lục 14 Bản Prototype

| # | File | Nội dung | FR |
|---|------|----------|:--:|
| - | [README.md](README.md) | Mục lục + cách đọc | - |
| 00 | [00-kien-truc-tong-the.md](00-kien-truc-tong-the.md) | Kiến trúc nền: NestJS/Next/Postgres/CASL, quy ước, NFR | - |
| 01 | [01-phan-quyen-rbac.md](01-phan-quyen-rbac.md) | Lõi phân quyền RBAC + ABAC + SoD | - |
| 02 | [02-booking.md](02-booking.md) | Web Booking | 35 |
| 03 | [03-nhan-su.md](03-nhan-su.md) | Nhân sự | 39 |
| 04 | [04-tai-chinh.md](04-tai-chinh.md) | Tài chính | 26 |
| 05 | [05-vat-tu.md](05-vat-tu.md) | Vật tư & Thiết bị | 24 |
| 06 | [06-van-hanh.md](06-van-hanh.md) | Vận hành PMS/POS/SLA | 36 |
| 07 | [07-spa-wellness.md](07-spa-wellness.md) | Spa & Wellness | 6 |
| 08 | [08-vui-choi.md](08-vui-choi.md) | Vui chơi & Giải trí | 4 |
| 09 | [09-nghe-thuat-dan-gian.md](09-nghe-thuat-dan-gian.md) | Nghệ thuật dân gian / Ví Dặm | 4 |
| 10 | [10-cong-nghe-thong-tin.md](10-cong-nghe-thong-tin.md) | Công nghệ thông tin | 5 |
| 11 | [11-workflow-tong-the.md](11-workflow-tong-the.md) | Workflow tổng thể & setup plan | - |
| 99 | [99-handover-plan.md](99-handover-plan.md) | Kế hoạch handover | - |
| | | **Tổng** | **179** |

## Khung 11 Mục Của Mỗi Blueprint Module

1. Mục tiêu & phạm vi
2. Danh sách FR từ CSV
3. Vai trò & phân quyền
4. Mô hình dữ liệu/schema
5. API chính
6. Màn hình UI
7. Luồng nghiệp vụ
8. NFR áp dụng
9. Tích hợp ngoài
10. Phụ thuộc module
11. Ước lượng & Definition of Done

## Quy Mô

- **179 FR** / **9 module**.
- **385 MD** chức năng theo CSV: 271.5 dev + 113.5 test.
- Cộng nền tảng, NFR, tích hợp, UI/UX, DevOps, buffer: **khoảng 500-550 MD** thực tế.

## Đồng Bộ Dữ Liệu

Khi đổi yêu cầu, sửa theo chuỗi:

`KDL_Requirements_Full.csv` -> `charts_html/data/reqs-data.js` -> `docs/<module>.md` -> nếu đụng quyền thì cập nhật [01-phan-quyen-rbac.md](01-phan-quyen-rbac.md).

Tài liệu [11-workflow-tong-the.md](11-workflow-tong-the.md) là lớp BA để chốt flow với khách hàng trước khi cập nhật sâu vào từng FR/module.
