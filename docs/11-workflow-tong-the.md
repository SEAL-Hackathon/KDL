# 11 - Workflow tong the & Setup Plan

> Tai lieu BA de gom 179 FR / 9 module thanh cac workflow co the trinh bay voi khach hang. Muc tieu la giup khach nhin duoc toan bo bai toan van hanh, khong bi roi vao tung man hinh CRUD hay tung dong yeu cau.

---

## 1. Nguyen tac trinh bay

Khach hang thuong khong tu quyet duoc flow neu chi duoc hoi "muon chuc nang gi". BA can quyet dinh khung nghiep vu truoc, sau do dung khung nay de dat cau hoi va chot ngoai le.

**Khong trinh bay theo 179 FR.** 179 FR la thu vien chuc nang de dev implement va QA nghiem thu. Khi lam viec voi khach hang, chi nen trinh bay theo workflow:

- Dau vao la gi?
- Ai thuc hien?
- Qua nhung bo phan nao?
- He thong tao ra chung tu/trang thai nao?
- Diem nao can duyet?
- Neu loi/SLA tre thi ai bi escalate?
- Du lieu cuoi cung ve bao cao nao?

---

## 2. Ban do 7 workflow xuyen module

| Ma | Workflow | Module chinh | Muc tieu nghiep vu | Output cuoi |
|----|----------|--------------|--------------------|-------------|
| W1 | Ban dich vu -> dat cho -> thanh toan -> check-in | BK, OP, FM | Bien nhu cau cua khach thanh booking hop le va doanh thu/cho o duoc giu | Booking confirmed, payment/deposit, QR check-in, room assigned |
| W2 | Luu tru -> dich vu phat sinh -> checkout | OP, FM, SP, VG, NT | Gom toan bo chi phi cua khach trong thoi gian su dung dich vu | Hoa don tong, doanh thu ghi nhan, phong chuyen can don |
| W3 | Buong phong -> trang thai phong -> san sang ban lai | OP, HR | Giam thoi gian quay vong phong va dam bao phong sach truoc khi ban | Room status "Trong sach", task audit |
| W4 | Yeu cau/khieu nai/su co -> SLA -> escalation | OP, VT, IT | Kiem soat chat luong dich vu va thoi gian xu ly | Ticket hoan tat, SLA log, escalation log |
| W5 | Ton kho/bao tri -> de xuat -> duyet chi | VT, FM, OP | Kiem soat chi phi vat tu, sua chua, mua sam | Phieu nhap/xuat/bao tri, phieu chi, stock ledger |
| W6 | Nhan su/CTV -> ca lam -> cham cong -> luong/thu lao | HR, FM, NT | Kiem soat nguon luc, ngay cong, tien luong, thue va scope du lieu | Payroll, payslip, CTV payout, tax records |
| W7 | Phan quyen -> audit -> uptime/backup | IT, Core, tat ca module | Dam bao ai duoc lam gi, truy vet thao tac va duy tri he thong 24/7 | Role/permission, audit log, uptime/backup evidence |

**Cach demo khuyen nghi:** bat dau tu W1 -> W2 -> W3 de khach thay dong tien va van hanh loi; sau do di W4/W5/W6/W7 de chot kiem soat noi bo.

---

## 3. W1 - Ban dich vu -> Dat cho -> Thanh toan -> Check-in

### Muc tieu

Flow nay tra loi cau hoi: "Mot khach tu luc xem dich vu den luc duoc nhan phong/ve/lich dich vu thi he thong xu ly nhu the nao?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| BK | Web booking, gio dich vu, availability, thanh toan, QR |
| OP | Le tan, trang thai phong, check-in |
| FM | Ghi nhan thanh toan/dat coc/doanh thu cho doi soat |

Actor: Khach hang, Le tan/Booking admin, Thu ngan/Ke toan doi soat.

### Buoc chinh

