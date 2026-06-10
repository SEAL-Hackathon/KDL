/* Router và render prototype mock UI KDL Hà Tĩnh. */
(function () {
  var SOURCE = window.KDL_SOURCE || {};
  var STORE_KEY = 'kdl_prototype_state_v1';
  var ROLE_KEY = 'kdl_prototype_role_v1';
  var MODULE_FILTER_KEY = 'kdl_prototype_module_filter_v1';

  var MODULES = [
    { id: 'hub', code: 'HUB', label: 'Điều phối', org: [] },
    { id: 'op', code: 'OP', label: 'Vận hành', org: ['lt-reception','lt-don-phong','lt-kiem-phong','fb-phuc-vu-ban','fb-thu-ngan','lt-dien','lt-co-khi','an-truc-ngay','an-truc-dem'] },
    { id: 'bk', code: 'BK', label: 'Booking', org: ['kd-dat-phong','kd-noi-dung','kd-thiet-ke','kd-revenue','lt-reception'] },
    { id: 'hr', code: 'HR', label: 'Nhân sự', org: ['ql-tuyen-dung','ql-luong-bhxh','ql-dao-tao','ql-hanh-chinh','ctv-hat-vi-dam'] },
    { id: 'fm', code: 'FM', label: 'Tài chính', org: ['ql-ke-toan-th','ql-ke-toan-cp','ql-ngan-quy','ql-kiem-soat'] },
    { id: 'vt', code: 'VT', label: 'Vật tư', org: ['fb-kho','lt-dien','lt-co-khi'] },
    { id: 'sp', code: 'SP', label: 'Spa', org: ['sw-le-tan-spa','sw-massage','sw-cham-soc-da','sw-xong-hoi'] },
    { id: 'vg', code: 'VG', label: 'Vui chơi', org: ['vg-tro-choi','vg-an-toan','sw-cuu-ho'] },
    { id: 'nt', code: 'NT', label: 'Nghệ thuật', org: ['vg-ke-hoach','vg-le-tan-sk','vg-bieu-dien','vg-hat-vi-dam','ctv-hat-vi-dam','ctv-nhac-cu'] },
    { id: 'it', code: 'IT', label: 'CNTT', org: ['ql-phan-mem','ql-ha-tang'] }
  ];

  var SCREENS = {
    hub: [['workflows','Tổng quan workflow'], ['workcenter','Work Center'], ['roles','Vai trò & quyền'], ['modules','Bản đồ phân hệ'], ['journey','Luồng demo']],
    op: [
      ['dashboard','Dashboard vận hành'], ['workcenter','Work Center'], ['control','Trung tâm vận hành'], ['rooms','Sơ đồ phòng'], ['housekeeping','Dọn phòng & inspection'], ['pos','POS F&B'],
      ['checkin','Check-in/out'], ['requests','Yêu cầu & khiếu nại'], ['tech','Sự cố kỹ thuật'], ['security','Nhật ký an ninh'], ['reports','Báo cáo ngày']
    ],
    bk: [['public','Web booking khách'], ['admin','Dashboard booking'], ['orders','Danh sách đơn'], ['cms','CMS dịch vụ'], ['vouchers','Voucher'], ['reports','Báo cáo']],
    hr: [['dashboard','Dashboard NS'], ['employees','Hồ sơ NV'], ['schedule','Lịch ca tuần'], ['attendance','Chấm công'], ['self','Self-service'], ['leave','Duyệt phép'], ['payroll','Bảng lương'], ['ctv','Quản lý CTV']],
    fm: [['dashboard','Dashboard tài chính'], ['budget','Ngân sách'], ['expenses','Phiếu chi & duyệt'], ['revenue','Thu & đối soát'], ['invoice','Hóa đơn VAT'], ['ledger','Sổ nhật ký'], ['debts','Công nợ'], ['cash','Quỹ tiền mặt'], ['pnl','P&L']],
    vt: [['assets','Tài sản QR'], ['catalog','Vật tư & định mức'], ['imports','Phiếu nhập'], ['exports','Phiếu xuất'], ['stock','Tồn kho'], ['maintenance','Bảo trì'], ['suppliers','NCC & báo giá'], ['po','PO']],
    sp: [['timeline','Lịch Spa'], ['rooms','Phòng trị liệu'], ['checkin','Check-in KTV'], ['services','Dịch vụ & giá'], ['cards','Thẻ trả trước'], ['reports','Báo cáo']],
    vg: [['scan','Quét vé'], ['checklist','Checklist an toàn'], ['incidents','Báo cáo sự cố'], ['reports','Báo cáo']],
    nt: [['schedule','Lịch biểu diễn'], ['assign','Phân công nghệ nhân'], ['contracts','Hợp đồng & thù lao'], ['reports','Báo cáo']],
    it: [['assets','Inventory IT'], ['uptime','Dashboard uptime'], ['helpdesk','Helpdesk'], ['access','Quản lý truy cập'], ['backup','Backup/DR'], ['audit','Audit log'], ['health','Health check'], ['source','Nguồn FR/Schema']]
  };

  var SCREEN_PREFIX = {
    hub: { workflows: [], workcenter: [], roles: [], modules: [], journey: [] },
    op: {
      dashboard: ['OP'], workcenter: ['OP'], control: ['OP'], rooms: ['OP-ROOM'], housekeeping: ['OP-ROOM'], pos: ['OP-FNB'],
      checkin: ['OP-CHK'], requests: ['OP-SVC'], tech: ['OP-TECH'], security: ['OP-SEC'], reports: ['OP-RPT']
    },
    bk: {
      public: ['BK-CAT','BK-ORD','BK-PAY','BK-BOOK'], admin: ['BK-ADM'], orders: ['BK-ORD','BK-BOOK','BK-ADM'],
      cms: ['BK-CAT','BK-ADM'], vouchers: ['BK-ADM','BK-ORD'], reports: ['BK-ADM']
    },
    hr: {
      dashboard: ['HR-ADM'], employees: ['HR-EMP'], schedule: ['HR-ATT'], attendance: ['HR-ATT'],
      self: ['HR-ATT','HR-SAL','HR-LEA'], leave: ['HR-LEA'], payroll: ['HR-SAL'], ctv: ['HR-CTV']
    },
    fm: {
      dashboard: ['FM-RPT','FM-REV','FM-ACC'], budget: ['FM-BUD'], expenses: ['FM-EXP'], revenue: ['FM-REV'],
      invoice: ['FM-REV','FM-TAX'], ledger: ['FM-ACC'], debts: ['FM-EXP','FM-ACC'], cash: ['FM-ACC','FM-REV'], pnl: ['FM-RPT']
    },
    vt: {
      assets: ['VT-CAT'], catalog: ['VT-CAT'], imports: ['VT-IMP'], exports: ['VT-EXP'], stock: ['VT-STK'],
      maintenance: ['VT-MNT'], suppliers: ['VT-PRO'], po: ['VT-PRO']
    },
    sp: {
      timeline: ['SP-BOOK'], rooms: ['SP-BOOK'], checkin: ['SP-BOOK'], services: ['SP-SERV'], cards: ['SP-SERV'], reports: ['SP-RPT']
    },
    vg: {
      scan: ['VG-OPS'], checklist: ['VG-OPS'], incidents: ['VG-OPS','VG-RPT'], reports: ['VG-RPT','VG-OPS']
    },
    nt: {
      schedule: ['NT-SCH'], assign: ['NT-SCH','NT-CON'], contracts: ['NT-CON'], reports: ['NT-RPT','NT-SCH']
    },
    it: {
      assets: ['IT-INF'], uptime: ['IT-INF'], helpdesk: ['IT-HLP'], access: ['IT-SEC'], backup: ['IT-BAK'],
      audit: ['IT-SEC'], health: ['IT-INF','IT-HLP','IT-SEC'], source: ['IT-SEC']
    }
  };

  var ROLES = [
    { id: 'admin', label: 'Admin hệ thống', all: true, scope: 'all', group: 'Vai trò demo đặc biệt' },
    { id: 'le_tan', label: 'Lễ tân', orgKey: 'lt-reception', scope: 'team', group: 'Vai trò demo đặc biệt' },
    { id: 'thu_quy', label: 'Thủ quỹ', orgKey: 'ql-ngan-quy', scope: 'block', canMakeExpense: true, group: 'Vai trò demo đặc biệt' },
    { id: 'ktt', label: 'Kế toán trưởng', modules: ['FM','HR'], scope: 'block', canApproveExpense: true, canApprovePayroll: true, group: 'Vai trò demo đặc biệt' },
    { id: 'buong_phong', label: 'Tổ trưởng buồng phòng', orgKey: 'lt-don-phong', extraModules: ['OP'], scope: 'team', group: 'Vai trò demo đặc biệt' },
    { id: 'fnb', label: 'Thu ngân F&B', orgKey: 'fb-thu-ngan', scope: 'team', group: 'Vai trò demo đặc biệt' },
    { id: 'nghe_nhan', label: 'Nghệ nhân CTV', orgKey: 'ctv-hat-vi-dam', scope: 'own', group: 'Vai trò demo đặc biệt' },
    { id: 'it_admin', label: 'IT phần mềm/dữ liệu', orgKey: 'ql-phan-mem', scope: 'all', group: 'Vai trò demo đặc biệt' },
    { id: 'tgd', label: 'TGĐ', modules: ['OP','BK','HR','FM','VT','SP','VG','NT','IT'], scope: 'all', canApproveExpense: true, group: 'Vai trò demo đặc biệt' }
  ];
  ROLES = buildRoleCatalog(ROLES);

  var DEMO_STEPS = [
    'Đẩy một booking phòng sang check-in',
    'Chuyển một order POS sang bước tiếp theo',
    'Hoàn tất order tại bàn hoặc đưa charge-to-room về Chờ check-out',
    'Checkout một phòng đủ điều kiện và ghi doanh thu',
    'Chuyển một việc buồng phòng sang bước tiếp theo',
    'Xử lý một yêu cầu/SLA đang mở',
    'Mở Health check để rà state'
  ];

  var state = loadState();
  var currentRoleId = localStorage.getItem(ROLE_KEY) || 'admin';
  var moduleFilter = localStorage.getItem(MODULE_FILTER_KEY) || 'all';

  function defaults() {
    return {
      op: clone(window.MOCK_OP),
      bk: clone(window.MOCK_BK),
      hr: clone(window.MOCK_HR),
      fm: clone(window.MOCK_FM),
      vt: clone(window.MOCK_VT),
      misc: clone(window.MOCK_MISC),
      ui: { roomStatus: 'all', roomFloor: 'all', demoStep: 0, sourceModule: 'OP' },
      audit: []
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function buildRoleCatalog(seedRoles) {
    var existingOrg = {};
    seedRoles.forEach(function (r) { if (r.orgKey) existingOrg[r.orgKey] = true; });
    var generated = Object.keys(SOURCE.frMap || {}).filter(function (key) {
      return !existingOrg[key];
    }).sort(function (a, b) {
      var an = SOURCE.toData && SOURCE.toData[a] ? SOURCE.toData[a].name : a;
      var bn = SOURCE.toData && SOURCE.toData[b] ? SOURCE.toData[b].name : b;
      return an.localeCompare(bn, 'vi');
    }).map(function (key) {
      var to = SOURCE.toData && SOURCE.toData[key] ? SOURCE.toData[key] : {};
      return {
        id: 'org:' + key,
        label: (to.name || key) + ' · ' + key,
        orgKey: key,
        scope: inferOrgScope(key, to),
        group: inferOrgGroup(key, to),
        generated: true,
        canMakeExpense: key === 'ql-ngan-quy' || key === 'ql-ke-toan-cp',
        canApproveExpense: key === 'ql-ke-toan-cp',
        canApprovePayroll: key === 'ql-luong-bhxh'
      };
    });
    return seedRoles.concat(generated);
  }

  function inferOrgScope(key, to) {
    if (key.indexOf('ctv-') === 0) return 'own';
    if ((to.parent || '').indexOf('P. Tài chính') >= 0 || key.indexOf('ql-') === 0 || key.indexOf('kd-revenue') === 0) return 'block';
    return 'team';
  }

  function inferOrgGroup(key, to) {
    var parent = to.parent || '';
    if (key.indexOf('ql-') === 0) return 'Khối Quản lý & Điều hành';
    if (key.indexOf('kd-') === 0) return 'Khối Kinh doanh & Marketing';
    if (key.indexOf('lt-') === 0) return 'Khối Lưu trú';
    if (key.indexOf('fb-') === 0) return 'Khối F&B';
    if (key.indexOf('vg-') === 0) return 'Khối Vui chơi & Nghệ thuật';
    if (key.indexOf('sw-') === 0) return 'Khối Spa & Wellness';
    if (key.indexOf('an-') === 0) return 'Khối An ninh';
    if (key.indexOf('ctv-') === 0) return 'Khối Cộng tác viên';
    return parent || 'Org role từ FR_MAP';
  }

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      return normalizeState(saved || defaults());
    } catch (err) {
      return normalizeState(defaults());
    }
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function normalizeState(data) {
    var base = defaults();
    data.op = data.op || base.op;
    data.bk = data.bk || base.bk;
    data.hr = data.hr || base.hr;
    data.fm = data.fm || base.fm;
    data.vt = data.vt || base.vt;
    data.misc = data.misc || base.misc;
    data.ui = data.ui || {};
    data.ui.roomStatus = data.ui.roomStatus || 'all';
    data.ui.roomFloor = data.ui.roomFloor || 'all';
    data.ui.demoStep = data.ui.demoStep || 0;
    data.ui.sourceModule = data.ui.sourceModule || 'OP';
    data.audit = data.audit || [];
    data.op.orders = data.op.orders || [];
    data.op.checkouts = data.op.checkouts || [];
    data.op.housekeeping = data.op.housekeeping || [];
    data.op.requests = data.op.requests || [];
    data.op.techTickets = data.op.techTickets || base.op.techTickets || [];
    data.bk.bookings = data.bk.bookings || base.bk.bookings || [];
    data.bk.services = data.bk.services || base.bk.services || [];
    data.bk.vouchers = data.bk.vouchers || base.bk.vouchers || [];
    data.bk.reviews = data.bk.reviews || base.bk.reviews || [];
    data.hr.employees = data.hr.employees || base.hr.employees || [];
    data.hr.leaves = data.hr.leaves || base.hr.leaves || [];
    data.hr.payroll = data.hr.payroll || base.hr.payroll || [];
    data.hr.ctv = data.hr.ctv || base.hr.ctv || [];
    data.fm.expenses = data.fm.expenses || base.fm.expenses || [];
    data.vt.stock = data.vt.stock || base.vt.stock || [];
    data.op.requests.forEach(function (request) {
      request.dueMin = request.dueMin || (request.type === 'Khiếu nại' ? 30 : 15);
      if (!request.openedAt) {
        request.openedAt = new Date(Date.now() - Math.max(0, request.dueMin - (request.sla || request.dueMin)) * 60000).toISOString();
      }
    });
    data.fm.revenues = data.fm.revenues || [];
    data.vt.exports = data.vt.exports || [];
    return data;
  }

  function audit(action, detail, before, after) {
    state.audit.unshift({
      at: new Date().toISOString(),
      role: role().label,
      action: action,
      detail: detail,
      before: before ? JSON.stringify(before).slice(0, 180) : '',
      after: after ? JSON.stringify(after).slice(0, 180) : ''
    });
    state.audit = state.audit.slice(0, 150);
  }

  function persist(message, tone) {
    saveState();
    render();
    if (message) UI.toast(message, tone || 'success');
  }

  function todayText() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildScenario(name) {
    var data = normalizeState(defaults());
    data.audit = [];
    if (name === 'weekend') {
      data.op.rooms.forEach(function (room, index) {
        if (index < 30) {
          room.status = 'Có khách';
          room.guest = ['Nguyễn Lan Anh', 'Trần Minh Đức', 'Phan Minh Châu', 'Bùi Khánh Linh'][index % 4];
        } else if (index < 36) {
          room.status = 'Cần dọn';
          room.guest = '';
        }
      });
      data.op.orders.unshift(
        { id: 'OD-WE-01', table: 'B03', guest: 'Phòng P101', items: ['Cháo hàu Lộc Hà', 'Cu đơ Hà Tĩnh'], total: 130000, status: 'Chờ check-out', chargeToRoom: true },
        { id: 'OD-WE-02', table: 'B08', guest: 'Walk-in', items: ['Ram bánh mướt'], total: 65000, status: 'Chờ thanh toán', chargeToRoom: false }
      );
      data.op.checkins.unshift(
        { id: 'CI-WE-01', guest: 'Nguyễn Lan Anh', booking: 'BK-240610-001', room: 'P101', cccd: 'QR từ booking', card: 'Đã giao thẻ', status: 'Đang lưu trú' },
        { id: 'CI-WE-02', guest: 'Trần Minh Đức', booking: 'BK-240609-009', room: 'P102', cccd: 'QR từ booking', card: 'Đã giao thẻ', status: 'Đang lưu trú' }
      );
      data.op.housekeeping.unshift({ room: 'P301', staff: 'Chưa phân công', shift: 'Sáng 06-14', inspection: 'Chờ dọn', photo: 'Chưa có ảnh' });
      data.fm.revenues.unshift({ source: 'Booking online cuối tuần', amount: 186000000, date: todayText(), status: 'Chờ đối soát' });
    }
    if (name === 'incident') {
      data.op.requests.unshift(
        { id: 'SLA-CRIT', room: 'P208', type: 'Khiếu nại', desc: 'Khách báo mất điện cục bộ', assigned: 'Kỹ thuật điện', dueMin: 10, openedAt: new Date(Date.now() - 28 * 60000).toISOString(), status: 'Escalate P1' }
      );
      data.op.techTickets.unshift({ id: 'KT-P1', location: 'P208', issue: 'Mất điện cục bộ', priority: 'P1', before: 'Ảnh tủ điện giả', after: 'Chưa có', status: 'Đang sửa', cost: 0 });
      var room = data.op.rooms.find(function (r) { return r.id === 'P208'; });
      if (room) room.status = 'Bảo trì';
      data.misc.vg.checklists[1].status = 'Tạm dừng';
      data.misc.it.services[3].status = 'Cảnh báo';
      data.misc.it.tickets.unshift({ id: 'HD-P1', reporter: 'Lễ tân', priority: 'Khẩn', desc: 'Mạng POS chập chờn sau sự cố điện', sla: '30 phút', status: 'Đã phân công' });
    }
    if (name === 'finance') {
      data.fm.expenses.unshift(
        { id: 'PC-HI-01', maker: 'Thủ quỹ Hương', dept: 'Kỹ thuật', category: 'Sửa hệ thống điện khu Bungalow', amount: 36800000, status: 'Chờ TGĐ duyệt', level: 'TGĐ', invoice: 'HD-KT-P1' },
        { id: 'PC-HI-02', maker: 'Kế toán chi phí', dept: 'F&B', category: 'Nhập hải sản cuối tuần', amount: 9600000, status: 'Chờ KTT duyệt', level: 'KTT', invoice: 'HD-HS-09' }
      );
      data.vt.stock.forEach(function (stock) {
        if (stock.code === 'VT-HAU') {
          stock.onhand = 6;
          stock.status = 'Dưới tối thiểu';
        }
      });
      data.fm.cash[1].checker = 'Chờ người kiểm thứ 2';
    }
    return data;
  }

  function runDemoStep() {
    var step = state.ui.demoStep % DEMO_STEPS.length;
    var message = '';
    if (step === 0) {
      var booking = state.bk.bookings.find(function (b) {
        return ['Đã xác nhận', 'Chờ xác nhận'].indexOf(b.status) >= 0 && b.item.indexOf('Phòng') >= 0;
      });
      var room = state.op.rooms.find(function (r) { return r.status === 'Trống sạch' || r.status === 'Đặt trước'; });
      if (booking && room) {
        var beforeBooking = clone(booking);
        booking.status = 'Check-in';
        room.status = 'Có khách';
        room.guest = booking.guest;
        var checkin = { id: 'CI-DEMO-' + (state.op.checkins.length + 1), guest: booking.guest, booking: booking.id, room: room.id, cccd: 'QR demo script', card: 'Đã giao thẻ', status: 'Đang lưu trú' };
        state.op.checkins.unshift(checkin);
        audit('DEMO_BOOKING_TO_CHECKIN', 'Demo step: ' + DEMO_STEPS[step], beforeBooking, checkin);
        message = 'Demo: đã đẩy booking ' + booking.id + ' vào phòng ' + room.id;
      } else {
        message = 'Demo: không có booking/phòng phù hợp, bỏ qua bước.';
      }
    }
    if (step === 1 || step === 2) {
      var order = state.op.orders.find(function (o) {
        var finalStatus = o.chargeToRoom ? 'Chờ check-out' : 'Đã thanh toán';
        return o.status !== finalStatus;
      });
      if (order) {
        var beforeOrder = clone(order);
        order.status = nextOrderStatus(order);
        if (order.status === 'Đã thanh toán') {
          addRevenue('POS F&B ' + order.id, order.total, 'Chờ đối soát cuối ca');
          deductStockForOrder(order);
        }
        syncTableStatus(order.table);
        audit('DEMO_POS_ADVANCE', 'Demo step: ' + DEMO_STEPS[step], beforeOrder, order);
        message = 'Demo: order ' + order.id + ' chuyển sang ' + order.status;
      } else {
        message = 'Demo: không có order POS cần xử lý.';
      }
    }
    if (step === 3) {
      var ready = state.op.checkins.find(function (ci) { return ci.status === 'Đang lưu trú' && !checkoutBlockers(ci).length; });
      if (ready) {
        var beforeCi = clone(ready);
        var total = checkoutAmount(ready);
        ready.status = 'Đã check-out';
        ready.checkoutTotal = total;
        state.op.checkouts.unshift({ id: 'CO-DEMO-' + (state.op.checkouts.length + 1), checkin: ready.id, guest: ready.guest, room: ready.room, total: total, at: new Date().toISOString() });
        var checkoutRoom = state.op.rooms.find(function (r) { return r.id === ready.room; });
        if (checkoutRoom) { checkoutRoom.status = 'Cần dọn'; checkoutRoom.guest = ''; }
        roomChargeOrders(ready.room).forEach(function (o) { o.status = 'Đã tính tiền'; syncTableStatus(o.table); deductStockForOrder(o); });
        var bk = bookingForCheckin(ready);
        if (bk) bk.status = 'Completed';
        addRevenue('Check-out phòng ' + ready.room, total, 'Chờ đối soát cuối ngày');
        addHousekeepingTask(ready.room);
        audit('DEMO_CHECKOUT', 'Demo step: ' + DEMO_STEPS[step], beforeCi, ready);
        message = 'Demo: đã checkout phòng ' + ready.room + ' và ghi doanh thu.';
      } else {
        message = 'Demo: chưa có phòng đủ điều kiện checkout.';
      }
    }
    if (step === 4) {
      var task = state.op.housekeeping.find(function (item) { return item.inspection !== 'Đạt'; });
      if (task) {
        var beforeTask = clone(task);
        task.inspection = nextHousekeepingStatus(task.inspection);
        if (task.inspection === 'Đang dọn' && task.staff === 'Chưa phân công') task.staff = 'Tổ buồng phòng';
        if (task.inspection === 'Đạt') {
          task.photo = 'Ảnh sau dọn đã nhận';
          var clean = state.op.rooms.find(function (r) { return r.id === task.room; });
          if (clean) clean.status = 'Trống sạch';
        }
        audit('DEMO_HOUSEKEEPING', 'Demo step: ' + DEMO_STEPS[step], beforeTask, task);
        message = 'Demo: buồng phòng ' + task.room + ' chuyển sang ' + task.inspection;
      } else {
        message = 'Demo: không còn việc buồng phòng mở.';
      }
    }
    if (step === 5) {
      var req = state.op.requests.find(function (item) { return item.status !== 'Hoàn tất'; });
      if (req) {
        var beforeReq = clone(req);
        req.status = nextRequestStatus(req.status);
        if (req.status === 'Hoàn tất') req.completedAt = new Date().toISOString();
        audit('DEMO_REQUEST', 'Demo step: ' + DEMO_STEPS[step], beforeReq, req);
        message = 'Demo: yêu cầu ' + req.id + ' chuyển sang ' + req.status;
      } else {
        message = 'Demo: không có yêu cầu đang mở.';
      }
    }
    if (step === 6) {
      location.hash = 'it/health';
      message = 'Demo: mở Health check để rà dữ liệu.';
    } else {
      location.hash = 'op/control';
    }
    state.ui.demoStep = (step + 1) % DEMO_STEPS.length;
    audit('DEMO_STEP_RUN', 'Hoàn tất bước demo ' + (step + 1) + ': ' + DEMO_STEPS[step]);
    persist(message, 'success');
  }

  function role() {
    return ROLES.find(function (item) { return item.id === currentRoleId; }) || ROLES[0];
  }

  function roleFrPrefixes(r) {
    var prefixes = [];
    if (r.orgKey && SOURCE.frMap && SOURCE.frMap[r.orgKey]) prefixes = prefixes.concat(SOURCE.frMap[r.orgKey]);
    if (r.modules) prefixes = prefixes.concat(r.modules);
    if (r.extraModules) prefixes = prefixes.concat(r.extraModules);
    if (r.all) prefixes = MODULES.filter(function (m) { return m.id !== 'hub'; }).map(function (m) { return m.code; });
    return Array.from(new Set(prefixes));
  }

  function roleModules() {
    return roleModulesFor(role());
  }

  function roleModulesFor(r) {
    if (r.all) return MODULES.filter(function (m) { return m.id !== 'hub'; }).map(function (m) { return m.code; });
    var modules = (r.modules || []).slice();
    var prefixes = [];
    if (r.orgKey && SOURCE.frMap && SOURCE.frMap[r.orgKey]) prefixes = prefixes.concat(SOURCE.frMap[r.orgKey]);
    if (r.extraModules) modules = modules.concat(r.extraModules);
    prefixes.forEach(function (p) { if (modules.indexOf(p.slice(0, 2)) < 0) modules.push(p.slice(0, 2)); });
    return modules;
  }

  function renderRoleOptions() {
    var groups = [];
    ROLES.forEach(function (r) {
      if (groups.indexOf(r.group || 'Khác') < 0) groups.push(r.group || 'Khác');
    });
    return groups.map(function (group) {
      var options = ROLES.filter(function (r) { return (r.group || 'Khác') === group; }).map(function (r) {
        return '<option value="' + UI.esc(r.id) + '">' + UI.esc(r.label) + '</option>';
      }).join('');
      return '<optgroup label="' + UI.esc(group) + '">' + options + '</optgroup>';
    }).join('');
  }

  function roleSummary() {
    var r = role();
    var modules = roleModules();
    var prefixes = roleFrPrefixes(r).filter(function (item) { return item.length > 2; });
    return 'Vai trò: ' + r.label + ' · scope ' + r.scope + ' · phân hệ ' + (modules.join(', ') || 'không có') + (prefixes.length ? ' · FR ' + prefixes.slice(0, 8).join(', ') + (prefixes.length > 8 ? '…' : '') : '') + ' · dữ liệu chỉ lưu localStorage';
  }

  function canViewModule(id) {
    if (id === 'hub') return true;
    var mod = MODULES.find(function (m) { return m.id === id; });
    return !!mod && roleModules().indexOf(mod.code) >= 0;
  }

  function canViewScreen(moduleId, view) {
    var r = role();
    if (r.all || r.modules) return canViewModule(moduleId);
    if (!canViewModule(moduleId)) return false;
    var prefixes = roleFrPrefixes(r);
    if (!prefixes.length) return true;
    var needed = SCREEN_PREFIX[moduleId] && SCREEN_PREFIX[moduleId][view] || [];
    if (!needed.length) return true;
    if (prefixMatchesNeed(prefixes, needed)) return true;
    var anySpecificScreen = (SCREENS[moduleId] || []).some(function (screen) {
      var screenNeed = SCREEN_PREFIX[moduleId] && SCREEN_PREFIX[moduleId][screen[0]] || [];
      return prefixMatchesNeed(prefixes, screenNeed);
    });
    return !anySpecificScreen && (SCREENS[moduleId] || [])[0] && (SCREENS[moduleId] || [])[0][0] === view;
  }

  function prefixMatchesNeed(prefixes, needed) {
    return needed.some(function (need) {
      return prefixes.some(function (prefix) {
        return need === prefix || need.indexOf(prefix) === 0 || prefix.indexOf(need) === 0;
      });
    });
  }

  function canApproveExpense() {
    return !!role().canApproveExpense || role().all;
  }

  function canMakeExpense() {
    return role().all || role().canMakeExpense || currentRoleId === 'thu_quy';
  }

  function roleHasPrefix(prefix) {
    var r = role();
    if (r.all) return true;
    return roleFrPrefixes(r).some(function (item) {
      return item === prefix || item.indexOf(prefix) === 0 || prefix.indexOf(item) === 0;
    });
  }

  function canAction(action) {
    if (role().all) return true;
    if (action === 'pos') return roleHasPrefix('OP-FNB');
    if (action === 'checkin') return roleHasPrefix('OP-CHK') || roleHasPrefix('BK-ADM');
    if (action === 'housekeeping') return roleHasPrefix('OP-ROOM');
    if (action === 'request') return roleHasPrefix('OP-SVC');
    if (action === 'expense-create') return canMakeExpense();
    if (action === 'expense-approve') return canApproveExpense();
    if (action === 'booking-checkin') return roleHasPrefix('BK-ADM') || roleHasPrefix('OP-CHK');
    if (action === 'tech') return roleHasPrefix('OP-TECH') || roleHasPrefix('VT-MNT');
    return true;
  }

  function visibleScreens(moduleId) {
    if (!canViewModule(moduleId)) return [];
    return (SCREENS[moduleId] || []).filter(function (screen) { return canViewScreen(moduleId, screen[0]); });
  }

  function parseRoute() {
    var hash = (location.hash || '#op/dashboard').replace(/^#/, '').split('/');
    var moduleId = hash[0] || 'op';
    var moduleScreens = visibleScreens(moduleId);
    var view = hash[1] || ((moduleScreens || [])[0] || ['dashboard'])[0];
    if (!canViewModule(moduleId) || !canViewScreen(moduleId, view)) {
      var first = MODULES.find(function (m) { return canViewModule(m.id); }) || MODULES[0];
      moduleId = first.id;
      view = (visibleScreens(moduleId) || SCREENS[moduleId] || [])[0][0];
      location.hash = moduleId + '/' + view;
    }
    return { moduleId: moduleId, view: view };
  }

  function initControls() {
    var roleSelect = document.getElementById('role-select');
    roleSelect.innerHTML = renderRoleOptions();
    if (!ROLES.some(function (r) { return r.id === currentRoleId; })) currentRoleId = 'admin';
    roleSelect.value = currentRoleId;
    roleSelect.onchange = function () {
      currentRoleId = roleSelect.value;
      localStorage.setItem(ROLE_KEY, currentRoleId);
      var route = parseRoute();
      if (!canViewModule(route.moduleId)) location.hash = firstRoute();
      render();
      UI.toast('Đã chuyển sang vai trò: ' + role().label, 'success');
    };

    var moduleSelect = document.getElementById('module-filter');
    moduleSelect.innerHTML = '<option value="all">Tất cả được phép</option>' + MODULES.map(function (m) {
      return '<option value="' + m.id + '">' + UI.esc(m.label) + '</option>';
    }).join('');
    moduleSelect.value = moduleFilter;
    moduleSelect.onchange = function () {
      moduleFilter = moduleSelect.value;
      localStorage.setItem(MODULE_FILTER_KEY, moduleFilter);
      renderNav(parseRoute());
    };

    document.getElementById('btn-reset').onclick = function () {
      localStorage.removeItem(STORE_KEY);
      state = normalizeState(defaults());
      render();
      UI.toast('Đã đặt lại dữ liệu mock cục bộ', 'success');
    };

    document.getElementById('btn-scenario').onclick = function () {
      var selected = document.getElementById('scenario-select').value;
      state = buildScenario(selected);
      audit('SCENARIO_LOAD', 'Nạp kịch bản demo: ' + selected);
      saveState();
      location.hash = selected === 'finance' ? 'fm/expenses' : 'op/control';
      render();
      UI.toast('Đã nạp kịch bản demo', 'success');
    };

    document.getElementById('btn-demo-step').onclick = function () {
      runDemoStep();
    };

    document.getElementById('btn-export').onclick = function () {
      audit('EXPORT_STATE', 'Xuất dữ liệu mock ra JSON');
      saveState();
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'kdl-prototype-state.json';
      link.click();
      URL.revokeObjectURL(link.href);
      UI.toast('Đã xuất dữ liệu mock JSON', 'success');
    };

    document.getElementById('btn-import').onclick = function () {
      document.getElementById('import-file').click();
    };

    document.getElementById('import-file').onchange = function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          state = normalizeState(JSON.parse(reader.result));
          audit('IMPORT_STATE', 'Nhập dữ liệu mock từ JSON');
          saveState();
          render();
          UI.toast('Đã nhập dữ liệu mock', 'success');
        } catch (err) {
          UI.toast('File JSON không hợp lệ', 'error');
        }
        event.target.value = '';
      };
      reader.readAsText(file, 'utf-8');
    };
  }

  function firstRoute() {
    var first = MODULES.find(function (m) { return canViewModule(m.id); }) || MODULES[0];
    return first.id + '/' + (visibleScreens(first.id) || SCREENS[first.id] || [['dashboard']])[0][0];
  }

  function renderNav(route) {
    var nav = document.getElementById('nav');
    var html = '';
    MODULES.forEach(function (mod) {
      if (moduleFilter !== 'all' && moduleFilter !== mod.id) return;
      var screens = visibleScreens(mod.id);
      if (!screens.length) return;
      html += '<div class="nav-group-title">' + UI.esc(mod.label) + '</div>';
      screens.forEach(function (screen, idx) {
        var active = route.moduleId === mod.id && route.view === screen[0] ? ' active' : '';
        html += '<a class="nav-link' + active + '" href="#' + mod.id + '/' + screen[0] + '">' +
          '<span class="nav-dot">' + (idx + 1) + '</span><span>' + UI.esc(screen[1]) + '</span></a>';
      });
    });
    nav.innerHTML = html || '<div class="empty">Vai trò này chưa có màn hình được cấp.</div>';
  }

  function page(moduleId, view, body, extra) {
    var mod = MODULES.find(function (m) { return m.id === moduleId; });
    var screen = (SCREENS[moduleId] || []).find(function (s) { return s[0] === view; }) || [view, view];
    document.getElementById('screen-title').textContent = mod.label + ' · ' + screen[1];
    document.getElementById('screen-subtitle').textContent = roleSummary();
    return '<div class="page"><div class="page-head"><div><div class="eyebrow">' + mod.code + ' · ' + UI.esc(mod.label) + '</div><h1>' + UI.esc(screen[1]) + '</h1><p class="page-desc">' + UI.esc(extra || 'Prototype mock UI thuần frontend, tái sử dụng FR/NFR/schema từ charts_html và dữ liệu vận hành giả.') + '</p></div></div>' +
      UI.tabs(visibleScreens(moduleId).map(function (s) { return { id: s[0], label: s[1] }; }), view, '#' + moduleId) + body + renderFrPanel(mod.code) + '</div>';
  }

  function renderFrPanel(code) {
    var reqs = Object.keys(SOURCE.reqs || {}).map(function (key) { return Object.assign({ code: key }, SOURCE.reqs[key]); }).filter(function (r) { return r.module === code; }).slice(0, 8);
    if (!reqs.length) return '';
    return UI.panel('FR tham chiếu từ charts_html/data/reqs-data.js', '<div class="fr-list">' + reqs.map(function (r) {
      var tone = r.priority === 'P1' ? 'red' : (r.priority === 'P2' ? 'yellow' : 'gray');
      return '<div class="fr-item"><div><span class="fr-code">' + UI.esc(r.code) + '</span> ' + UI.badge(r.priority, tone) + '</div><div class="fr-name">' + UI.esc(r.name) + '</div><div class="fr-desc">' + UI.esc(r.desc) + '</div></div>';
    }).join('') + '</div>');
  }

  function bookingForCheckin(checkin) {
    return state.bk.bookings.find(function (b) { return b.id === checkin.booking; });
  }

  function roomMiniBar(roomNo) {
    var room = state.op.rooms.find(function (r) { return r.id === roomNo; });
    return room ? (room.minibar || 0) : 0;
  }

  function roomChargeOrders(roomNo) {
    return state.op.orders.filter(function (o) {
      return o.chargeToRoom && o.guest === 'Phòng ' + roomNo && o.status !== 'Đã tính tiền';
    });
  }

  function checkoutAmount(checkin) {
    return checkoutBreakdown(checkin).total;
  }

  function checkoutBreakdown(checkin) {
    var booking = bookingForCheckin(checkin);
    var roomAmount = booking ? booking.total : 1850000;
    var fnb = roomChargeOrders(checkin.room).reduce(function (sum, order) { return sum + order.total; }, 0);
    var minibar = roomMiniBar(checkin.room);
    var subtotal = roomAmount + fnb + minibar;
    var vat = Math.round(subtotal * 0.1);
    return { room: roomAmount, fnb: fnb, minibar: minibar, subtotal: subtotal, vat: vat, total: subtotal + vat };
  }

  function checkoutBlockers(checkin) {
    var blockers = [];
    var pendingOrders = roomChargeOrders(checkin.room).filter(function (order) {
      return ['Đang bếp', 'Đã phục vụ'].indexOf(order.status) >= 0;
    });
    if (pendingOrders.length) blockers.push('Còn ' + pendingOrders.length + ' order F&B chưa chuyển sang Chờ check-out.');
    var room = state.op.rooms.find(function (r) { return r.id === checkin.room; });
    if (!room || room.status !== 'Có khách') blockers.push('Phòng không còn ở trạng thái Có khách.');
    return blockers;
  }

  function slaInfo(request) {
    var elapsed = Math.floor((Date.now() - new Date(request.openedAt).getTime()) / 60000);
    var remain = (request.dueMin || 30) - elapsed;
    return {
      elapsed: Math.max(0, elapsed),
      remain: remain,
      text: remain >= 0 ? 'Còn ' + remain + ' phút' : 'Trễ ' + Math.abs(remain) + ' phút',
      tone: remain < 0 ? 'red' : (remain <= 10 ? 'yellow' : 'green')
    };
  }

  function nextHousekeepingStatus(status) {
    var flow = ['Chờ dọn', 'Đang dọn', 'Chờ kiểm', 'Đạt'];
    var normalized = status === 'Không đạt' ? 'Đang dọn' : status;
    var index = flow.indexOf(normalized);
    return flow[Math.min(index + 1, flow.length - 1)] || 'Đang dọn';
  }

  function nextRequestStatus(status) {
    if (status === 'Hoàn tất') return 'Hoàn tất';
    if (status === 'Đang xử lý') return 'Hoàn tất';
    return 'Đang xử lý';
  }

  function nextOrderStatus(order) {
    var flow = ['Đang bếp', 'Đã phục vụ', 'Chờ thanh toán', 'Đã thanh toán'];
    if (order.chargeToRoom) flow = ['Đang bếp', 'Đã phục vụ', 'Chờ check-out'];
    var index = flow.indexOf(order.status);
    return flow[Math.min(index + 1, flow.length - 1)] || flow[0];
  }

  function syncTableStatus(tableId) {
    var table = state.op.tables.find(function (t) { return t.id === tableId; });
    if (!table) return;
    var active = state.op.orders.some(function (o) {
      return o.table === tableId && ['Đang bếp', 'Đã phục vụ', 'Chờ thanh toán', 'Chờ check-out'].indexOf(o.status) >= 0;
    });
    table.status = active ? 'Đang phục vụ' : 'Trống';
  }

  function deductStockForOrder(order) {
    order.items.forEach(function (name) {
      var stockCode = name.indexOf('Hàu') >= 0 || name.indexOf('Gỏi cá') >= 0 ? 'VT-HAU' : (name.indexOf('Cu đơ') >= 0 ? 'VT-CUDO' : '');
      if (!stockCode) return;
      var stock = state.vt.stock.find(function (s) { return s.code === stockCode; });
      if (stock) {
        stock.onhand = Math.max(0, stock.onhand - 1);
        stock.status = stock.onhand < stock.min ? 'Dưới tối thiểu' : (stock.onhand <= stock.min + 5 ? 'Cận mức' : 'Đủ');
      }
    });
    state.vt.exports.unshift({ id: 'PX-POS-' + (state.vt.exports.length + 1), item: order.items.join(', '), dept: 'F&B', qty: order.items.length, status: 'Tự trừ theo POS' });
  }

  function addRevenue(source, amount, status) {
    state.fm.revenues.unshift({ source: source, amount: amount, date: todayText(), status: status || 'Chờ đối soát' });
  }

  function addHousekeepingTask(roomNo) {
    var exists = state.op.housekeeping.some(function (task) { return task.room === roomNo && task.inspection !== 'Đạt'; });
    if (!exists) {
      state.op.housekeeping.unshift({ room: roomNo, staff: 'Chưa phân công', shift: 'Sáng 06-14', inspection: 'Chờ dọn', photo: 'Chưa có ảnh' });
    }
  }

  function render() {
    var route = parseRoute();
    renderNav(route);
    var app = document.getElementById('app');
    var mod = route.moduleId;
    if (mod === 'hub') app.innerHTML = renderHUB(route.view);
    if (mod === 'op') app.innerHTML = renderOP(route.view);
    if (mod === 'bk') app.innerHTML = renderBK(route.view);
    if (mod === 'hr') app.innerHTML = renderHR(route.view);
    if (mod === 'fm') app.innerHTML = renderFM(route.view);
    if (mod === 'vt') app.innerHTML = renderVT(route.view);
    if (mod === 'sp') app.innerHTML = renderSP(route.view);
    if (mod === 'vg') app.innerHTML = renderVG(route.view);
    if (mod === 'nt') app.innerHTML = renderNT(route.view);
    if (mod === 'it') app.innerHTML = renderIT(route.view);
  }

  function renderHUB(view) {
    var body = '';
    if (view === 'workflows') body = renderWorkflowOverview();
    if (view === 'workcenter') body = renderWorkCenter();
    if (view === 'roles') body = renderRoleConsole();
    if (view === 'modules') body = renderModuleMap();
    if (view === 'journey') body = renderDemoJourney();
    return page('hub', view, body, 'Lớp điều phối hi-fi: nhìn nhanh hàng đợi, role, quyền, phân hệ và luồng nghiệp vụ end-to-end của toàn khu.');
  }

  function workflowCatalog() {
    return [
      {
        id: 'W1',
        title: 'Bán dịch vụ → Đặt chỗ → Check-in',
        group: 'Bán & đón khách',
        modules: ['BK','OP','FM'],
        objective: 'Biến nhu cầu của khách thành booking hợp lệ, giữ chỗ/phòng và tạo dữ liệu doanh thu để đối soát.',
        output: 'Booking confirmed, payment/deposit, QR check-in, room assigned.',
        steps: ['Khách xem dịch vụ', 'Kiểm tra availability và lock tạm', 'Nhập thông tin/voucher', 'Thanh toán hoặc pay-at-resort', 'Gửi QR', 'Lễ tân check-in', 'Đẩy dữ liệu sang FM'],
        decisions: ['Lock phòng/slot bao lâu?', 'Pay-at-resort có cần duyệt?', 'No-show tính phí thế nào?', 'Booking đã check-in còn sửa gì được?'],
        fr: ['BK-AUTH','BK-CAT','BK-ORD','BK-PAY','BK-BOOK','BK-ADM','OP-CHK','OP-ROOM','FM-REV'],
        link: '#bk/orders',
        tone: 'blue'
      },
      {
        id: 'W2',
        title: 'Lưu trú → Dịch vụ phát sinh → Checkout',
        group: 'Phục vụ & thu tiền',
        modules: ['OP','FM','SP','VG','NT'],
        objective: 'Gom toàn bộ chi phí phát sinh trong thời gian khách lưu trú/sử dụng dịch vụ vào một quy trình thanh toán rõ ràng.',
        output: 'Hóa đơn tổng, doanh thu ghi nhận, phòng chuyển cần dọn.',
        steps: ['Khách đang lưu trú', 'POS/dịch vụ ghi order', 'Chọn trả tại chỗ hoặc charge-to-room', 'Treo chi phí vào hồ sơ lưu trú', 'Checkout gom phí', 'Kiểm tra blocker', 'Ghi doanh thu và chuyển phòng cần dọn'],
        decisions: ['Dịch vụ nào được charge-to-room?', 'Ai được override checkout blocker?', 'VAT xuất theo booking hay từng dịch vụ?', 'Doanh thu ghi nhận lúc nào?'],
        fr: ['OP-FNB','OP-CHK','SP-BOOK','VG-OPS','NT-SCH','FM-REV','FM-TAX','VT-EXP'],
        link: '#op/checkin',
        tone: 'green'
      },
      {
        id: 'W3',
        title: 'Buồng phòng → Trạng thái phòng → Bán lại',
        group: 'Quay vòng phòng',
        modules: ['OP','HR','BK'],
        objective: 'Rút ngắn thời gian từ checkout đến phòng sẵn sàng bán lại, có kiểm tra chất lượng và audit.',
        output: 'Room status Trống sạch, task audit, availability cập nhật.',
        steps: ['Checkout tạo task dọn', 'Phòng về trạng thái cần dọn', 'Tổ trưởng phân công', 'Nhân viên dọn và gửi ảnh', 'Kiểm phòng đạt/không đạt', 'Đạt thì chuyển trống sạch', 'BK có thể bán lại'],
        decisions: ['Ai được chuyển phòng sang trống sạch?', 'Có bắt buộc ảnh sau dọn?', 'Không đạt escalation cho ai?', 'BK/OP đồng bộ một chiều hay hai chiều?'],
        fr: ['OP-ROOM','OP-CHK','HR-ATT','BK-ADM'],
        link: '#op/housekeeping',
        tone: 'teal'
      },
      {
        id: 'W4',
        title: 'Yêu cầu/Khiếu nại/Sự cố → SLA',
        group: 'Chất lượng dịch vụ',
        modules: ['OP','VT','IT'],
        objective: 'Bảo đảm mọi yêu cầu hoặc sự cố có người chịu trách nhiệm, SLA, escalation và bằng chứng xử lý.',
        output: 'Ticket hoàn tất, SLA log, escalation log.',
        steps: ['Tiếp nhận yêu cầu/sự cố', 'Phân loại', 'Gán mức ưu tiên và SLA', 'Phân công xử lý', 'Cập nhật tiến độ/bằng chứng', 'Escalate nếu trễ/nghiêm trọng', 'Đóng ticket và báo cáo'],
        decisions: ['SLA từng loại là bao lâu?', 'Cấp nào báo quản lý/TGĐ?', 'Khiếu nại có bù trừ/hoàn tiền không?', 'Ticket đóng có cần khách xác nhận?'],
        fr: ['OP-SVC','OP-TECH','OP-SEC','VT-MNT','IT-HLP','OP-RPT'],
        link: '#op/requests',
        tone: 'red'
      },
      {
        id: 'W5',
        title: 'Tồn kho/Bảo trì → Đề xuất → Duyệt chi',
        group: 'Kiểm soát chi phí',
        modules: ['VT','FM','OP'],
        objective: 'Kiểm soát mua sắm, xuất kho, bảo trì và chi phí bằng maker-checker rõ ràng.',
        output: 'Phiếu nhập/xuất/bảo trì, phiếu chi, stock ledger.',
        steps: ['Cảnh báo tồn hoặc tài sản cần sửa', 'Tạo đề xuất', 'Lấy báo giá/NCC', 'FM tạo phiếu chi/PO', 'Duyệt theo ngưỡng', 'Nhập/xuất/sửa hoàn tất', 'Chi phí vào P&L'],
        decisions: ['Định mức tồn theo ca/ngày/tháng?', 'Ngưỡng KTT/TGĐ là bao nhiêu?', 'Thu kho có được tự duyệt không?', 'F&B trừ kho theo order hay theo ca?'],
        fr: ['VT-CAT','VT-IMP','VT-EXP','VT-STK','VT-MNT','VT-PRO','FM-BUD','FM-EXP','FM-ACC'],
        link: '#vt/stock',
        tone: 'yellow'
      },
      {
        id: 'W6',
        title: 'Nhân sự/CTV → Ca làm → Lương/Thù lao',
        group: 'Nguồn lực',
        modules: ['HR','FM','NT','IT'],
        objective: 'Quản lý nhân viên, CTV, nghệ nhân, ca làm, chấm công, lương, thuế và vòng đời quyền truy cập.',
        output: 'Payroll, payslip, CTV payout, tax records.',
        steps: ['Tạo hồ sơ/hợp đồng', 'Xếp ca', 'Chấm công/nghỉ phép', 'Duyệt sửa công/phép', 'Tính lương/thù lao', 'KTT duyệt kỳ lương', 'Phát phiếu và ghi thuế'],
        decisions: ['NV chỉ xem dữ liệu gì của mình?', 'Ai được sửa chấm công?', 'Tăng ca/ngày lễ tính thế nào?', 'CTV tính tiền theo buổi hay hợp đồng?'],
        fr: ['HR-EMP','HR-ATT','HR-LEA','HR-SAL','HR-CTV','NT-CON','FM-TAX','IT-SEC'],
        link: '#hr/dashboard',
        tone: 'purple'
      },
      {
        id: 'W7',
        title: 'Phân quyền → Audit → Uptime/Backup',
        group: 'Nền kiểm soát',
        modules: ['IT','CORE','ALL'],
        objective: 'Đảm bảo đúng người, đúng quyền, truy vết được thao tác và duy trì hệ thống 24/7.',
        output: 'Role/permission, audit log, uptime/backup evidence.',
        steps: ['Tạo user theo vị trí', 'Seed quyền từ FR_MAP', 'PoliciesGuard kiểm tra quyền', 'Ghi audit mọi thao tác', 'Theo dõi uptime/helpdesk', 'Backup và test restore', 'Review quyền định kỳ'],
        decisions: ['Role đặc biệt nào ngoài org-chart?', '2FA bắt buộc cho ai?', 'Audit log lưu bao lâu?', 'RPO/RTO cho PMS/POS/BK là bao nhiêu?'],
        fr: ['IT-INF','IT-HLP','IT-SEC','IT-BAK','HR-EMP-05','CORE-RBAC','CORE-AUDIT'],
        link: '#it/access',
        tone: 'blue'
      }
    ];
  }

  function renderWorkflowOverview() {
    var flows = workflowCatalog();
    var allModules = Array.from(new Set(flows.reduce(function (acc, flow) { return acc.concat(flow.modules); }, [])));
    var body = '<section class="workflow-hero"><div><div class="eyebrow">BA workflow map</div><h2>7 workflow xương sống cho 179 FR</h2><p>Khách hàng không cần duyệt từng chức năng rời rạc. BA dùng màn này để chốt luồng nghiệp vụ, rule, điểm duyệt và ngoại lệ trước khi bung thành backlog implement.</p></div><div class="workflow-hero-actions"><a class="btn btn-primary" href="#hub/workcenter">Mở Work Center</a><a class="btn btn-ghost" href="#hub/modules">Bản đồ phân hệ</a><a class="btn btn-ghost" href="#hub/roles">Vai trò & quyền</a></div></section>';
    body += UI.kpi([
      { label: 'Workflow chính', value: flows.length, note: 'gom toàn bộ vận hành', tone: 'blue' },
      { label: 'FR được gom', value: Object.keys(SOURCE.reqs || {}).length || 179, note: 'không demo theo từng dòng', tone: 'green' },
      { label: 'Module tham gia', value: allModules.length, note: allModules.join(', '), tone: 'teal' },
      { label: 'Câu hỏi BA', value: flows.reduce(function (sum, flow) { return sum + flow.decisions.length; }, 0), note: 'cần chốt với khách', tone: 'yellow' }
    ]);
    body += '<div class="workflow-grid">' + flows.map(function (flow) {
      return '<section class="workflow-card workflow-' + UI.esc(flow.tone) + '">' +
        '<div class="workflow-card-head"><span>' + UI.esc(flow.id) + '</span>' + UI.badge(flow.group, flow.tone === 'purple' ? 'purple' : flow.tone) + '</div>' +
        '<h3>' + UI.esc(flow.title) + '</h3>' +
        '<p>' + UI.esc(flow.objective) + '</p>' +
        '<div class="workflow-modules">' + flow.modules.map(function (m) { return '<span>' + UI.esc(m) + '</span>'; }).join('') + '</div>' +
        '<div class="workflow-output"><b>Output</b><br>' + UI.esc(flow.output) + '</div>' +
        '<div class="workflow-actions"><button class="btn btn-primary" data-action="open-workflow-detail" data-id="' + flow.id + '" type="button">Chi tiết BA</button><a class="btn btn-ghost" href="' + flow.link + '">Mở module</a></div>' +
      '</section>';
    }).join('') + '</div>';
    body += UI.panel('Cách dùng trong workshop', '<div class="timeline">' +
      '<div class="slot"><b>1</b><div>Chạy W1 → W2 → W3 để khách thấy dòng tiền, checkout và quay vòng phòng.</div><span>' + UI.badge('Core', 'blue') + '</span></div>' +
      '<div class="slot"><b>2</b><div>Chạy W4 → W5 → W6 để chốt kiểm soát nội bộ: SLA, chi phí, nhân sự.</div><span>' + UI.badge('Control', 'yellow') + '</span></div>' +
      '<div class="slot"><b>3</b><div>Chạy W7 để chốt phân quyền, audit, uptime và backup trước khi implement thật.</div><span>' + UI.badge('Foundation', 'teal') + '</span></div>' +
    '</div>');
    return body;
  }

  function openWorkflowModal(id) {
    var flow = workflowCatalog().find(function (item) { return item.id === id; });
    if (!flow) return;
    var body = '<div class="workflow-detail-head"><div>' + flow.modules.map(function (m) { return '<span>' + UI.esc(m) + '</span>'; }).join('') + '</div><p>' + UI.esc(flow.objective) + '</p></div>' +
      '<div class="grid-2">' +
      UI.panel('Bước chính', '<div class="flow-steps">' + flow.steps.map(function (step, index) {
        return '<div class="flow-step"><span>' + (index + 1) + '</span><b>' + UI.esc(step) + '</b></div>';
      }).join('') + '</div>') +
      UI.panel('Điểm BA cần chốt', '<div class="decision-list">' + flow.decisions.map(function (d) { return '<div>' + UI.esc(d) + '</div>'; }).join('') + '</div>') +
      UI.panel('FR liên quan', '<div class="fr-chip-row">' + flow.fr.map(function (fr) { return '<span>' + UI.esc(fr) + '</span>'; }).join('') + '</div>') +
      UI.panel('Output nghiệm thu', '<div class="note">' + UI.esc(flow.output) + '</div>') +
      '</div>';
    UI.modal(flow.id + ' · ' + flow.title, body, '<a class="btn btn-ghost" href="' + flow.link + '" data-close-modal>Mở module</a><button class="btn btn-primary" data-close-modal type="button">Đóng</button>');
  }

  function roleHasPrefixFor(r, prefix) {
    if (r.all) return true;
    return roleFrPrefixes(r).some(function (item) {
      return item === prefix || item.indexOf(prefix) === 0 || prefix.indexOf(item) === 0;
    });
  }

  function canActionFor(r, action) {
    if (r.all) return true;
    if (action === 'pos') return roleHasPrefixFor(r, 'OP-FNB');
    if (action === 'checkin') return roleHasPrefixFor(r, 'OP-CHK') || roleHasPrefixFor(r, 'BK-ADM');
    if (action === 'housekeeping') return roleHasPrefixFor(r, 'OP-ROOM');
    if (action === 'request') return roleHasPrefixFor(r, 'OP-SVC');
    if (action === 'expense-create') return !!r.canMakeExpense || r.id === 'thu_quy';
    if (action === 'expense-approve') return !!r.canApproveExpense;
    if (action === 'booking-checkin') return roleHasPrefixFor(r, 'BK-ADM') || roleHasPrefixFor(r, 'OP-CHK');
    if (action === 'tech') return roleHasPrefixFor(r, 'OP-TECH') || roleHasPrefixFor(r, 'VT-MNT');
    return true;
  }

  function reqCountForModule(code) {
    return Object.keys(SOURCE.reqs || {}).filter(function (key) {
      return SOURCE.reqs[key] && SOURCE.reqs[key].module === code;
    }).length;
  }

  function orgName(key) {
    return SOURCE.toData && SOURCE.toData[key] ? SOURCE.toData[key].name : key;
  }

  function renderRoleConsole() {
    var current = role();
    var modules = MODULES.filter(function (m) { return m.id !== 'hub'; });
    var allowedCodes = roleModulesFor(current);
    var prefixes = roleFrPrefixes(current).filter(function (p) { return p.length > 2; });
    var actions = [
      ['pos', 'POS F&B'], ['checkin', 'Check-in/out'], ['housekeeping', 'Buồng phòng'],
      ['request', 'SLA yêu cầu'], ['booking-checkin', 'Booking → Check-in'],
      ['expense-create', 'Lập phiếu chi'], ['expense-approve', 'Duyệt chi'], ['tech', 'Đóng sự cố']
    ];
    var moduleRows = modules.map(function (m) {
      var visible = visibleScreens(m.id).length;
      var total = (SCREENS[m.id] || []).length;
      var teams = (m.org || []).slice(0, 3).map(orgName).join(', ');
      return {
        code: m.code,
        label: m.label,
        access: allowedCodes.indexOf(m.code) >= 0,
        screens: visible + '/' + total,
        fr: reqCountForModule(m.code),
        teams: teams + ((m.org || []).length > 3 ? ' +' + ((m.org || []).length - 3) : '')
      };
    });
    var roleRows = ROLES.map(function (r) {
      var mods = roleModulesFor(r).join(', ');
      var pfx = roleFrPrefixes(r).filter(function (p) { return p.length > 2; }).slice(0, 5).join(', ');
      return {
        id: r.id,
        group: r.group || 'Khác',
        role: r.label,
        scope: r.scope,
        modules: r.all ? 'ALL' : mods,
        prefixes: pfx + (roleFrPrefixes(r).length > 5 ? '...' : '')
      };
    });
    return UI.kpi([
      { label: 'Role đang chọn', value: current.label, note: 'scope ' + current.scope, tone: 'blue' },
      { label: 'Phân hệ được cấp', value: allowedCodes.length, note: allowedCodes.join(', ') || 'chưa có', tone: 'green' },
      { label: 'FR prefix', value: prefixes.length, note: prefixes.slice(0, 3).join(', ') || 'module-level', tone: 'teal' },
      { label: 'Tổng role', value: ROLES.length, note: ROLES.filter(function (r) { return r.generated; }).length + ' sinh từ FR_MAP', tone: 'yellow' }
    ]) +
    '<div class="grid-2">' +
      UI.panel('Hồ sơ vai trò', '<div class="role-profile"><div><b>' + UI.esc(current.label) + '</b><p>' + UI.esc(roleSummary()) + '</p></div><div class="permission-grid">' + actions.map(function (item) {
        var allowed = canActionFor(current, item[0]);
        return '<div class="permission-item"><span>' + UI.esc(item[1]) + '</span>' + UI.badge(allowed ? 'Cho phép' : 'Khóa', allowed ? 'green' : 'gray') + '</div>';
      }).join('') + '</div></div>') +
      UI.panel('Phân hệ theo vai trò hiện tại', UI.table([
        { label: 'Mã', key: 'code' },
        { label: 'Phân hệ', key: 'label' },
        { label: 'Truy cập', render: function (r) { return UI.badge(r.access ? 'Có' : 'Không', r.access ? 'green' : 'gray'); } },
        { label: 'Màn hình', key: 'screens' },
        { label: 'FR', key: 'fr' },
        { label: 'Tổ phụ trách', key: 'teams' }
      ], moduleRows)) +
    '</div>' +
    UI.panel('Danh mục toàn bộ role', UI.table([
      { label: 'Chọn', render: function (r) { return '<button class="btn btn-primary" data-action="set-role" data-id="' + UI.esc(r.id) + '" type="button">Chọn</button>'; } },
      { label: 'Nhóm', key: 'group' },
      { label: 'Vai trò', key: 'role' },
      { label: 'Scope', render: function (r) { return UI.badge(r.scope, r.scope === 'all' ? 'green' : (r.scope === 'own' ? 'purple' : 'blue')); } },
      { label: 'Phân hệ', key: 'modules' },
      { label: 'FR prefix', key: 'prefixes' }
    ], roleRows));
  }

  function renderModuleMap() {
    var currentCodes = roleModules();
    var cards = MODULES.filter(function (m) { return m.id !== 'hub'; }).map(function (m) {
      var screens = (SCREENS[m.id] || []).map(function (s) {
        var active = canViewScreen(m.id, s[0]);
        return '<span class="screen-pill ' + (active ? 'screen-on' : 'screen-off') + '">' + UI.esc(s[1]) + '</span>';
      }).join('');
      var teams = (m.org || []).map(function (key) {
        return '<span class="team-chip">' + UI.esc(orgName(key)) + '</span>';
      }).join('');
      var schemaCount = SOURCE.schema && SOURCE.schema[m.code] ? SOURCE.schema[m.code].length : 0;
      return '<section class="module-card">' +
        '<div class="module-card-head"><div><span>' + UI.esc(m.code) + '</span><h3>' + UI.esc(m.label) + '</h3></div>' + UI.badge(currentCodes.indexOf(m.code) >= 0 ? 'Role thấy' : 'Role khóa', currentCodes.indexOf(m.code) >= 0 ? 'green' : 'gray') + '</div>' +
        '<div class="module-metrics"><b>' + reqCountForModule(m.code) + '</b><small>FR</small><b>' + schemaCount + '</b><small>Entity</small><b>' + (SCREENS[m.id] || []).length + '</b><small>Màn</small></div>' +
        '<div class="screen-pills">' + screens + '</div>' +
        '<div class="team-row">' + (teams || '<span class="team-chip">Điều phối chung</span>') + '</div>' +
      '</section>';
    }).join('');
    return UI.kpi([
      { label: 'Phân hệ nghiệp vụ', value: MODULES.length - 1, note: 'không tính lớp Điều phối', tone: 'blue' },
      { label: 'Màn hình mock', value: Object.keys(SCREENS).reduce(function (sum, key) { return key === 'hub' ? sum : sum + SCREENS[key].length; }, 0), note: 'đã map theo RBAC', tone: 'green' },
      { label: 'FR đã nạp', value: Object.keys(SOURCE.reqs || {}).length, note: 'charts_html/data', tone: 'teal' },
      { label: 'Role đang thấy', value: currentCodes.length, note: role().label, tone: 'yellow' }
    ]) + '<div class="module-map">' + cards + '</div>';
  }

  function renderDemoJourney() {
    var flows = [
      { name: 'Khách đặt phòng đến checkout', steps: ['BK xác nhận', 'OP check-in', 'POS charge phòng', 'FM ghi doanh thu', 'HK dọn phòng'], link: '#hub/workcenter' },
      { name: 'SLA khiếu nại phòng', steps: ['Lễ tân nhận yêu cầu', 'Phân công kỹ thuật', 'Theo dõi SLA', 'Hoàn tất/audit'], link: '#op/requests' },
      { name: 'Mua hàng và kiểm soát chi', steps: ['VT cảnh báo tồn', 'Kho lập đề xuất', 'FM lập phiếu chi', 'KTT/TGĐ duyệt'], link: '#fm/expenses' },
      { name: 'Nhân sự theo scope', steps: ['HR lập ca', 'NV self-service', 'Quản lý duyệt phép', 'Kế toán khóa lương'], link: '#hr/dashboard' }
    ];
    return '<div class="flow-map">' + flows.map(function (flow) {
      return '<section class="flow-card"><div class="flow-title"><h3>' + UI.esc(flow.name) + '</h3><a class="btn btn-ghost" href="' + flow.link + '">Mở</a></div><div class="flow-steps">' + flow.steps.map(function (step, index) {
        return '<div class="flow-step"><span>' + (index + 1) + '</span><b>' + UI.esc(step) + '</b></div>';
      }).join('') + '</div></section>';
    }).join('') + '</div>' +
    UI.panel('Kịch bản demo khuyến nghị', '<div class="timeline">' + DEMO_STEPS.map(function (label, index) {
      return '<div class="slot"><b>Bước ' + (index + 1) + '</b><div>' + UI.esc(label) + '</div><span>' + UI.badge(index === state.ui.demoStep ? 'Tiếp theo' : 'Chờ', index === state.ui.demoStep ? 'teal' : 'gray') + '</span></div>';
    }).join('') + '</div>', '<button class="btn btn-primary" data-action="run-demo-step" type="button">Chạy bước tiếp</button>');
  }

  function renderOP(view) {
    var op = state.op;
    var occupied = op.rooms.filter(function (r) { return r.status === 'Có khách'; }).length;
    var clean = op.rooms.filter(function (r) { return r.status === 'Trống sạch'; }).length;
    var issues = op.techTickets.filter(function (t) { return t.status !== 'Đã đóng'; }).length;
    var body = UI.kpi([
      { label: 'Công suất phòng', value: Math.round(occupied / op.rooms.length * 100) + '%', note: occupied + '/' + op.rooms.length + ' phòng có khách', tone: 'green' },
      { label: 'Phòng trống sạch', value: clean, note: 'sẵn sàng bán', tone: 'blue' },
      { label: 'RevPAR hôm nay', value: '1,42tr', note: 'ADR 1,88tr', tone: 'teal' },
      { label: 'SLA đỏ/vàng', value: issues, note: 'sự cố kỹ thuật mở', tone: issues ? 'red' : 'green' }
    ]);
    if (view === 'dashboard') body += renderWorkflowSummary();
    if (view === 'workcenter') body += renderWorkCenter();
    if (view === 'control') body += renderOpsControl();
    if (view === 'rooms' || view === 'dashboard') body += renderRooms();
    if (view === 'housekeeping') body += renderHousekeeping();
    if (view === 'pos') body += renderPOS();
    if (view === 'checkin') body += renderCheckin();
    if (view === 'requests') body += renderRequests();
    if (view === 'tech') body += renderTech();
    if (view === 'security') body += renderSecurity();
    if (view === 'reports') body += renderOpReports();
    return page('op', view, body, 'Ưu tiên khối vận hành: sơ đồ phòng, POS, check-in/out, SLA, kỹ thuật, an ninh và báo cáo ngày.');
  }

  function renderRooms() {
    var floors = Array.from(new Set(state.op.rooms.map(function (r) { return r.floor; }))).sort();
    var statusOptions = ['all', 'Trống sạch', 'Có khách', 'Cần dọn', 'Bảo trì', 'Đặt trước'].map(function (s) {
      return '<option value="' + UI.esc(s) + '"' + (state.ui.roomStatus === s ? ' selected' : '') + '>' + (s === 'all' ? 'Tất cả trạng thái' : UI.esc(s)) + '</option>';
    }).join('');
    var floorOptions = '<option value="all">Tất cả tầng</option>' + floors.map(function (f) {
      return '<option value="' + f + '"' + (String(state.ui.roomFloor) === String(f) ? ' selected' : '') + '>Tầng ' + f + '</option>';
    }).join('');
    var filtered = state.op.rooms.filter(function (r) {
      var okStatus = state.ui.roomStatus === 'all' || r.status === state.ui.roomStatus;
      var okFloor = state.ui.roomFloor === 'all' || String(r.floor) === String(state.ui.roomFloor);
      return okStatus && okFloor;
    });
    var filters = '<div class="form-grid"><div class="field"><label>Trạng thái</label><select data-action="set-room-status">' + statusOptions + '</select></div><div class="field"><label>Tầng</label><select data-action="set-room-floor">' + floorOptions + '</select></div></div><br>';
    var grid = filtered.length ? '<div class="room-grid">' + filtered.map(function (r) {
      var tone = { 'Trống sạch': 'empty', 'Có khách': 'occupied', 'Cần dọn': 'clean', 'Bảo trì': 'maintenance', 'Đặt trước': 'reserved' }[r.status];
      return '<button class="room-tile" data-action="cycle-room" data-room="' + r.id + '" type="button"><div class="room-no">' + r.id + '</div><div class="room-type">' + UI.esc(r.type) + '</div><span class="room-status status-' + tone + '">' + UI.esc(r.status) + '</span><div class="fnb-seat">' + UI.esc(r.guest || r.housekeeper) + '</div></button>';
    }).join('') + '</div>' : '<div class="empty">Không có phòng theo bộ lọc</div>';
    return UI.panel('Sơ đồ buồng phòng real-time', '<div class="note">Bấm vào phòng để đổi trạng thái theo vòng Trống sạch → Có khách → Cần dọn → Bảo trì → Đặt trước.</div><br>' + filters + grid);
  }

  function renderWorkflowSummary() {
    var activeStay = state.op.checkins.filter(function (c) { return c.status === 'Đang lưu trú'; }).length;
    var pendingKitchen = state.op.orders.filter(function (o) { return o.status === 'Đang bếp'; }).length;
    var pendingCheckout = state.op.orders.filter(function (o) { return o.status === 'Chờ check-out'; }).length;
    var cleaning = state.op.housekeeping.filter(function (h) { return h.inspection !== 'Đạt'; }).length;
    return UI.panel('Luồng vận hành liên module', '<div class="timeline">' +
      '<div class="slot"><b>BK → OP</b><div class="progress"><span style="width:' + Math.min(100, activeStay * 18) + '%"></span></div><span>' + activeStay + ' lưu trú</span></div>' +
      '<div class="slot"><b>POS → Bếp</b><div class="progress"><span style="width:' + Math.min(100, pendingKitchen * 28) + '%"></span></div><span>' + pendingKitchen + ' order</span></div>' +
      '<div class="slot"><b>Charge phòng</b><div class="progress"><span style="width:' + Math.min(100, pendingCheckout * 30) + '%"></span></div><span>' + pendingCheckout + ' chờ</span></div>' +
      '<div class="slot"><b>Checkout → HK</b><div class="progress"><span style="width:' + Math.min(100, cleaning * 12) + '%"></span></div><span>' + cleaning + ' việc dọn</span></div>' +
    '</div>');
  }

  function renderOpsControl() {
    var bookingRows = state.bk.bookings.filter(function (booking) {
      return ['Đã xác nhận', 'Chờ xác nhận'].indexOf(booking.status) >= 0 && booking.item.indexOf('Phòng') >= 0;
    }).slice(0, 5);
    var readyCheckout = state.op.checkins.filter(function (ci) {
      return ci.status === 'Đang lưu trú' && !checkoutBlockers(ci).length;
    });
    var blockedCheckout = state.op.checkins.filter(function (ci) {
      return ci.status === 'Đang lưu trú' && checkoutBlockers(ci).length;
    });
    var activeOrders = state.op.orders.filter(function (order) {
      return ['Đang bếp', 'Đã phục vụ', 'Chờ thanh toán', 'Chờ check-out'].indexOf(order.status) >= 0;
    });
    var slaRows = state.op.requests.filter(function (request) {
      return request.status !== 'Hoàn tất';
    }).sort(function (a, b) { return slaInfo(a).remain - slaInfo(b).remain; }).slice(0, 6);
    var housekeepingRows = state.op.housekeeping.filter(function (task) { return task.inspection !== 'Đạt'; }).slice(0, 6);

    var demoPanel = UI.panel('Kịch bản thao tác demo', '<div class="timeline">' + DEMO_STEPS.map(function (label, index) {
      var active = index === state.ui.demoStep;
      return '<div class="slot"><b>Bước ' + (index + 1) + '</b><div>' + UI.esc(label) + '</div><span>' + UI.badge(active ? 'Tiếp theo' : 'Chờ', active ? 'teal' : 'gray') + '</span></div>';
    }).join('') + '</div>', '<button class="btn btn-primary" data-action="run-demo-step" type="button">Chạy bước tiếp</button>');

    return demoPanel + '<div class="grid-2">' +
      UI.panel('Booking chờ đẩy check-in', UI.table([
        { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'guest' }, { label: 'Dịch vụ', key: 'item' }, { label: 'Tổng', render: function (r) { return UI.money(r.total); } }, { label: 'Thao tác', render: function (r) { return '<button class="btn btn-primary" data-action="booking-to-checkin" data-id="' + r.id + '" type="button" ' + (!canAction('booking-checkin') ? 'disabled' : '') + '>Đẩy check-in</button>'; } }
      ], bookingRows, 'Không có booking phòng đang chờ.')) +
      UI.panel('Checkout sẵn sàng', UI.table([
        { label: 'Khách', key: 'guest' }, { label: 'Phòng', key: 'room' }, { label: 'Tạm tính', render: function (r) { return UI.money(checkoutAmount(r)); } }, { label: 'Thao tác', render: function (r) { return '<button class="btn btn-warn" data-action="open-checkout" data-id="' + r.id + '" type="button" ' + (!canAction('checkin') ? 'disabled' : '') + '>Mở hóa đơn</button>'; } }
      ], readyCheckout, 'Chưa có phòng đủ điều kiện checkout.')) +
      UI.panel('Checkout đang bị chặn', UI.table([
        { label: 'Khách', key: 'guest' }, { label: 'Phòng', key: 'room' }, { label: 'Lý do', render: function (r) { return checkoutBlockers(r).map(UI.esc).join('<br>'); } }
      ], blockedCheckout, 'Không có checkout bị chặn.')) +
      UI.panel('Order POS cần xử lý', UI.table([
        { label: 'Mã', key: 'id' }, { label: 'Bàn', key: 'table' }, { label: 'Khách/phòng', key: 'guest' }, { label: 'Trạng thái', key: 'status' }, { label: 'Thao tác', render: function (r) { var finalStatus = r.chargeToRoom ? 'Chờ check-out' : 'Đã thanh toán'; return '<button class="btn btn-primary" data-action="advance-order" data-id="' + r.id + '" type="button" ' + (r.status === finalStatus || !canAction('pos') ? 'disabled' : '') + '>Chuyển bước</button>'; } }
      ], activeOrders, 'Không có order đang mở.')) +
      UI.panel('SLA cần theo dõi', UI.table([
        { label: 'Mã', key: 'id' }, { label: 'Phòng', key: 'room' }, { label: 'Mô tả', key: 'desc' }, { label: 'SLA', render: function (r) { var s = slaInfo(r); return UI.badge(s.text, s.tone); } }, { label: 'Thao tác', render: function (r) { return '<button class="btn btn-primary" data-action="advance-request" data-id="' + r.id + '" type="button" ' + (!canAction('request') ? 'disabled' : '') + '>Chuyển bước</button>'; } }
      ], slaRows, 'Không có yêu cầu mở.')) +
      UI.panel('Buồng phòng cần xử lý', UI.table([
        { label: 'Phòng', key: 'room' }, { label: 'NV', key: 'staff' }, { label: 'Trạng thái', key: 'inspection' }, { label: 'Thao tác', render: function (r) { return '<button class="btn btn-primary" data-action="advance-housekeeping" data-room="' + r.room + '" type="button" ' + (!canAction('housekeeping') ? 'disabled' : '') + '>Chuyển bước</button>'; } }
      ], housekeepingRows, 'Không có phòng chờ dọn/kiểm.')) +
    '</div>';
  }

  function priorityTone(priority) {
    if (priority === 'P1') return 'red';
    if (priority === 'P2') return 'yellow';
    return 'gray';
  }

  function workItems() {
    var items = [];
    state.bk.bookings.filter(function (booking) {
      return ['Đã xác nhận', 'Chờ xác nhận'].indexOf(booking.status) >= 0 && booking.item.indexOf('Phòng') >= 0;
    }).forEach(function (booking) {
      items.push({
        id: 'BK:' + booking.id,
        module: 'BK/OP',
        priority: booking.from <= todayText() ? 'P1' : 'P2',
        title: 'Đẩy check-in cho ' + booking.guest,
        owner: 'Lễ tân / Booking',
        due: booking.from + ' → ' + booking.to,
        status: booking.status,
        action: '<button class="btn btn-primary" data-action="booking-to-checkin" data-id="' + booking.id + '" type="button" ' + (!canAction('booking-checkin') ? 'disabled' : '') + '>Đẩy check-in</button>'
      });
    });

    state.op.checkins.filter(function (ci) { return ci.status === 'Đang lưu trú'; }).forEach(function (ci) {
      var blockers = checkoutBlockers(ci);
      items.push({
        id: 'CI:' + ci.id,
        module: 'OP/FM',
        priority: blockers.length ? 'P1' : 'P2',
        title: (blockers.length ? 'Gỡ chặn checkout ' : 'Checkout sẵn sàng ') + ci.room,
        owner: blockers.length ? 'Lễ tân / F&B' : 'Lễ tân / Thu ngân',
        due: 'Trong ca hiện tại',
        status: blockers.length ? blockers.join('; ') : UI.money(checkoutAmount(ci)),
        action: '<button class="btn btn-warn" data-action="open-checkout" data-id="' + ci.id + '" type="button" ' + (!canAction('checkin') ? 'disabled' : '') + '>Mở hóa đơn</button>'
      });
    });

    state.op.orders.filter(function (order) {
      var finalStatus = order.chargeToRoom ? 'Chờ check-out' : 'Đã thanh toán';
      return order.status !== finalStatus && order.status !== 'Đã tính tiền';
    }).forEach(function (order) {
      items.push({
        id: 'OD:' + order.id,
        module: 'OP/F&B',
        priority: order.status === 'Đang bếp' ? 'P2' : 'P3',
        title: 'Order ' + order.id + ' tại ' + order.table,
        owner: 'Bếp / Thu ngân F&B',
        due: order.chargeToRoom ? 'Charge phòng' : 'Thanh toán tại bàn',
        status: order.status,
        action: '<button class="btn btn-primary" data-action="advance-order" data-id="' + order.id + '" type="button" ' + (!canAction('pos') ? 'disabled' : '') + '>Chuyển bước</button>'
      });
    });

    state.op.housekeeping.filter(function (task) { return task.inspection !== 'Đạt'; }).forEach(function (task) {
      items.push({
        id: 'HK:' + task.room,
        module: 'OP/HK',
        priority: task.inspection === 'Không đạt' ? 'P1' : 'P2',
        title: 'Dọn/kiểm phòng ' + task.room,
        owner: task.staff,
        due: task.shift,
        status: task.inspection,
        action: '<button class="btn btn-primary" data-action="advance-housekeeping" data-room="' + task.room + '" type="button" ' + (!canAction('housekeeping') ? 'disabled' : '') + '>Chuyển bước</button>'
      });
    });

    state.op.requests.filter(function (request) { return request.status !== 'Hoàn tất'; }).forEach(function (request) {
      var s = slaInfo(request);
      items.push({
        id: 'SLA:' + request.id,
        module: 'OP/SLA',
        priority: s.remain < 0 ? 'P1' : (s.remain <= 5 ? 'P2' : 'P3'),
        title: request.type + ' phòng ' + request.room,
        owner: request.assigned,
        due: s.text,
        status: request.status,
        action: '<button class="btn btn-primary" data-action="advance-request" data-id="' + request.id + '" type="button" ' + (!canAction('request') ? 'disabled' : '') + '>Chuyển bước</button>'
      });
    });

    state.op.techTickets.filter(function (ticket) { return ticket.status !== 'Đã đóng'; }).forEach(function (ticket) {
      items.push({
        id: 'TECH:' + ticket.id,
        module: 'OP/VT',
        priority: ticket.priority === 'P2' ? 'P2' : 'P3',
        title: ticket.issue + ' · ' + ticket.location,
        owner: ticket.priority === 'P2' ? 'Kỹ thuật trực' : 'Bảo trì',
        due: ticket.priority,
        status: ticket.status,
        action: '<button class="btn btn-primary" data-action="close-tech" data-id="' + ticket.id + '" type="button" ' + (!canAction('tech') ? 'disabled' : '') + '>Đóng sự cố</button>'
      });
    });

    state.fm.expenses.filter(function (expense) { return expense.status.indexOf('Chờ') === 0; }).forEach(function (expense) {
      items.push({
        id: 'EXP:' + expense.id,
        module: 'FM',
        priority: expense.level === 'TGĐ' ? 'P1' : 'P2',
        title: 'Duyệt phiếu chi ' + expense.id,
        owner: expense.level,
        due: UI.money(expense.amount),
        status: expense.status,
        action: '<button class="btn btn-primary" data-action="approve-expense" data-id="' + expense.id + '" type="button" ' + (!canAction('expense-approve') ? 'disabled' : '') + '>Duyệt</button>'
      });
    });

    state.vt.stock.filter(function (stock) { return stock.status !== 'Đủ'; }).forEach(function (stock) {
      items.push({
        id: 'STK:' + stock.code,
        module: 'VT',
        priority: stock.onhand < stock.min ? 'P2' : 'P3',
        title: 'Bổ sung tồn kho ' + stock.name,
        owner: 'Kho / Mua hàng',
        due: stock.onhand + '/' + stock.min + ' ' + stock.unit,
        status: stock.status,
        action: '<a class="btn btn-ghost" href="#vt/stock">Mở kho</a>'
      });
    });

    state.hr.leaves.filter(function (leave) { return leave.status === 'Chờ duyệt'; }).forEach(function (leave) {
      items.push({
        id: 'LEA:' + leave.id,
        module: 'HR',
        priority: 'P3',
        title: 'Duyệt phép ' + leave.name,
        owner: leave.dept,
        due: leave.days,
        status: leave.status,
        action: '<a class="btn btn-ghost" href="#hr/leave">Mở phép</a>'
      });
    });

    return items.sort(function (a, b) {
      var rank = { P1: 1, P2: 2, P3: 3 };
      return rank[a.priority] - rank[b.priority] || a.module.localeCompare(b.module);
    });
  }

  function renderWorkBoard(items) {
    var modules = Array.from(new Set(items.map(function (item) { return item.module; })));
    if (!modules.length) return '<div class="empty">Không còn việc mở trong hàng đợi vận hành.</div>';
    return '<div class="work-board">' + modules.map(function (module) {
      var rows = items.filter(function (item) { return item.module === module; }).slice(0, 5);
      return '<section class="work-column"><div class="work-column-head"><b>' + UI.esc(module) + '</b><span>' + rows.length + '</span></div>' +
        rows.map(function (item) {
          return '<div class="work-card"><div>' + UI.badge(item.priority, priorityTone(item.priority)) + '</div>' +
            '<strong>' + UI.esc(item.title) + '</strong>' +
            '<div class="work-meta">' + UI.esc(item.owner) + ' · ' + UI.esc(item.due) + '</div>' +
            '<div class="work-status">' + UI.esc(item.status) + '</div>' +
          '</div>';
        }).join('') + '</section>';
    }).join('') + '</div>';
  }

  function renderWorkCenter() {
    var items = workItems();
    var p1 = items.filter(function (item) { return item.priority === 'P1'; }).length;
    var p2 = items.filter(function (item) { return item.priority === 'P2'; }).length;
    var blocked = healthIssues().filter(function (issue) { return issue.severity === 'P1'; }).length;
    var rows = items.slice(0, 18);
    return UI.kpi([
      { label: 'Việc đang mở', value: items.length, note: 'gom từ OP/BK/FM/VT/HR', tone: 'blue' },
      { label: 'P1 cần xử lý', value: p1, note: blocked + ' cảnh báo dữ liệu P1', tone: p1 ? 'red' : 'green' },
      { label: 'P2 trong ca', value: p2, note: 'ưu tiên điều phối', tone: 'yellow' },
      { label: 'Audit trail', value: state.audit.length, note: 'thao tác đã ghi', tone: 'teal' }
    ]) +
    '<div class="grid-2">' +
      UI.panel('Hàng đợi ưu tiên', UI.table([
        { label: 'Mức', render: function (r) { return UI.badge(r.priority, priorityTone(r.priority)); } },
        { label: 'Việc', render: function (r) { return '<b>' + UI.esc(r.title) + '</b><div class="fnb-seat">' + UI.esc(r.id) + ' · ' + UI.esc(r.module) + '</div>'; } },
        { label: 'Phụ trách', key: 'owner' },
        { label: 'Hạn/SLA', key: 'due' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Thao tác', render: function (r) { return r.action; } }
      ], rows, 'Không có việc cần xử lý.')) +
      UI.panel('Bảng điều phối', renderWorkBoard(items)) +
    '</div>' +
    UI.panel('Cảnh báo kiểm soát nhanh', UI.table([
      { label: 'Module', key: 'area' },
      { label: 'Loại', key: 'type' },
      { label: 'Mức', render: function (r) { return UI.badge(r.severity, r.severity === 'P1' ? 'red' : (r.severity === 'P2' ? 'yellow' : 'gray')); } },
      { label: 'Chi tiết', key: 'detail' }
    ], healthIssues().slice(0, 8), 'State hiện tại chưa có cảnh báo kiểm soát.'), '<a class="btn btn-ghost" href="#it/health">Mở Health check</a>');
  }

  function renderHousekeeping() {
    return UI.panel('Phân công dọn phòng + inspection', UI.table([
      { label: 'Phòng', key: 'room' }, { label: 'Nhân viên', key: 'staff' }, { label: 'Ca', key: 'shift' }, { label: 'Inspection', render: function (r) { return UI.badge(r.inspection, r.inspection === 'Đạt' ? 'green' : (r.inspection === 'Không đạt' ? 'red' : 'yellow')); } }, { label: 'Ảnh', key: 'photo' }, { label: 'Thao tác', render: function (r) {
        var disabled = r.inspection === 'Đạt' || !canAction('housekeeping') ? 'disabled' : '';
        return '<button class="btn btn-primary" data-action="advance-housekeeping" data-room="' + r.room + '" type="button" ' + disabled + '>Chuyển bước</button> <button class="btn btn-danger" data-action="fail-housekeeping" data-room="' + r.room + '" type="button" ' + disabled + '>Không đạt</button>';
      } }
    ], state.op.housekeeping));
  }

  function renderPOS() {
    var body = '<div class="grid-2"><div>' + UI.panel('Sơ đồ bàn F&B', '<div class="table-map">' + state.op.tables.map(function (t) {
      return '<div class="fnb-table ' + (t.status === 'Trống' ? 'free' : 'busy') + '"><div class="fnb-name">' + t.id + '</div><div class="fnb-seat">' + UI.esc(t.zone) + '</div><div class="fnb-seat">' + t.seats + ' ghế · ' + UI.esc(t.status) + '</div></div>';
    }).join('') + '</div>') + '</div><div>' + UI.panel('Ghi order', UI.table([
      { label: 'Món', key: 'name' }, { label: 'Giá', render: function (r) { return UI.money(r.price); } }, { label: 'Dị ứng', render: function (r) { return r.allergy ? UI.badge(r.allergy, 'red') : UI.badge('Không', 'green'); } }
    ], state.op.menu), '<button class="btn btn-primary" data-action="open-order" type="button" ' + (canAction('pos') ? '' : 'disabled') + '>Thêm order</button>') + '</div></div>';
    body += UI.panel('Order đang chạy', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Bàn', key: 'table' }, { label: 'Khách/phòng', key: 'guest' }, { label: 'Món', render: function (r) { return UI.esc(r.items.join(', ')); } }, { label: 'Tổng', render: function (r) { return UI.money(r.total); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đang bếp' ? 'yellow' : (r.status.indexOf('Đã') === 0 ? 'green' : 'blue')); } }, { label: 'Charge', render: function (r) { return r.chargeToRoom ? UI.badge('Charge-to-room', 'blue') : UI.badge('Tại bàn', 'gray'); } }, { label: 'Thao tác', render: function (r) {
        var finalStatus = r.chargeToRoom ? 'Chờ check-out' : 'Đã thanh toán';
        var disabled = r.status === finalStatus ? ' disabled' : '';
        return '<button class="btn btn-primary" data-action="advance-order" data-id="' + r.id + '" type="button"' + (disabled || !canAction('pos') ? ' disabled' : '') + '>Chuyển bước</button> <button class="btn btn-ghost" data-action="print-kitchen" data-id="' + r.id + '" type="button">Phiếu bếp</button>';
      } }
    ], state.op.orders));
    return body;
  }

  function renderCheckin() {
    return UI.panel('Check-in / Check-out', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'guest' }, { label: 'Booking', key: 'booking' }, { label: 'Phòng', key: 'room' }, { label: 'CCCD/QR', key: 'cccd' }, { label: 'Thẻ từ', key: 'card' }, { label: 'Tạm tính', render: function (r) { return r.status === 'Đang lưu trú' ? UI.money(checkoutAmount(r)) : UI.badge('Đã khóa', 'gray'); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đang lưu trú' ? 'green' : 'yellow'); } }, { label: 'Thao tác', render: function (r) {
        return '<button class="btn btn-warn" data-action="open-checkout" data-id="' + r.id + '" type="button" ' + (r.status === 'Đang lưu trú' && canAction('checkin') ? '' : 'disabled') + '>Check-out</button>';
      } }
    ], state.op.checkins), '<button class="btn btn-primary" data-action="open-checkin" type="button" ' + (canAction('checkin') ? '' : 'disabled') + '>Check-in khách</button>');
  }

  function renderRequests() {
    return UI.panel('Yêu cầu/khiếu nại + SLA timer', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Phòng', key: 'room' }, { label: 'Loại', key: 'type' }, { label: 'Mô tả', key: 'desc' }, { label: 'Phân công', key: 'assigned' }, { label: 'SLA', render: function (r) { var s = slaInfo(r); return UI.badge(s.text, s.tone) + '<div class="fnb-seat">Đã mở ' + s.elapsed + ' phút</div>'; } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Hoàn tất' ? 'green' : (r.status.indexOf('Escalate') >= 0 ? 'red' : 'yellow')); } }, { label: 'Thao tác', render: function (r) {
        return '<button class="btn btn-primary" data-action="advance-request" data-id="' + r.id + '" type="button" ' + (r.status === 'Hoàn tất' || !canAction('request') ? 'disabled' : '') + '>Chuyển bước</button>';
      } }
    ], state.op.requests));
  }

  function renderTech() {
    return UI.panel('Phiếu sự cố kỹ thuật', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Vị trí', key: 'location' }, { label: 'Sự cố', key: 'issue' }, { label: 'Ưu tiên', render: function (r) { return UI.badge(r.priority, r.priority === 'P2' ? 'yellow' : 'gray'); } }, { label: 'Ảnh trước', key: 'before' }, { label: 'Ảnh sau', key: 'after' }, { label: 'Chi phí', render: function (r) { return UI.money(r.cost); } }, { label: 'Trạng thái', key: 'status' }
    ], state.op.techTickets));
  }

  function renderSecurity() {
    return UI.panel('Nhật ký trực ca an ninh + giao ca', UI.table([
      { label: 'Giờ', key: 'time' }, { label: 'Ca', key: 'shift' }, { label: 'Nhân viên', key: 'staff' }, { label: 'Nội dung', key: 'note' }
    ], state.op.securityLogs));
  }

  function renderOpReports() {
    var occupied = state.op.rooms.filter(function (r) { return r.status === 'Có khách'; }).length;
    var occupancy = Math.round(occupied / state.op.rooms.length * 100);
    var dayRevenue = state.fm.revenues.filter(function (r) { return r.date === todayText(); }).reduce(function (sum, r) { return sum + r.amount; }, 0);
    var fnbRevenue = state.fm.revenues.filter(function (r) { return r.source.indexOf('POS') >= 0 || r.source.indexOf('F&B') >= 0; }).reduce(function (sum, r) { return sum + r.amount; }, 0);
    return '<div class="grid-3">' +
      UI.panel('Báo cáo ngày 07:00', '<div class="note">Tổng hợp từ state hiện tại: ' + UI.money(dayRevenue) + ' doanh thu trong ngày, ' + state.audit.length + ' thao tác audit.</div>') +
      UI.panel('Công suất phòng', '<div class="progress"><span style="width:' + occupancy + '%"></span></div><br>' + occupancy + '% · RevPAR mô phỏng ' + UI.money(Math.round(dayRevenue / Math.max(1, state.op.rooms.length))) + ' · ADR mô phỏng ' + UI.money(Math.round(dayRevenue / Math.max(1, occupied))) ) +
      UI.panel('Dịch vụ bổ sung', '<div class="progress"><span style="width:' + Math.min(100, Math.round(fnbRevenue / 500000)) + '%"></span></div><br>F&B đã ghi nhận ' + UI.money(fnbRevenue) + ' · Spa mock 14,4tr · Vé mock 19,8tr') + '</div>';
  }

  function renderBK(view) {
    var bk = state.bk;
    var body = UI.kpi([
      { label: 'Đơn hôm nay', value: bk.bookings.length, note: 'refresh 60s giả lập', tone: 'blue' },
      { label: 'Doanh thu đặt', value: UI.money(bk.bookings.reduce(function (s, b) { return s + b.total; }, 0)), note: 'bao gồm pay-at-resort', tone: 'green' },
      { label: 'Dịch vụ mở bán', value: bk.services.length, note: 'phòng/vé/activity/F&B', tone: 'teal' },
      { label: 'Review trung bình', value: '4.5/5', note: bk.reviews.length + ' đánh giá mẫu', tone: 'yellow' }
    ]);
    if (view === 'public') body += UI.panel('Web booking khách', UI.table([
      { label: 'Loại', key: 'type' }, { label: 'Dịch vụ', key: 'name' }, { label: 'Sức chứa', key: 'capacity' }, { label: 'Giá', render: function (r) { return UI.money(r.price); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, 'green'); } }
    ], bk.services));
    if (view === 'admin' || view === 'orders') body += UI.panel('Danh sách đơn + QR', bookingTable(bk.bookings));
    if (view === 'cms') body += UI.panel('CMS dịch vụ', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Tên', key: 'name' }, { label: 'Loại', key: 'type' }, { label: 'Giá', render: function (r) { return UI.money(r.price); } }, { label: 'Trạng thái', key: 'status' }], bk.services));
    if (view === 'vouchers') body += UI.panel('Quản lý voucher', UI.table([{ label: 'Mã', key: 'code' }, { label: 'Giá trị', key: 'value' }, { label: 'Điều kiện', key: 'condition' }, { label: 'Đã dùng', key: 'used' }, { label: 'Trạng thái', key: 'status' }], bk.vouchers));
    if (view === 'reports') body += UI.panel('Báo cáo doanh thu/công suất', '<div class="timeline"><div class="slot"><b>Booking</b><div class="progress"><span style="width:73%"></span></div><span>73%</span></div><div class="slot"><b>Vé</b><div class="progress"><span style="width:58%"></span></div><span>58%</span></div><div class="slot"><b>Activity</b><div class="progress"><span style="width:46%"></span></div><span>46%</span></div></div>');
    return page('bk', view, body, 'Màn public booking và admin booking dùng dữ liệu mock, cổng thanh toán chỉ là trạng thái giả.');
  }

  function bookingTable(rows) {
    return UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'guest' }, { label: 'SDT', key: 'phone' }, { label: 'Dịch vụ', key: 'item' }, { label: 'Ngày', render: function (r) { return UI.esc(r.from + ' → ' + r.to); } }, { label: 'Tổng', render: function (r) { return UI.money(r.total); } }, { label: 'Thanh toán', key: 'pay' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Chờ xác nhận' ? 'yellow' : (r.status === 'Completed' ? 'blue' : 'green')); } }, { label: 'Thao tác', render: function (r) {
        var canPush = ['Đã xác nhận', 'Chờ xác nhận'].indexOf(r.status) >= 0 && r.item.indexOf('Phòng') >= 0;
        return '<button class="btn btn-primary" data-action="booking-to-checkin" data-id="' + r.id + '" type="button" ' + (canPush && canAction('booking-checkin') ? '' : 'disabled') + '>Đẩy check-in</button>';
      } }
    ], rows);
  }

  function renderHR(view) {
    var hr = state.hr;
    var ownOnly = role().scope === 'own';
    var employees = ownOnly ? hr.employees.slice(0, 1) : hr.employees;
    var body = UI.kpi([
      { label: 'Đang làm', value: hr.employees.filter(function (e) { return e.status === 'Đang làm'; }).length, note: hr.employees.length + ' hồ sơ mock', tone: 'green' },
      { label: 'Vắng/phép chờ', value: hr.leaves.filter(function (l) { return l.status === 'Chờ duyệt'; }).length, note: 'duyệt trong 24h', tone: 'yellow' },
      { label: 'Quỹ lương tháng', value: UI.money(hr.payroll.reduce(function (s, p) { return s + p.net; }, 0)), note: ownOnly ? 'scope own' : '10 phiếu mẫu', tone: 'blue' },
      { label: 'CTV hoạt động', value: hr.ctv.length, note: 'mùa lễ tháng 4-9', tone: 'teal' }
    ]);
    if (view === 'dashboard' || view === 'employees') body += UI.panel('Hồ sơ nhân viên', employeeTable(employees));
    if (view === 'schedule') body += UI.panel('Lịch ca tuần', employeeTable(employees.slice(0, 16), true));
    if (view === 'attendance') body += UI.panel('Chấm công', UI.table([{ label: 'Mã', key: 'code' }, { label: 'Tên', key: 'name' }, { label: 'Ca', key: 'shift' }, { label: 'Vào ca', key: 'checkin' }, { label: 'Tăng ca', key: 'overtime' }], ownOnly ? hr.attendances.slice(0, 1) : hr.attendances));
    if (view === 'self') body += UI.panel('Self-service: ca, phiếu lương, phép của tôi', employeeTable(hr.employees.slice(0, 1)) + '<br>' + payrollTable(hr.payroll.slice(0, 1)));
    if (view === 'leave') body += UI.panel('Duyệt phép', UI.table([{ label: 'Mã', key: 'id' }, { label: 'NV', key: 'name' }, { label: 'Bộ phận', key: 'dept' }, { label: 'Ngày', key: 'days' }, { label: 'Lý do', key: 'reason' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Chờ duyệt' ? 'yellow' : 'green'); } }], hr.leaves));
    if (view === 'payroll') body += UI.panel('Bảng lương + maker-checker', payrollTable(ownOnly ? hr.payroll.slice(0, 1) : hr.payroll), canApprovePayrollButton());
    if (view === 'ctv') body += UI.panel('Quản lý CTV', UI.table([{ label: 'Tên', key: 'name' }, { label: 'Chuyên môn', key: 'specialty' }, { label: 'Thù lao/buổi', render: function (r) { return UI.money(r.rate); } }, { label: 'Trạng thái', key: 'status' }], hr.ctv));
    return page('hr', view, body, 'Thể hiện data-scope own cho nhân viên/nghệ nhân và maker-checker trên lương.');
  }

  function employeeTable(rows, shiftOnly) {
    return UI.table([
      { label: 'Mã', key: 'code' }, { label: 'Họ tên', key: 'name' }, { label: 'Bộ phận', key: 'dept' }, { label: 'Vai trò', key: 'role' }, { label: 'Ca', key: 'shift' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đang làm' ? 'green' : 'yellow'); } }
    ], rows, shiftOnly ? 'Chưa có lịch ca' : 'Chưa có nhân viên');
  }

  function payrollTable(rows) {
    return UI.table([{ label: 'Mã', key: 'code' }, { label: 'Tên', key: 'name' }, { label: 'Bộ phận', key: 'dept' }, { label: 'Kỳ', key: 'period' }, { label: 'Thực lĩnh', render: function (r) { return UI.money(r.net); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status.indexOf('Chờ') >= 0 ? 'yellow' : 'gray'); } }], rows);
  }

  function canApprovePayrollButton() {
    return '<button class="btn btn-primary" type="button" ' + (role().canApprovePayroll || role().all ? '' : 'disabled') + '>Ký duyệt kỳ lương</button>';
  }

  function renderFM(view) {
    var fm = state.fm;
    var body = UI.kpi([
      { label: 'Doanh thu ngày', value: UI.money(fm.revenues.reduce(function (s, r) { return s + r.amount; }, 0)), note: 'booking + quầy + F&B + spa', tone: 'green' },
      { label: 'Phiếu chờ duyệt', value: fm.expenses.filter(function (e) { return e.status.indexOf('Chờ') === 0; }).length, note: 'ngưỡng >5tr KTT, >20tr TGĐ', tone: 'yellow' },
      { label: 'Quỹ cuối ca', value: UI.money(fm.cash[fm.cash.length - 1].close), note: '2 người kiểm quỹ', tone: 'blue' },
      { label: 'Công nợ cảnh báo', value: fm.debts.filter(function (d) { return d.status !== 'Trong hạn'; }).length, note: 'phải thu/phải trả', tone: 'red' }
    ]);
    if (view === 'dashboard') body += UI.panel('P&L nhanh', '<div class="grid-3"><div class="note">Doanh thu lũy kế: ' + UI.money(193400000) + '</div><div class="note">Chi phí lũy kế: ' + UI.money(112600000) + '</div><div class="note">Lợi nhuận tạm tính: ' + UI.money(80800000) + '</div></div>');
    if (view === 'budget') body += UI.panel('Ngân sách kế hoạch vs thực tế', UI.table([{ label: 'Bộ phận', key: 'dept' }, { label: 'Kế hoạch', render: function (r) { return UI.money(r.plan); } }, { label: 'Thực tế', render: function (r) { return UI.money(r.actual); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status.indexOf('Vượt') >= 0 ? 'red' : 'green'); } }], fm.budgets));
    if (view === 'expenses') body += renderExpenses();
    if (view === 'revenue') body += UI.panel('Thu & đối soát cuối ngày', UI.table([{ label: 'Nguồn', key: 'source' }, { label: 'Ngày', key: 'date' }, { label: 'Số tiền', render: function (r) { return UI.money(r.amount); } }, { label: 'Trạng thái', key: 'status' }], fm.revenues));
    if (view === 'invoice') body += UI.panel('Hóa đơn VAT điện tử giả lập', '<div class="note">Màn phát hành/hủy/tra cứu hóa đơn MISA/VNPT mock, không gọi dịch vụ thật.</div>');
    if (view === 'ledger') body += UI.panel('Sổ nhật ký + khóa kỳ', '<div class="note">Bút toán đã khóa kỳ không sửa/xóa; chỉ cho phép bút toán điều chỉnh.</div>');
    if (view === 'debts') body += UI.panel('Công nợ', UI.table([{ label: 'Đối tác', key: 'partner' }, { label: 'Loại', key: 'type' }, { label: 'Số tiền', render: function (r) { return UI.money(r.amount); } }, { label: 'Hạn', key: 'due' }, { label: 'Trạng thái', key: 'status' }], fm.debts));
    if (view === 'cash') body += UI.panel('Quỹ tiền mặt', UI.table([{ label: 'Ca', key: 'shift' }, { label: 'Đầu ca', render: function (r) { return UI.money(r.opener); } }, { label: 'Thu', render: function (r) { return UI.money(r.revenue); } }, { label: 'Chi', render: function (r) { return UI.money(r.paid); } }, { label: 'Cuối ca', render: function (r) { return UI.money(r.close); } }, { label: 'Kiểm quỹ', key: 'checker' }], fm.cash));
    if (view === 'pnl') body += UI.panel('Báo cáo P&L', '<div class="timeline"><div class="slot"><b>Doanh thu</b><div class="progress"><span style="width:82%"></span></div><span>193,4tr</span></div><div class="slot"><b>Chi phí</b><div class="progress"><span style="width:48%"></span></div><span>112,6tr</span></div><div class="slot"><b>Lợi nhuận</b><div class="progress"><span style="width:34%"></span></div><span>80,8tr</span></div></div>');
    return page('fm', view, body, 'Minh họa SoD: thủ quỹ lập phiếu chi nhưng không duyệt; KTT/TGĐ duyệt theo ngưỡng.');
  }

  function renderExpenses() {
    return UI.panel('Lập phiếu chi + luồng duyệt đa cấp', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Maker', key: 'maker' }, { label: 'Bộ phận', key: 'dept' }, { label: 'Khoản chi', key: 'category' }, { label: 'Số tiền', render: function (r) { return UI.money(r.amount); } }, { label: 'Cấp duyệt', key: 'level' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status.indexOf('Chờ') === 0 ? 'yellow' : 'green'); } }, { label: 'Thao tác', render: function (r) {
        var disabled = !canApproveExpense() || r.status.indexOf('Chờ') !== 0;
        return '<button class="btn btn-primary" data-action="approve-expense" data-id="' + r.id + '" type="button" ' + (disabled ? 'disabled' : '') + '>Duyệt</button>';
      } }
    ], state.fm.expenses), '<button class="btn btn-warn" data-action="open-expense" type="button" ' + (canMakeExpense() ? '' : 'disabled') + '>Lập phiếu chi</button>');
  }

  function renderVT(view) {
    var vt = state.vt;
    var body = UI.kpi([
      { label: 'Tài sản', value: vt.assets.length, note: 'mã QR giả', tone: 'blue' },
      { label: 'Dưới tối thiểu', value: vt.stock.filter(function (s) { return s.status !== 'Đủ'; }).length, note: 'cảnh báo tồn', tone: 'red' },
      { label: 'Phiếu nhập chờ', value: vt.imports.filter(function (i) { return i.status === 'Chờ duyệt'; }).length, note: 'maker-checker', tone: 'yellow' },
      { label: 'Bảo trì mở', value: vt.maintenance.length, note: 'liên kết OP-TECH', tone: 'teal' }
    ]);
    if (view === 'assets') body += UI.panel('Danh mục tài sản + QR', UI.table([{ label: 'Mã', key: 'code' }, { label: 'Tên', key: 'name' }, { label: 'Khu vực', key: 'area' }, { label: 'QR', key: 'qr' }, { label: 'Giá trị', render: function (r) { return UI.money(r.value); } }, { label: 'Trạng thái', key: 'status' }], vt.assets));
    if (view === 'catalog' || view === 'stock') body += UI.panel('Vật tư + tồn kho real-time', stockTable(vt.stock));
    if (view === 'imports') body += UI.panel('Phiếu nhập + duyệt', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Vật tư', key: 'item' }, { label: 'SL', key: 'qty' }, { label: 'Giá trị', render: function (r) { return UI.money(r.amount); } }, { label: 'Maker', key: 'maker' }, { label: 'Trạng thái', key: 'status' }], vt.imports));
    if (view === 'exports') body += UI.panel('Phiếu xuất + so định mức', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Vật tư', key: 'item' }, { label: 'Bộ phận', key: 'dept' }, { label: 'SL', key: 'qty' }, { label: 'Trạng thái', key: 'status' }], vt.exports));
    if (view === 'maintenance') body += UI.panel('Lịch & phiếu bảo trì', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Tài sản', key: 'asset' }, { label: 'Triệu chứng', key: 'symptom' }, { label: 'KTV', key: 'tech' }, { label: 'Chi phí', render: function (r) { return UI.money(r.cost); } }, { label: 'Trạng thái', key: 'status' }], vt.maintenance));
    if (view === 'suppliers' || view === 'po') body += UI.panel('NCC + so sánh báo giá / PO', UI.table([{ label: 'NCC', key: 'name' }, { label: 'Điểm', key: 'score' }, { label: 'Báo giá', render: function (r) { return UI.money(r.quote); } }, { label: 'Pháp lý', key: 'legal' }], vt.suppliers));
    return page('vt', view, body, 'Quản lý tài sản QR, vật tư định mức, nhập/xuất, tồn tối thiểu, bảo trì và NCC.');
  }

  function stockTable(rows) {
    return UI.table([{ label: 'Mã', key: 'code' }, { label: 'Tên', key: 'name' }, { label: 'ĐVT', key: 'unit' }, { label: 'Tồn', key: 'onhand' }, { label: 'Tối thiểu', key: 'min' }, { label: 'Định mức/ngày', key: 'quota' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đủ' ? 'green' : (r.status === 'Cận mức' ? 'yellow' : 'red')); } }], rows);
  }

  function renderSP(view) {
    var sp = state.misc.spa;
    var body = UI.kpi([{ label: 'Booking Spa', value: sp.bookings.length, note: 'timeline phòng × giờ', tone: 'teal' }, { label: 'Dịch vụ', value: sp.services.length, note: 'giá thường/cuối tuần', tone: 'blue' }, { label: 'Thẻ trả trước', value: sp.cards.length, note: 'không hoàn tiền mặt', tone: 'yellow' }, { label: 'Doanh thu ngày', value: UI.money(14400000), note: 'tự gửi 23:00', tone: 'green' }]);
    if (view === 'timeline' || view === 'checkin') body += UI.panel('Lịch đặt Spa', UI.table([{ label: 'Giờ', key: 'time' }, { label: 'Phòng', key: 'room' }, { label: 'Khách', key: 'guest' }, { label: 'Dịch vụ', key: 'service' }, { label: 'KTV', key: 'ktv' }, { label: 'Trạng thái', key: 'status' }], sp.bookings));
    if (view === 'rooms') body += UI.panel('Sơ đồ phòng trị liệu', '<div class="room-grid">' + sp.bookings.map(function (b, i) { return '<div class="room-tile"><div class="room-no">' + b.room + '</div><div class="room-type">' + b.service + '</div>' + UI.badge(i === 1 ? 'Trống' : 'Đang phục vụ', i === 1 ? 'green' : 'blue') + '</div>'; }).join('') + '</div>');
    if (view === 'services') body += UI.panel('Dịch vụ & giá', UI.table([{ label: 'Tên', key: 'name' }, { label: 'Phút', key: 'duration' }, { label: 'Giá', render: function (r) { return UI.money(r.price); } }, { label: 'Trạng thái', key: 'status' }], sp.services));
    if (view === 'cards') body += UI.panel('Combo & thẻ trả trước', UI.table([{ label: 'Khách', key: 'owner' }, { label: 'Gói', key: 'package' }, { label: 'Số dư', key: 'balance' }, { label: 'Hạn', key: 'expire' }], sp.cards));
    if (view === 'reports') body += UI.panel('Báo cáo doanh thu theo KTV/dịch vụ', '<div class="note">Massage đá nóng chiếm 54%, xông thảo dược 28%, chăm sóc da 18%.</div>');
    return page('sp', view, body, 'Lịch spa, phòng trị liệu, check-in phân công KTV, dịch vụ giá và thẻ trả trước.');
  }

  function renderVG(view) {
    var vg = state.misc.vg;
    var body = UI.kpi(vg.counters.map(function (c) { return { label: c.area, value: c.count + '/' + c.capacity, note: Math.round(c.count / c.capacity * 100) + '% sức chứa', tone: c.count / c.capacity > .85 ? 'red' : 'green' }; }));
    if (view === 'scan' || view === 'reports') body += UI.panel('Quét vé + bộ đếm lượt khách', UI.table([{ label: 'Khu', key: 'area' }, { label: 'Lượt', key: 'count' }, { label: 'Sức chứa', key: 'capacity' }, { label: 'Cảnh báo', render: function (r) { return UI.badge(Math.round(r.count / r.capacity * 100) + '%', r.count / r.capacity > .85 ? 'red' : 'green'); } }], vg.counters));
    if (view === 'checklist') body += UI.panel('Checklist an toàn thiết bị', UI.table([{ label: 'Thiết bị', key: 'device' }, { label: 'Cơ học', key: 'mechanical' }, { label: 'Điện', key: 'electric' }, { label: 'Vệ sinh', key: 'hygiene' }, { label: 'Biển báo', key: 'sign' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Cho mở' ? 'green' : 'red'); } }], vg.checklists));
    if (view === 'incidents') body += UI.panel('Báo cáo sự cố', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Khu', key: 'area' }, { label: 'Loại', key: 'type' }, { label: 'Mức', key: 'severity' }, { label: 'Trạng thái', key: 'status' }], vg.incidents));
    return page('vg', view, body, 'Quét vé, cảnh báo sức chứa, checklist mở ca và sự cố khu vui chơi.');
  }

  function renderNT(view) {
    var nt = state.misc.nt;
    var own = role().scope === 'own';
    var artists = own ? nt.artists.filter(function (a) { return a.own; }) : nt.artists;
    var contracts = own ? nt.contracts.slice(0, 1) : nt.contracts;
    var body = UI.kpi([{ label: 'Lịch tuần', value: nt.schedules.length, note: 'T7/CN + lễ hội', tone: 'teal' }, { label: 'Nghệ nhân', value: artists.length, note: own ? 'scope own' : 'đội Ví Dặm', tone: 'yellow' }, { label: 'Cảnh báo thiếu người', value: nt.schedules.filter(function (s) { return s.artists < 3 || s.musicians < 2; }).length, note: 'tối thiểu 3+2/buổi', tone: 'red' }, { label: 'Thù lao tháng', value: UI.money(contracts.reduce(function (s, c) { return s + c.amount; }, 0)), note: 'khấu trừ TNCN', tone: 'green' }]);
    if (view === 'schedule') body += UI.panel('Lịch biểu diễn + xuất bản web', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Tiết mục', key: 'title' }, { label: 'Ngày', key: 'date' }, { label: 'Giờ', key: 'time' }, { label: 'Địa điểm', key: 'venue' }, { label: 'Xuất bản', render: function (r) { return UI.badge(r.published ? 'Đã xuất bản' : 'Nháp', r.published ? 'green' : 'gray'); } }], nt.schedules));
    if (view === 'assign') body += UI.panel('Phân công nghệ nhân/nhạc công', UI.table([{ label: 'Tên', key: 'name' }, { label: 'Vai trò', key: 'role' }, { label: 'Số buổi', key: 'shows' }, { label: 'Scope', render: function (r) { return UI.badge(r.own ? 'Bản thân' : 'Đội', r.own ? 'blue' : 'gray'); } }], artists));
    if (view === 'contracts') body += UI.panel('Hợp đồng & thù lao CTV', UI.table([{ label: 'Nghệ nhân', key: 'artist' }, { label: 'Kỳ', key: 'period' }, { label: 'Thù lao', render: function (r) { return UI.money(r.amount); } }, { label: 'Thuế', key: 'tax' }, { label: 'Trạng thái', key: 'status' }], contracts));
    if (view === 'reports') body += UI.panel('Báo cáo hoạt động Ví Dặm', '<div class="note">12 buổi diễn tháng này, 1.240 lượt khách, chi phí thù lao 12,6tr, liên kết review booking.</div>');
    return page('nt', view, body, 'Đặc thù Hà Tĩnh: lịch Ví Dặm, phân công nghệ nhân CTV, hợp đồng và thù lao.');
  }

  function renderIT(view) {
    var it = state.misc.it;
    var body = UI.kpi([{ label: 'Service online', value: it.services.filter(function (s) { return s.status === 'Online'; }).length + '/' + it.services.length, note: 'SLA 99,5%', tone: 'green' }, { label: 'Ticket mở', value: it.tickets.length, note: 'SLA Khẩn 30 phút', tone: 'yellow' }, { label: 'Tài sản IT', value: it.assets.length, note: 'liên kết VT.assets', tone: 'blue' }, { label: 'Backup hôm nay', value: it.backups.length, note: 'RPO ≤24h', tone: 'teal' }]);
    if (view === 'assets') body += UI.panel('Inventory thiết bị IT', UI.table([{ label: 'Mã', key: 'code' }, { label: 'Tên', key: 'name' }, { label: 'Vị trí', key: 'location' }, { label: 'Bảo hành', key: 'warranty' }, { label: 'Trạng thái', key: 'status' }], it.assets));
    if (view === 'uptime') body += UI.panel('Dashboard uptime', UI.table([{ label: 'Service', key: 'name' }, { label: 'Uptime', render: function (r) { return r.uptime + '%'; } }, { label: 'MTTR', key: 'mttr' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Online' ? 'green' : 'yellow'); } }], it.services));
    if (view === 'helpdesk') body += UI.panel('Helpdesk theo SLA', UI.table([{ label: 'Mã', key: 'id' }, { label: 'Người báo', key: 'reporter' }, { label: 'Ưu tiên', key: 'priority' }, { label: 'Mô tả', key: 'desc' }, { label: 'SLA', key: 'sla' }, { label: 'Trạng thái', key: 'status' }], it.tickets));
    if (view === 'access') body += renderAccessMatrix();
    if (view === 'backup') body += UI.panel('Sao lưu & DR', UI.table([{ label: 'Đích', key: 'target' }, { label: 'Thời điểm', key: 'time' }, { label: 'Dung lượng', key: 'size' }, { label: 'Trạng thái', key: 'status' }, { label: 'Kiểm tra', key: 'verified' }], it.backups));
    if (view === 'audit') body += renderAuditLog();
    if (view === 'health') body += renderHealthCheck();
    if (view === 'source') body += renderSourceExplorer();
    return page('it', view, body, 'Quản trị thiết bị IT, uptime, helpdesk, quyền truy cập từ FR_MAP và backup/DR.');
  }

  function renderSourceExplorer() {
    var modules = MODULES.map(function (m) {
      return '<option value="' + m.code + '"' + (state.ui.sourceModule === m.code ? ' selected' : '') + '>' + m.code + ' · ' + UI.esc(m.label) + '</option>';
    }).join('');
    var code = state.ui.sourceModule;
    var reqs = Object.keys(SOURCE.reqs || {}).map(function (key) {
      return Object.assign({ code: key }, SOURCE.reqs[key]);
    }).filter(function (item) { return item.module === code; });
    var orgRows = Object.keys(SOURCE.frMap || {}).filter(function (key) {
      return (SOURCE.frMap[key] || []).some(function (prefix) { return prefix.slice(0, 2) === code; });
    }).slice(0, 20).map(function (key) {
      var to = SOURCE.toData && SOURCE.toData[key];
      return { key: key, name: to ? to.name : key, prefixes: (SOURCE.frMap[key] || []).join(', ') };
    });
    var schemaRows = (SOURCE.schema && SOURCE.schema[code] || []).map(function (entity) {
      return { entity: entity.entity, cols: entity.cols.join(', ') };
    });
    return UI.panel('Bộ lọc nguồn dữ liệu', '<div class="field"><label>Module</label><select data-action="set-source-module">' + modules + '</select></div>') +
      '<div class="grid-2">' +
      UI.panel('REQS_DATA · yêu cầu chức năng', UI.table([
        { label: 'Mã', key: 'code' },
        { label: 'Tên', key: 'name' },
        { label: 'Sub', key: 'sub' },
        { label: 'Ưu tiên', render: function (r) { return UI.badge(r.priority, r.priority === 'P1' ? 'red' : (r.priority === 'P2' ? 'yellow' : 'gray')); } }
      ], reqs, 'Không có FR cho module này.')) +
      UI.panel('FR_MAP · tổ phụ trách', UI.table([
        { label: 'Org key', key: 'key' },
        { label: 'Tên tổ', key: 'name' },
        { label: 'Prefix FR', key: 'prefixes' }
      ], orgRows, 'Không có mapping tổ cho module này.')) +
      UI.panel('SCHEMA_DATA · entity', UI.table([
        { label: 'Entity', key: 'entity' },
        { label: 'Cột', key: 'cols' }
      ], schemaRows, 'Không có schema cho module này.')) +
      UI.panel('Tóm tắt nguồn', '<div class="note">Module ' + code + ' có ' + reqs.length + ' FR, ' + orgRows.length + ' mapping tổ hiển thị và ' + schemaRows.length + ' entity schema. Dữ liệu được nạp qua script từ charts_html/data/*.js.</div>') +
      '</div>';
  }

  function renderAuditLog() {
    return UI.panel('Audit log thao tác mock', UI.table([
      { label: 'Thời gian', render: function (r) { return UI.dateTime(r.at); } },
      { label: 'Vai trò', key: 'role' },
      { label: 'Hành động', key: 'action' },
      { label: 'Chi tiết', key: 'detail' },
      { label: 'Trước', key: 'before' },
      { label: 'Sau', key: 'after' }
    ], state.audit, 'Chưa có thao tác audit. Hãy đổi trạng thái phòng, thêm order, check-out hoặc duyệt phiếu chi.'));
  }

  function healthIssues() {
    var issues = [];
    state.op.rooms.filter(function (room) { return room.status === 'Có khách'; }).forEach(function (room) {
      var hasStay = state.op.checkins.some(function (ci) { return ci.room === room.id && ci.status === 'Đang lưu trú'; });
      if (!hasStay) issues.push({ area: 'OP', type: 'Phòng', severity: 'P2', detail: room.id + ' đang Có khách nhưng không có check-in active.' });
    });
    state.op.checkins.filter(function (ci) { return ci.status === 'Đang lưu trú'; }).forEach(function (ci) {
      var room = state.op.rooms.find(function (r) { return r.id === ci.room; });
      if (!room || room.status !== 'Có khách') issues.push({ area: 'OP', type: 'Check-in', severity: 'P1', detail: ci.id + ' active nhưng phòng không ở trạng thái Có khách.' });
    });
    state.op.orders.filter(function (order) { return order.chargeToRoom && ['Đang bếp', 'Đã phục vụ', 'Chờ check-out'].indexOf(order.status) >= 0; }).forEach(function (order) {
      var roomNo = order.guest.replace('Phòng ', '');
      var hasStay = state.op.checkins.some(function (ci) { return ci.room === roomNo && ci.status === 'Đang lưu trú'; });
      if (!hasStay) issues.push({ area: 'OP/F&B', type: 'Charge-to-room', severity: 'P2', detail: order.id + ' charge vào ' + order.guest + ' nhưng không có khách lưu trú active.' });
    });
    state.vt.stock.filter(function (stock) { return stock.onhand < stock.min; }).forEach(function (stock) {
      issues.push({ area: 'VT', type: 'Tồn kho', severity: 'P3', detail: stock.name + ' dưới tối thiểu: ' + stock.onhand + '/' + stock.min + ' ' + stock.unit + '.' });
    });
    state.op.requests.forEach(function (request) {
      var sla = slaInfo(request);
      if (sla.remain < 0 && request.status !== 'Hoàn tất') issues.push({ area: 'OP', type: 'SLA', severity: 'P1', detail: request.id + ' đã trễ SLA ' + Math.abs(sla.remain) + ' phút.' });
    });
    return issues;
  }

  function renderHealthCheck() {
    var rows = healthIssues();
    return UI.panel('Kiểm tra nhất quán dữ liệu mock', UI.table([
      { label: 'Module', key: 'area' },
      { label: 'Loại', key: 'type' },
      { label: 'Mức', render: function (r) { return UI.badge(r.severity, r.severity === 'P1' ? 'red' : (r.severity === 'P2' ? 'yellow' : 'gray')); } },
      { label: 'Chi tiết', key: 'detail' }
    ], rows, 'Không phát hiện bất thường trong state hiện tại.'));
  }

  function renderAccessMatrix() {
    var modules = ['OP','BK','HR','FM','VT','SP','VG','NT','IT'];
    var rows = ROLES.map(function (r) {
      var allowed = roleModulesFor(r);
      var prefixes = roleFrPrefixes(r);
      var row = {
        id: r.id,
        group: r.group || 'Khác',
        role: r.label,
        scope: r.scope,
        orgKey: r.orgKey || '',
        prefixes: prefixes.filter(function (p) { return p.length > 2; }).join(', ') || (r.all ? 'ALL' : (r.modules || []).join(', '))
      };
      modules.forEach(function (m) { row[m] = allowed.indexOf(m) >= 0; });
      return row;
    });
    var columns = [
      { label: 'Chọn', render: function (r) { return '<button class="btn btn-primary" data-action="set-role" data-id="' + UI.esc(r.id) + '" type="button">Chọn</button>'; } },
      { label: 'Nhóm', key: 'group' },
      { label: 'Vai trò', key: 'role' },
      { label: 'Scope', render: function (r) { return UI.badge(r.scope, r.scope === 'own' ? 'purple' : (r.scope === 'all' ? 'green' : 'blue')); } },
      { label: 'Org key', key: 'orgKey' }
    ].concat(modules.map(function (m) {
      return { label: m, render: function (r) { return r[m] ? UI.badge('Có', 'green') : UI.badge('Không', 'gray'); } };
    })).concat([{ label: 'FR prefix / module', key: 'prefixes' }]);
    return UI.kpi([
      { label: 'Tổng vai trò', value: ROLES.length, note: 'bao gồm role đặc biệt và org-key', tone: 'blue' },
      { label: 'Role từ FR_MAP', value: ROLES.filter(function (r) { return r.generated; }).length, note: 'sinh tự động từ dữ liệu thật', tone: 'teal' },
      { label: 'Phân hệ', value: modules.length, note: 'BK/HR/FM/VT/OP/SP/VG/NT/IT', tone: 'green' },
      { label: 'Scope own', value: ROLES.filter(function (r) { return r.scope === 'own'; }).length, note: 'CTV/nghệ nhân/nhân sự cá nhân', tone: 'yellow' }
    ]) + UI.panel('Ma trận toàn bộ vai trò × phân hệ', UI.table(columns, rows), '<button class="btn btn-ghost" data-action="set-role" data-id="admin" type="button">Về Admin</button>');
  }

  function openOrderModal() {
    var tableOptions = state.op.tables.map(function (t) { return '<option value="' + t.id + '">' + t.id + ' · ' + UI.esc(t.zone) + '</option>'; }).join('');
    var menuOptions = state.op.menu.map(function (m) { return '<option value="' + m.id + '">' + UI.esc(m.name) + ' · ' + UI.money(m.price) + (m.allergy ? ' · Dị ứng: ' + UI.esc(m.allergy) : '') + '</option>'; }).join('');
    UI.modal('Thêm order F&B', '<form id="order-form" class="form-grid"><div class="field"><label>Bàn</label><select name="table">' + tableOptions + '</select></div><div class="field"><label>Món</label><select name="item">' + menuOptions + '</select></div><div class="field"><label>Khách/phòng</label><input name="guest" value="Phòng P103"></div><div class="field"><label>Thanh toán</label><select name="charge"><option value="1">Charge-to-room</option><option value="0">Tại bàn</option></select></div></form>', '<button class="btn btn-primary" data-action="submit-order" type="button">Lưu order</button>');
  }

  function openCheckinModal() {
    var rooms = state.op.rooms.filter(function (r) { return r.status !== 'Có khách'; }).map(function (r) { return '<option value="' + r.id + '">' + r.id + ' · ' + UI.esc(r.status) + '</option>'; }).join('');
    UI.modal('Check-in khách', '<form id="checkin-form" class="form-grid"><div class="field"><label>Khách</label><input name="guest" value="Hồ Minh Tâm"></div><div class="field"><label>Booking</label><input name="booking" value="BK-240610-NEW"></div><div class="field"><label>Phòng</label><select name="room">' + rooms + '</select></div><div class="field"><label>CCCD/QR</label><input name="cccd" value="QR/CCCD giả lập"></div></form>', '<button class="btn btn-primary" data-action="submit-checkin" type="button">Xác nhận check-in</button>');
  }

  function openExpenseModal() {
    UI.modal('Lập phiếu chi', '<form id="expense-form" class="form-grid"><div class="field"><label>Bộ phận</label><input name="dept" value="F&B"></div><div class="field"><label>Khoản chi</label><input name="category" value="Bổ sung hàu Lộc Hà"></div><div class="field"><label>Số tiền</label><input name="amount" type="number" value="5600000"></div><div class="field"><label>Hóa đơn</label><input name="invoice" value="HD-MOCK"></div></form>', '<button class="btn btn-primary" data-action="submit-expense" type="button">Tạo phiếu</button>');
  }

  function openCheckoutModal(checkin) {
    var blockers = checkoutBlockers(checkin);
    var b = checkoutBreakdown(checkin);
    var body = '<div class="note">Hóa đơn mock chỉ dùng cho demo, chưa phát hành VAT thật.</div><br>' +
      UI.table([
        { label: 'Khoản', key: 'label' },
        { label: 'Số tiền', render: function (r) { return UI.money(r.amount); } }
      ], [
        { label: 'Tiền phòng / booking', amount: b.room },
        { label: 'F&B charge-to-room', amount: b.fnb },
        { label: 'Minibar / amenities', amount: b.minibar },
        { label: 'Tạm tính', amount: b.subtotal },
        { label: 'VAT mô phỏng 10%', amount: b.vat },
        { label: 'Tổng thanh toán', amount: b.total }
      ]);
    if (blockers.length) {
      body += '<br><div class="note" style="background:#fff5f5;border-color:#fed7d7;color:#9b2c2c">' + blockers.map(UI.esc).join('<br>') + '</div>';
    }
    UI.modal('Hóa đơn checkout · ' + checkin.room, body, '<button class="btn btn-ghost" data-action="print-window" type="button">In hóa đơn</button><button class="btn btn-ghost" data-close-modal type="button">Đóng</button><button class="btn btn-primary" data-action="confirm-checkout" data-id="' + checkin.id + '" type="button" ' + (blockers.length ? 'disabled' : '') + '>Xác nhận checkout</button>');
  }

  function openKitchenSlip(order) {
    var allergyItems = order.items.filter(function (name) {
      var menu = state.op.menu.find(function (m) { return m.name === name; });
      return menu && menu.allergy;
    }).map(function (name) {
      var menu = state.op.menu.find(function (m) { return m.name === name; });
      return name + ': ' + menu.allergy;
    });
    var body = '<div class="note">Phiếu bếp giả lập · ' + UI.dateTime(new Date().toISOString()) + '</div><br>' +
      '<div class="grid-2"><div><b>Mã order</b><br>' + UI.esc(order.id) + '</div><div><b>Bàn/khách</b><br>' + UI.esc(order.table + ' · ' + order.guest) + '</div></div><br>' +
      UI.table([{ label: 'Món', render: function (r) { return UI.esc(r); } }], order.items) +
      (allergyItems.length ? '<br><div class="note" style="background:#fff5f5;border-color:#fed7d7;color:#9b2c2c"><b>Cảnh báo dị ứng</b><br>' + allergyItems.map(UI.esc).join('<br>') + '</div>' : '');
    UI.modal('Phiếu bếp · ' + order.id, body, '<button class="btn btn-ghost" data-action="print-window" type="button">In phiếu</button><button class="btn btn-primary" data-close-modal type="button">Đóng</button>');
  }

  document.addEventListener('click', function (event) {
    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    var action = actionEl.dataset.action;
    if (action === 'cycle-room') {
      var room = state.op.rooms.find(function (r) { return r.id === actionEl.dataset.room; });
      var beforeRoom = clone(room);
      var list = ['Trống sạch','Có khách','Cần dọn','Bảo trì','Đặt trước'];
      room.status = list[(list.indexOf(room.status) + 1) % list.length];
      if (room.status !== 'Có khách') room.guest = '';
      audit('ROOM_STATUS', 'Đổi trạng thái phòng ' + room.id, beforeRoom, room);
      persist('Đã đổi trạng thái phòng ' + room.id + ' thành ' + room.status, 'success');
    }
    if (action === 'run-demo-step') {
      runDemoStep();
    }
    if (action === 'set-role') {
      var nextRole = ROLES.find(function (r) { return r.id === actionEl.dataset.id; });
      if (nextRole) {
        currentRoleId = nextRole.id;
        localStorage.setItem(ROLE_KEY, currentRoleId);
        var roleSelect = document.getElementById('role-select');
        if (roleSelect) roleSelect.value = currentRoleId;
        var route = parseRoute();
        if (!canViewScreen(route.moduleId, route.view)) location.hash = firstRoute();
        render();
        UI.toast('Đã chuyển sang vai trò: ' + nextRole.label, 'success');
      }
    }
    if (action === 'open-workflow-detail') {
      openWorkflowModal(actionEl.dataset.id);
    }
    if (action === 'open-order') openOrderModal();
    if (action === 'submit-order') {
      var form = document.getElementById('order-form');
      var item = state.op.menu.find(function (m) { return m.id === form.item.value; });
      var newOrder = { id: 'OD-' + (1100 + state.op.orders.length), table: form.table.value, guest: form.guest.value, items: [item.name], total: item.price, status: 'Đang bếp', chargeToRoom: form.charge.value === '1' };
      state.op.orders.unshift(newOrder);
      var table = state.op.tables.find(function (t) { return t.id === form.table.value; });
      if (table) table.status = 'Đang phục vụ';
      audit('FNB_ORDER_CREATE', 'Tạo order ' + newOrder.id + ' và in phiếu bếp giả lập', null, newOrder);
      saveState(); UI.closeModal(); render(); UI.toast('Đã thêm order và in phiếu bếp giả lập', 'success');
    }
    if (action === 'advance-order') {
      var order = state.op.orders.find(function (o) { return o.id === actionEl.dataset.id; });
      if (order) {
        var beforeOrder = clone(order);
        order.status = nextOrderStatus(order);
        if (order.status === 'Đã thanh toán') {
          addRevenue('POS F&B ' + order.id, order.total, 'Chờ đối soát cuối ca');
          deductStockForOrder(order);
        }
        syncTableStatus(order.table);
        audit('FNB_ORDER_ADVANCE', 'Chuyển bước order ' + order.id + ' sang ' + order.status, beforeOrder, order);
        persist('Đã chuyển order ' + order.id + ' sang ' + order.status, 'success');
      }
    }
    if (action === 'print-kitchen') {
      var slipOrder = state.op.orders.find(function (o) { return o.id === actionEl.dataset.id; });
      if (slipOrder) openKitchenSlip(slipOrder);
    }
    if (action === 'print-window') {
      window.print();
    }
    if (action === 'close-tech') {
      var ticket = state.op.techTickets.find(function (item) { return item.id === actionEl.dataset.id; });
      if (ticket && canAction('tech')) {
        var beforeTicket = clone(ticket);
        ticket.status = 'Đã đóng';
        ticket.after = ticket.after === 'Chưa có' ? 'Ảnh sau xử lý đã nhận' : ticket.after;
        audit('TECH_TICKET_CLOSE', 'Đóng sự cố kỹ thuật ' + ticket.id, beforeTicket, ticket);
        persist('Đã đóng sự cố kỹ thuật ' + ticket.id, 'success');
      }
    }
    if (action === 'advance-housekeeping' || action === 'fail-housekeeping') {
      var task = state.op.housekeeping.find(function (item) { return item.room === actionEl.dataset.room && item.inspection !== 'Đạt'; });
      if (task) {
        var beforeTask = clone(task);
        task.inspection = action === 'fail-housekeeping' ? 'Không đạt' : nextHousekeepingStatus(task.inspection);
        if (task.inspection === 'Đang dọn' && task.staff === 'Chưa phân công') task.staff = 'Tổ buồng phòng';
        if (task.inspection === 'Đạt') {
          task.photo = 'Ảnh sau dọn đã nhận';
          var cleanRoom = state.op.rooms.find(function (room) { return room.id === task.room; });
          if (cleanRoom) cleanRoom.status = 'Trống sạch';
        }
        audit('HOUSEKEEPING_FLOW', 'Cập nhật inspection phòng ' + task.room + ' sang ' + task.inspection, beforeTask, task);
        persist('Đã cập nhật dọn phòng ' + task.room + ' sang ' + task.inspection, 'success');
      }
    }
    if (action === 'advance-request') {
      var req = state.op.requests.find(function (item) { return item.id === actionEl.dataset.id; });
      if (req) {
        var beforeReq = clone(req);
        req.status = nextRequestStatus(req.status);
        if (req.status === 'Hoàn tất') req.completedAt = new Date().toISOString();
        audit('REQUEST_FLOW', 'Cập nhật yêu cầu ' + req.id + ' sang ' + req.status, beforeReq, req);
        persist('Đã cập nhật yêu cầu ' + req.id + ' sang ' + req.status, 'success');
      }
    }
    if (action === 'open-checkin') openCheckinModal();
    if (action === 'submit-checkin') {
      var f = document.getElementById('checkin-form');
      var checkin = { id: 'CI-' + (2500 + state.op.checkins.length), guest: f.guest.value, booking: f.booking.value, room: f.room.value, cccd: f.cccd.value, card: 'Đã giao thẻ', status: 'Đang lưu trú' };
      state.op.checkins.unshift(checkin);
      var r = state.op.rooms.find(function (room) { return room.id === f.room.value; });
      if (r) { r.status = 'Có khách'; r.guest = f.guest.value; }
      audit('CHECKIN_CREATE', 'Check-in khách ' + checkin.guest + ' vào phòng ' + checkin.room, null, checkin);
      saveState(); UI.closeModal(); render(); UI.toast('Đã check-in và cập nhật trạng thái phòng', 'success');
    }
    if (action === 'open-checkout') {
      var checkoutCandidate = state.op.checkins.find(function (item) { return item.id === actionEl.dataset.id; });
      if (checkoutCandidate) openCheckoutModal(checkoutCandidate);
    }
    if (action === 'confirm-checkout') {
      var ci = state.op.checkins.find(function (item) { return item.id === actionEl.dataset.id; });
      if (ci && ci.status === 'Đang lưu trú') {
        var blockers = checkoutBlockers(ci);
        if (blockers.length) {
          UI.toast(blockers[0], 'warn');
          return;
        }
        var beforeCi = clone(ci);
        var amount = checkoutAmount(ci);
        ci.status = 'Đã check-out';
        ci.checkoutTotal = amount;
        state.op.checkouts.unshift({ id: 'CO-' + (2600 + state.op.checkouts.length), checkin: ci.id, guest: ci.guest, room: ci.room, total: amount, at: new Date().toISOString() });
        var checkoutRoom = state.op.rooms.find(function (room) { return room.id === ci.room; });
        if (checkoutRoom) { checkoutRoom.status = 'Cần dọn'; checkoutRoom.guest = ''; }
        roomChargeOrders(ci.room).forEach(function (o) { o.status = 'Đã tính tiền'; syncTableStatus(o.table); deductStockForOrder(o); });
        var booking = bookingForCheckin(ci);
        if (booking) booking.status = 'Completed';
        addRevenue('Check-out phòng ' + ci.room, amount, 'Chờ đối soát cuối ngày');
        addHousekeepingTask(ci.room);
        audit('CHECKOUT_COMPLETE', 'Check-out ' + ci.guest + ', ghi doanh thu và chuyển phòng cần dọn', beforeCi, ci);
        saveState(); UI.closeModal(); render(); UI.toast('Đã check-out, ghi doanh thu FM và tạo việc dọn phòng', 'success');
      }
    }
    if (action === 'open-expense') openExpenseModal();
    if (action === 'submit-expense') {
      var ef = document.getElementById('expense-form');
      var amount = Number(ef.amount.value || 0);
      var expenseNew = { id: 'PC-2606-' + String(100 + state.fm.expenses.length), maker: role().label, dept: ef.dept.value, category: ef.category.value, amount: amount, status: amount > 20000000 ? 'Chờ TGĐ duyệt' : 'Chờ KTT duyệt', level: amount > 20000000 ? 'TGĐ' : 'KTT', invoice: ef.invoice.value };
      state.fm.expenses.unshift(expenseNew);
      audit('EXPENSE_CREATE', 'Lập phiếu chi ' + expenseNew.id, null, expenseNew);
      saveState(); UI.closeModal(); render(); UI.toast('Đã lập phiếu chi. Nút duyệt phụ thuộc vai trò checker.', 'success');
    }
    if (action === 'approve-expense') {
      var expense = state.fm.expenses.find(function (e) { return e.id === actionEl.dataset.id; });
      if (expense && canApproveExpense()) {
        var beforeExpense = clone(expense);
        expense.status = 'Đã duyệt';
        audit('EXPENSE_APPROVE', 'Duyệt phiếu chi ' + expense.id, beforeExpense, expense);
        persist('Đã duyệt phiếu chi theo vai trò checker', 'success');
      }
    }
    if (action === 'booking-to-checkin') {
      var bk = state.bk.bookings.find(function (b) { return b.id === actionEl.dataset.id; });
      if (bk) {
        var freeRoom = state.op.rooms.find(function (room) { return room.status === 'Trống sạch' || room.status === 'Đặt trước'; });
        if (!freeRoom) {
          UI.toast('Không còn phòng trống sạch để check-in', 'warn');
          return;
        }
        var beforeBooking = clone(bk);
        bk.status = 'Check-in';
        freeRoom.status = 'Có khách';
        freeRoom.guest = bk.guest;
        var pushed = { id: 'CI-' + (2500 + state.op.checkins.length), guest: bk.guest, booking: bk.id, room: freeRoom.id, cccd: 'QR từ booking', card: 'Đã giao thẻ', status: 'Đang lưu trú' };
        state.op.checkins.unshift(pushed);
        audit('BOOKING_TO_CHECKIN', 'Đẩy booking ' + bk.id + ' sang OP check-in', beforeBooking, pushed);
        persist('Đã đẩy booking sang check-in và cập nhật phòng ' + freeRoom.id, 'success');
      }
    }
  });

  document.addEventListener('change', function (event) {
    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    var action = actionEl.dataset.action;
    if (action === 'set-room-status') {
      state.ui.roomStatus = actionEl.value;
      saveState();
      render();
    }
    if (action === 'set-room-floor') {
      state.ui.roomFloor = actionEl.value;
      saveState();
      render();
    }
    if (action === 'set-source-module') {
      state.ui.sourceModule = actionEl.value;
      saveState();
      render();
    }
  });

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () {
    initControls();
    if (!location.hash) location.hash = firstRoute();
    render();
  });
})();
