# 📘 Bộ Prototype & Handover — KDL Hà Tĩnh

> Mỗi file `.md` trong thư mục này là **một bản prototype** (blueprint đủ để dev bắt tay code mà không phải hỏi lại). Cùng nhau, chúng biến bộ đặc tả (`KDL_Requirements_Full.csv` + org-chart `charts_html/`) thành một **kế hoạch triển khai phần mềm chuẩn chỉnh để bàn giao**.

## Cách đọc

1. **Bắt đầu từ nền** → [`00-kien-truc-tong-the.md`](00-kien-truc-tong-the.md): stack, kiến trúc modular monolith, quy ước chung, 27 NFR.
2. **Lõi quan trọng nhất** → [`01-phan-quyen-rbac.md`](01-phan-quyen-rbac.md): cơ chế phân quyền RBAC + ABAC + SoD, ánh xạ từ org-chart, seed tự động từ `FR_MAP`. Triển khai trước tiên (Pha 0).
3. **9 blueprint module** (`02`–`10`): mỗi module một bản prototype theo **khung 11 mục** thống nhất.
4. **Tổng kết** → [`99-handover-plan.md`](99-handover-plan.md): lộ trình phân pha, ước lượng man-day, phụ thuộc, rủi ro, đội ngũ.

## Mục lục 13 bản prototype

| # | File | Nội dung | FR |
|---|------|----------|:--:|
| — | [README.md](README.md) | Mục lục + cách đọc (file này) | — |
| 00 | [00-kien-truc-tong-the.md](00-kien-truc-tong-the.md) | Kiến trúc nền: stack NestJS/Next/Postgres/CASL, quy ước, NFR | — |
| 01 | [01-phan-quyen-rbac.md](01-phan-quyen-rbac.md) | **Lõi phân quyền** RBAC+ABAC+SoD | — |
| 02 | [02-booking.md](02-booking.md) | Web Booking | 35 |
| 03 | [03-nhan-su.md](03-nhan-su.md) | Nhân sự | 39 |
| 04 | [04-tai-chinh.md](04-tai-chinh.md) | Tài chính | 26 |
| 05 | [05-vat-tu.md](05-vat-tu.md) | Vật tư & Thiết bị | 24 |
| 06 | [06-van-hanh.md](06-van-hanh.md) | Vận hành (PMS) | 36 |
| 07 | [07-spa-wellness.md](07-spa-wellness.md) | Spa & Wellness | 6 |
| 08 | [08-vui-choi.md](08-vui-choi.md) | Vui chơi & Giải trí | 4 |
| 09 | [09-nghe-thuat-dan-gian.md](09-nghe-thuat-dan-gian.md) | Nghệ thuật Dân gian (Ví Dặm) | 4 |
| 10 | [10-cong-nghe-thong-tin.md](10-cong-nghe-thong-tin.md) | Công nghệ thông tin | 5 |
| 99 | [99-handover-plan.md](99-handover-plan.md) | **Kế hoạch handover** | — |
| | | **Tổng** | **179** |

## Khung 11 mục mỗi blueprint module

1. Mục tiêu & phạm vi · 2. Danh sách FR (từ CSV) · 3. Vai trò & phân quyền · 4. Mô hình dữ liệu (schema) · 5. API chính · 6. Màn hình UI · 7. Luồng nghiệp vụ · 8. NFR áp dụng · 9. Tích hợp ngoài · 10. Phụ thuộc module · 11. Ước lượng & Definition of Done.

## Quy mô (xem chi tiết ở [99](99-handover-plan.md))

- **179 FR** · **385 MD** chức năng (271.5 dev + 113.5 test).
- Cộng nền tảng + NFR + tích hợp + buffer → **~500–550 MD** thực tế ước tính.

## Đồng bộ dữ liệu (quan trọng)

Khi đổi yêu cầu, sửa theo chuỗi: `KDL_Requirements_Full.csv` → `charts_html/data/reqs-data.js` → `docs/<module>.md` → (nếu đụng quyền) `docs/01-phan-quyen-rbac.md`. Xem `CLAUDE.md` mục 8.