1. Khach xem dich vu: phong, ve, activity, F&B, spa, su kien.
2. He thong kiem tra availability va lock tam.
3. Khach nhap thong tin, voucher, xac nhan dieu kien huy.
4. Khach thanh toan online hoac chon pay-at-resort.
5. He thong tao booking confirmed/pending va gui QR.
6. Le tan quet QR/SDT/ma booking de check-in.
7. He thong cap nhat trang thai phong/dich vu va tao du lieu cho FM doi soat.

### Diem BA can chot

- Lock phong/slot trong bao lau?
- Pay-at-resort co can admin xac nhan khong?
- Dat coc bat buoc trong truong hop nao?
- No-show xu ly sau bao lau va co tinh phi khong?
- Khach co duoc sua ngay/loai phong sau thanh toan khong?
- Booking da check-in thi duoc huy/sua den muc nao?

### FR lien quan

- BK-AUTH, BK-CAT, BK-ORD, BK-PAY, BK-BOOK, BK-NOTI, BK-ADM
- OP-CHK-01, OP-CHK-04, OP-ROOM-01
- FM-REV-01, FM-REV-02, FM-TAX neu xuat hoa don

### Khong dua vao demo tong quan

Dang ky/quen mat khau chi tiet, banner CMS, review, push notification, export Excel.

### DoD workflow

- Dat phong thanh cong co QR.
- Payment timeout/lock availability hoat dong.
- Le tan check-in tu booking va phong doi trang thai.
- Giao dich duoc day sang FM o trang thai cho doi soat.
- Tat ca thao tac admin co audit log.

---

## 4. W2 - Luu tru -> Dich vu phat sinh -> Checkout

### Muc tieu

Flow nay tra loi cau hoi: "Trong thoi gian khach o/choi/an/uong/su dung spa, chi phi phat sinh duoc gom va thanh toan ra sao?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| OP | Check-in/out, POS F&B, service request, room charge |
| FM | Hoa don, doanh thu, doi soat cuoi ngay |
| SP/VG/NT | Dich vu chuyen biet co the phat sinh doanh thu |
| VT | Tru kho vat tu/nguyen lieu neu co |

Actor: Le tan, Thu ngan F&B, Thu ngan/le tan Spa, Quan ly vui choi, Ke toan.

### Buoc chinh

1. Khach dang luu tru hoac dung dich vu tai khu.
2. POS/dich vu ghi order/phieu dich vu.
3. He thong quyet dinh thanh toan tai cho hay charge-to-room.
4. Neu charge-to-room, chi phi treo vao ho so luu tru.
5. Khi checkout, he thong gom tien phong, minibar, F&B, spa, ve, phu phi.
6. Le tan kiem tra blocker: order chua dong, phong sai trang thai, chua doi soat.
7. Xac nhan checkout, phat sinh doanh thu va chuyen phong sang can don.

### Diem BA can chot

- Dich vu nao duoc charge-to-room?
- Ai co quyen cho no/ghi no/split bill?
- Checkout co cho phep khi order F&B dang bep khong?
- Hoa don VAT xuat theo booking hay theo tung dich vu?
- Doanh thu ghi nhan luc thanh toan, luc check-in hay luc checkout?

### FR lien quan

- OP-FNB, OP-CHK, OP-RPT
- SP-BOOK, SP-SERV, SP-RPT
- VG-OPS, VG-RPT
- NT-SCH, NT-RPT
- FM-REV, FM-TAX, FM-RPT
- VT-EXP neu tru kho theo recipe

### Khong dua vao demo tong quan

Chi tiet in phieu bep, combo spa, filter bao cao, CRM VIP, thiet lap gia theo ngay le.

### DoD workflow

- POS tao order, chuyen trang thai va co the charge-to-room.
- Checkout gom dung cac khoan phat sinh.
- Neu con blocker thi khong cho checkout.
- Xac nhan checkout tao doanh thu FM va task buong phong.
- Co audit va daily report.

---

## 5. W3 - Buong phong -> Trang thai phong -> San sang ban lai

### Muc tieu

Flow nay tra loi cau hoi: "Sau khi khach tra phong, lam sao phong quay ve trang thai ban duoc nhanh nhat va co kiem soat chat luong?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| OP | Room status, housekeeping task, inspection |
| HR | Ca lam va nhan su buong phong |
| BK | Availability de ban lai phong |

Actor: Le tan, To truong buong phong, Nhan vien don phong, Quan ly van hanh.

### Buoc chinh

1. Checkout thanh cong tao task don phong.
2. He thong gan phong ve trang thai "Can don".
3. To truong phan cong nhan vien/ca.
4. Nhan vien cap nhat "Dang don" va gui anh sau don.
5. To truong/kiem phong danh dau "Dat" hoac "Khong dat".
6. Neu dat, phong ve "Trong sach" va BK co the ban lai.
7. Neu khong dat, task quay lai trang thai xu ly.

### Diem BA can chot

- Ai duoc chuyen phong sang "Trong sach"?
- Co bat buoc anh sau don khong?
- Phong "Khong dat" escalation cho ai?
- Trang thai phong tren BK va OP dong bo 1 chieu hay 2 chieu?
- Bao tri chen vao flow don phong nhu the nao?

### FR lien quan

- OP-ROOM-01 den OP-ROOM-06
- OP-CHK-02
- HR-ATT-01 den HR-ATT-06
- BK-ADM-04

### DoD workflow

- Checkout tao task don phong.
- Phan cong/inspection cap nhat trang thai phong.
- Phong chi duoc ban lai khi inspection dat.
- History/audit cua moi lan doi trang thai duoc luu.

---

## 6. W4 - Yeu cau/khieu nai/su co -> SLA -> Escalation

### Muc tieu

Flow nay tra loi cau hoi: "Khi khach/NV bao su co, he thong dam bao xu ly dung thoi gian va dung nguoi nhu the nao?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| OP | Service request, complaint, tech/security incident |
| VT | Bao tri, phu tung, tai san |
| IT | Helpdesk noi bo, service down |
| FM | Chi phi phat sinh neu can sua/mua |

Actor: Le tan, Bo phan xu ly, Quan ly van hanh, Ky thuat, IT, Bao ve, TGĐ neu nghiem trong.

### Buoc chinh

1. Tiep nhan yeu cau/khieu nai/su co.
2. Phan loai: dich vu, khieu nai, ky thuat, an ninh, IT.
3. Gan muc do uu tien va SLA.
4. Phan cong nguoi/bo phan xu ly.
5. Cap nhat tien do, anh truoc/sau, ghi chu.
6. Neu tre SLA hoac muc nghiem trong, escalate.
7. Dong ticket va dua vao bao cao chat luong/NPS/MTTR.

### Diem BA can chot

- SLA theo tung loai yeu cau la bao lau?
- Cap do nao bao quan ly, cap do nao bao TGĐ?
- Khieu nai co can buoc bu tru/hoan tien khong?
- Su co ky thuat co tao phieu bao tri/chi phi tu dong khong?
- Ticket dong xong co can khach xac nhan hai long khong?

### FR lien quan

- OP-SVC, OP-TECH, OP-SEC
- VT-MNT
- IT-HLP, IT-INF
- FM-EXP neu phat sinh chi phi
- OP-RPT

### DoD workflow

- Ticket co SLA timer.
- Tre SLA co canh bao/escalation.
- Bo phan xu ly co trang thai va bang chung.
- Dong ticket ghi audit va vao bao cao.

---

## 7. W5 - Ton kho/bao tri -> De xuat -> Duyet chi

### Muc tieu

Flow nay tra loi cau hoi: "Khi can mua vat tu, xuat kho, sua thiet bi, ai de xuat va ai duyet tien?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| VT | Danh muc, ton kho, nhap/xuat, bao tri, NCC/PO |
| FM | Phieu chi, ngan sach, duyet, cong no |
| OP/F&B/SP/VG | Bo phan su dung vat tu/thiet bi |

Actor: Thu kho, Quan ly bo phan, Ke toan chi phi, Ke toan truong, TGĐ.

### Buoc chinh

1. He thong phat hien ton kho duoi dinh muc hoac thiet bi can bao tri.
2. Bo phan/thu kho tao de xuat nhap/mua/sua.
3. Lay bao gia/NCC hoac gan chi phi du kien.
4. FM tao phieu chi hoac PO theo ngan sach.
5. Checker duyet theo nguong: KTT/TGĐ.
6. Khi nhap/xuat/sua hoan tat, cap nhat stock ledger/asset status.
7. Chi phi vao bao cao ngan sach/P&L.

### Diem BA can chot

- Dinh muc ton toi thieu theo ngay/ca/thang?
- Nguong tien nao can KTT, nguong nao can TGĐ?
- Thu kho co duoc vua tao vua duyet phieu nhap khong?
- Vat tu F&B tru kho theo order hay theo xuat ca?
- Bao tri thiet bi co bat buoc nghiem thu anh/bien ban khong?

### FR lien quan

- VT-CAT, VT-IMP, VT-EXP, VT-STK, VT-MNT, VT-PRO
- FM-BUD, FM-EXP, FM-ACC, FM-RPT
- OP-FNB, OP-TECH, VG-OPS

### DoD workflow

- Ton duoi dinh muc sinh canh bao.
- Nhap/xuat kho cap nhat ledger.
- Phieu chi duyet theo maker-checker va nguong tien.
- Bao tri co trang thai, chi phi va bang chung.

---

## 8. W6 - Nhan su/CTV -> Ca lam -> Cham cong -> Luong/thu lao

### Muc tieu

Flow nay tra loi cau hoi: "Nguon luc 24/7, CTV mua vu va nghe nhan duoc quan ly, cham cong, tra tien nhu the nao?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| HR | Ho so, hop dong, ca lam, cham cong, phep, luong, CTV |
| FM | Luong, BHXH, TNCN, but toan |
| NT | Lich nghe thuat, thu lao nghe nhan |
| IT | Cap/thu hoi quyen theo vong doi nhan su |

Actor: HR, Quan ly bo phan, Nhan vien, CTV/Nghe nhan, Ke toan luong, KTT.

### Buoc chinh

1. Tao ho so NV/CTV/hop dong va vai tro.
2. Xep ca theo bo phan va nhu cau van hanh.
3. NV/quan ly cham cong, ghi tang ca/nghi phep.
4. Quan ly duyet phep/sua cong neu co ly do.
5. He thong tinh luong/thu lao/khau tru.
6. Ke toan/KTT duyet ky luong.
7. Phat phieu luong/ghi but toan/thue.

### Diem BA can chot

- Scope du lieu: nhan vien chi xem gi cua minh?
- Ai duoc sua cham cong va can duyet ra sao?
- Tang ca/ngay le/ca dem tinh theo cong thuc nao?
- CTV/nghe nhan tinh tien theo buoi, theo hop dong hay theo su kien?
- Khi nghi viec, quyen he thong bi thu hoi trong bao lau?

### FR lien quan

- HR-EMP, HR-ATT, HR-LEA, HR-SAL, HR-ADM, HR-CTV
- NT-SCH, NT-CON
- FM-TAX, FM-ACC
- IT-SEC

### DoD workflow

- Ho so -> ca -> cong -> luong chay end-to-end.
- Maker-checker ky luong thuc thi.
- Own/team/block scope dung.
- NV nghi viec kich hoat thu hoi quyen.

---

## 9. W7 - Phan quyen -> Audit -> Uptime/Backup

### Muc tieu

Flow nay tra loi cau hoi: "Lam sao he thong dam bao dung quyen, truy vet duoc thao tac va van hanh 24/7?"

### Module va actor

| Module | Vai tro |
|--------|--------|
| Core/RBAC | Auth, role, permission, data-scope, SoD |
| IT | Quan ly truy cap, helpdesk, uptime, backup/DR |
| Tat ca module | Audit va PoliciesGuard |

Actor: IT admin, Super admin, Quan ly bo phan, Auditor/Kiem soat noi bo.

### Buoc chinh

1. HR/to chuc tao user theo vi tri/to.
2. He thong seed role/permission tu FR_MAP.
3. User dang nhap, PoliciesGuard quyet dinh duoc xem/lam gi.
4. Moi create/update/approve/delete ghi audit log.
5. IT theo doi uptime/service down/helpdesk.
6. Backup hang ngay va test restore dinh ky.
7. Review quyen hang quy va thu hoi khi nghi viec.

### Diem BA can chot

- Role nao la role dac biet ngoai org-chart?
- Co can 2FA cho tat ca admin hay chi super admin?
- Audit log luu bao lau?
- Ai duoc xem audit log?
- Khi cap quyen tam thoi, valid_to/toi da bao lau?
- RPO/RTO du kien cho PMS/POS/BK la bao nhieu?

### FR lien quan

- IT-SEC, IT-HLP, IT-INF, IT-BAK
- HR-EMP-05
- Tat ca FR co thao tac ghi/duyet
- docs/01-phan-quyen-rbac.md

### DoD workflow

- Dang nhap, role, permission, data-scope chay that.
- Audit log co before/after/user/time.
- User nghi viec thu hoi quyen.
- Uptime/backup co evidence va bao cao.

---

## 10. Gom FR theo workflow

Mot FR co the xuat hien trong nhieu workflow. Khi lap backlog, lay workflow lam epic, FR lam story.

| Workflow | Nhom FR chinh |
|----------|---------------|
| W1 | BK-AUTH, BK-CAT, BK-ORD, BK-PAY, BK-BOOK, BK-NOTI, BK-ADM, OP-CHK, OP-ROOM, FM-REV |
| W2 | OP-FNB, OP-CHK, OP-RPT, SP-BOOK, SP-SERV, VG-OPS, NT-SCH, FM-REV, FM-TAX, VT-EXP |
| W3 | OP-ROOM, OP-CHK, HR-ATT, BK-ADM |
| W4 | OP-SVC, OP-TECH, OP-SEC, VT-MNT, IT-HLP, OP-RPT |
| W5 | VT-CAT, VT-IMP, VT-EXP, VT-STK, VT-MNT, VT-PRO, FM-BUD, FM-EXP, FM-ACC |
| W6 | HR-EMP, HR-ATT, HR-LEA, HR-SAL, HR-ADM, HR-CTV, NT-CON, FM-TAX, IT-SEC |
| W7 | IT-INF, IT-HLP, IT-SEC, IT-BAK, HR-EMP-05, Core Auth/RBAC/Audit |

---

## 11. Setup plan de implement

### Pha A - Chuan hoa workflow va prototype

**Muc tieu:** BA co artifact de chot voi khach truoc khi dev code.

Scope:
- Them man hinh `Tong quan workflow` vao prototype: 7 workflow card.
- Moi workflow co drill-down: buoc chinh, actor, module, output, diem BA can chot, FR lien quan.
- Gan nut dieu huong sang Work Center va module lien quan.
- Cap nhat docs/README va 99 handover plan.

DoD:
- Khach xem duoc 7 workflow truoc khi vao tung module.
- Moi workflow co it nhat 1 output nghiep vu ro.
- BA co danh sach cau hoi chot scope.

### Pha B - Core implementation foundation

**Muc tieu:** dung nen de workflow nao cung co quyen, audit va data-scope.

Scope:
- Monorepo scaffold: `apps/api`, `apps/web`, `libs/shared`, `prisma`.
- Auth JWT + refresh + 2FA admin.
- RBAC/ABAC bang CASL.
- Seed role/permission tu `FR_MAP`.
- Audit log dung chung.
- Soft-delete, timestamp, response format, OpenAPI.
- CI/CD va env mau.

DoD:
- User dang nhap va thay menu theo role.
- API bi chan neu sai permission/data-scope.
- Create/update/approve ghi audit.

### Pha C - Vertical slice W1 + W2

**Muc tieu:** co dong tien va luu tru end-to-end.

Scope:
- BK: catalog, availability, cart/order, payment mock/sandbox, QR.
- OP: check-in/out, room status, POS F&B co charge-to-room.
- FM: revenue ledger, checkout invoice mock, doi soat ngay.

DoD:
- Dat phong -> thanh toan -> check-in -> POS charge -> checkout -> revenue.
- Health check khong co orphan state.

### Pha D - W3 + W4

**Muc tieu:** hoan thien dieu phoi van hanh va SLA.

Scope:
- Housekeeping task/inspection.
- Service request/complaint SLA.
- Tech ticket/security incident.
- Escalation, Work Center queue.

DoD:
- Checkout tao task don phong.
- Ticket tre SLA hien P1/P2 va co audit.
- Work Center gom dung viec theo role.

### Pha E - W5 + W6

**Muc tieu:** kiem soat chi phi va nguon luc.

Scope:
- VT stock/import/export/maintenance/PO.
- FM expense approval maker-checker.
- HR employee/shift/attendance/leave/payroll.
- NT CTV/nghe nhan payout.

DoD:
- Ton duoi dinh muc -> de xuat -> phieu chi -> duyet.
- Ca/cong -> payroll -> KTT duyet -> payslip.

### Pha F - W7 + hardening

**Muc tieu:** dong bo van hanh that.

Scope:
- IT helpdesk/uptime/backup.
- Access lifecycle: joiner/mover/leaver.
- Review quyen quy.
- Observability, backup restore drill, security checklist.

DoD:
- NV nghi viec thu hoi quyen.
- Backup/restore co evidence.
- Uptime dashboard va alert chay.

---

## 12. Backlog setup de bat dau code

| Epic | Viec can tao | Ghi chu |
|------|--------------|---------|
| E0 Core | Repo scaffold, Prisma schema base, auth, RBAC, audit | Lam truoc moi module |
| E1 Workflow UI | Prototype `Tong quan workflow`, workflow drill-down | Phuc vu chot scope voi khach |
| E2 BK-OP-FM Slice | Booking, check-in, POS, checkout, revenue | Slice co gia tri demo cao nhat |
| E3 Work Center | Queue P1/P2, SLA, task action theo role | Lop dieu phoi van hanh |
| E4 VT-FM Cost | Stock, maintenance, expense approval | Kiem soat chi phi |
| E5 HR Payroll | Employee, shift, attendance, leave, payroll | Kiem soat nhan su |
| E6 IT Control | Access, audit, backup, uptime | Hardening va tuan thu |

---

## 13. Cau hoi chot voi khach hang

Dung danh sach nay trong workshop, khong hoi theo tung FR.

1. Doanh thu ghi nhan tai thoi diem nao: thanh toan, check-in hay checkout?
2. Pay-at-resort co can dat coc khong?
3. No-show va huy sat ngay xu ly the nao?
4. Dich vu nao duoc charge-to-room?
5. Ai duoc override checkout blocker?
6. Phong chi duoc ban lai khi ai xac nhan?
7. SLA theo tung loai yeu cau la bao lau?
8. Cap do nao escalate den quan ly/TGD?
9. Nguong tien duyet chi theo KTT/TGD la bao nhieu?
10. Vat tu tru kho theo order, theo ca hay theo phieu xuat?
11. Tang ca/ca dem/ngay le tinh theo cong thuc nao?
12. CTV/nghe nhan tinh thu lao theo buoi hay theo hop dong?
13. Nhan vien nghi viec thu hoi quyen trong bao lau?
14. Ai duoc xem audit log va log luu bao lau?
15. Backup/restore chap nhan RPO/RTO nao?

---

## 14. Ket luan BA

179 FR khong phai cach khach hang ra quyet dinh. Cach dung dung la:

1. Chot 7 workflow.
2. Trong moi workflow chot rule va ngoai le.
3. Map FR vao workflow.
4. Implement theo vertical slice.
5. Nghiem thu bang output nghiep vu, khong bang so luong man hinh.

