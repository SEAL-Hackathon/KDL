/* Router và render prototype mock UI KDL Hà Tĩnh. */
(function () {
  var SOURCE = window.KDL_SOURCE || {};
  var STORE_KEY = 'kdl_prototype_state_v1';
  var ROLE_KEY = 'kdl_prototype_role_v1';
  var MODULE_FILTER_KEY = 'kdl_prototype_module_filter_v1';

  var MODULES = [
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
    op: [
      ['dashboard','Dashboard vận hành'], ['rooms','Sơ đồ phòng'], ['housekeeping','Dọn phòng & inspection'], ['pos','POS F&B'],
      ['checkin','Check-in/out'], ['requests','Yêu cầu & khiếu nại'], ['tech','Sự cố kỹ thuật'], ['security','Nhật ký an ninh'], ['reports','Báo cáo ngày']
    ],
    bk: [['public','Web booking khách'], ['admin','Dashboard booking'], ['orders','Danh sách đơn'], ['cms','CMS dịch vụ'], ['vouchers','Voucher'], ['reports','Báo cáo']],
    hr: [['dashboard','Dashboard NS'], ['employees','Hồ sơ NV'], ['schedule','Lịch ca tuần'], ['attendance','Chấm công'], ['self','Self-service'], ['leave','Duyệt phép'], ['payroll','Bảng lương'], ['ctv','Quản lý CTV']],
    fm: [['dashboard','Dashboard tài chính'], ['budget','Ngân sách'], ['expenses','Phiếu chi & duyệt'], ['revenue','Thu & đối soát'], ['invoice','Hóa đơn VAT'], ['ledger','Sổ nhật ký'], ['debts','Công nợ'], ['cash','Quỹ tiền mặt'], ['pnl','P&L']],
    vt: [['assets','Tài sản QR'], ['catalog','Vật tư & định mức'], ['imports','Phiếu nhập'], ['exports','Phiếu xuất'], ['stock','Tồn kho'], ['maintenance','Bảo trì'], ['suppliers','NCC & báo giá'], ['po','PO']],
    sp: [['timeline','Lịch Spa'], ['rooms','Phòng trị liệu'], ['checkin','Check-in KTV'], ['services','Dịch vụ & giá'], ['cards','Thẻ trả trước'], ['reports','Báo cáo']],
    vg: [['scan','Quét vé'], ['checklist','Checklist an toàn'], ['incidents','Báo cáo sự cố'], ['reports','Báo cáo']],
    nt: [['schedule','Lịch biểu diễn'], ['assign','Phân công nghệ nhân'], ['contracts','Hợp đồng & thù lao'], ['reports','Báo cáo']],
    it: [['assets','Inventory IT'], ['uptime','Dashboard uptime'], ['helpdesk','Helpdesk'], ['access','Quản lý truy cập'], ['backup','Backup/DR']]
  };

  var ROLES = [
    { id: 'admin', label: 'Admin hệ thống', all: true, scope: 'all' },
    { id: 'le_tan', label: 'Lễ tân', orgKey: 'lt-reception', scope: 'team' },
    { id: 'thu_quy', label: 'Thủ quỹ', orgKey: 'ql-ngan-quy', scope: 'block', canMakeExpense: true },
    { id: 'ktt', label: 'Kế toán trưởng', modules: ['FM','HR'], scope: 'block', canApproveExpense: true, canApprovePayroll: true },
    { id: 'buong_phong', label: 'Tổ trưởng buồng phòng', orgKey: 'lt-don-phong', extraModules: ['OP'], scope: 'team' },
    { id: 'fnb', label: 'Thu ngân F&B', orgKey: 'fb-thu-ngan', scope: 'team' },
    { id: 'nghe_nhan', label: 'Nghệ nhân CTV', orgKey: 'ctv-hat-vi-dam', scope: 'own' },
    { id: 'it_admin', label: 'IT phần mềm/dữ liệu', orgKey: 'ql-phan-mem', scope: 'all' },
    { id: 'tgd', label: 'TGĐ', modules: ['OP','BK','HR','FM','VT','SP','VG','NT','IT'], scope: 'all', canApproveExpense: true }
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
      misc: clone(window.MOCK_MISC)
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      return saved || defaults();
    } catch (err) {
      return defaults();
    }
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function role() {
    return ROLES.find(function (item) { return item.id === currentRoleId; }) || ROLES[0];
  }

  function roleModules() {
    var r = role();
    if (r.all) return MODULES.map(function (m) { return m.code; });
    var modules = (r.modules || []).slice();
    var prefixes = [];
    if (r.orgKey && SOURCE.frMap && SOURCE.frMap[r.orgKey]) prefixes = prefixes.concat(SOURCE.frMap[r.orgKey]);
    if (r.extraModules) modules = modules.concat(r.extraModules);
    prefixes.forEach(function (p) { if (modules.indexOf(p.slice(0, 2)) < 0) modules.push(p.slice(0, 2)); });
    return modules;
  }

  function canViewModule(id) {
    var mod = MODULES.find(function (m) { return m.id === id; });
    return !!mod && roleModules().indexOf(mod.code) >= 0;
  }

  function canApproveExpense() {
    return !!role().canApproveExpense || role().all;
  }

  function canMakeExpense() {
    return role().all || role().canMakeExpense || currentRoleId === 'thu_quy';
  }

  function visibleScreens(moduleId) {
    if (!canViewModule(moduleId)) return [];
    return SCREENS[moduleId] || [];
  }

  function parseRoute() {
    var hash = (location.hash || '#op/dashboard').replace(/^#/, '').split('/');
    var moduleId = hash[0] || 'op';
    var view = hash[1] || ((SCREENS[moduleId] || [])[0] || ['dashboard'])[0];
    if (!canViewModule(moduleId)) {
      var first = MODULES.find(function (m) { return canViewModule(m.id); }) || MODULES[0];
      moduleId = first.id;
      view = (SCREENS[moduleId] || [])[0][0];
      location.hash = moduleId + '/' + view;
    }
    return { moduleId: moduleId, view: view };
  }

  function initControls() {
    var roleSelect = document.getElementById('role-select');
    roleSelect.innerHTML = ROLES.map(function (r) { return '<option value="' + r.id + '">' + UI.esc(r.label) + '</option>'; }).join('');
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
      state = defaults();
      render();
      UI.toast('Đã đặt lại dữ liệu mock cục bộ', 'success');
    };
  }

  function firstRoute() {
    var first = MODULES.find(function (m) { return canViewModule(m.id); }) || MODULES[0];
    return first.id + '/' + (SCREENS[first.id] || [['dashboard']])[0][0];
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
    document.getElementById('screen-subtitle').textContent = 'Vai trò: ' + role().label + ' · scope ' + role().scope + ' · dữ liệu chỉ lưu localStorage';
    return '<div class="page"><div class="page-head"><div><div class="eyebrow">' + mod.code + ' · ' + UI.esc(mod.label) + '</div><h1>' + UI.esc(screen[1]) + '</h1><p class="page-desc">' + UI.esc(extra || 'Prototype mock UI thuần frontend, tái sử dụng FR/NFR/schema từ charts_html và dữ liệu vận hành giả.') + '</p></div></div>' +
      UI.tabs((SCREENS[moduleId] || []).map(function (s) { return { id: s[0], label: s[1] }; }), view, '#' + moduleId) + body + renderFrPanel(mod.code) + '</div>';
  }

  function renderFrPanel(code) {
    var reqs = Object.keys(SOURCE.reqs || {}).map(function (key) { return Object.assign({ code: key }, SOURCE.reqs[key]); }).filter(function (r) { return r.module === code; }).slice(0, 8);
    if (!reqs.length) return '';
    return UI.panel('FR tham chiếu từ charts_html/data/reqs-data.js', '<div class="fr-list">' + reqs.map(function (r) {
      var tone = r.priority === 'P1' ? 'red' : (r.priority === 'P2' ? 'yellow' : 'gray');
      return '<div class="fr-item"><div><span class="fr-code">' + UI.esc(r.code) + '</span> ' + UI.badge(r.priority, tone) + '</div><div class="fr-name">' + UI.esc(r.name) + '</div><div class="fr-desc">' + UI.esc(r.desc) + '</div></div>';
    }).join('') + '</div>');
  }

  function render() {
    var route = parseRoute();
    renderNav(route);
    var app = document.getElementById('app');
    var mod = route.moduleId;
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
    return UI.panel('Sơ đồ buồng phòng real-time', '<div class="note">Bấm vào phòng để đổi trạng thái theo vòng Trống sạch → Có khách → Cần dọn → Bảo trì → Đặt trước.</div><br><div class="room-grid">' + state.op.rooms.map(function (r) {
      var tone = { 'Trống sạch': 'empty', 'Có khách': 'occupied', 'Cần dọn': 'clean', 'Bảo trì': 'maintenance', 'Đặt trước': 'reserved' }[r.status];
      return '<button class="room-tile" data-action="cycle-room" data-room="' + r.id + '" type="button"><div class="room-no">' + r.id + '</div><div class="room-type">' + UI.esc(r.type) + '</div><span class="room-status status-' + tone + '">' + UI.esc(r.status) + '</span><div class="fnb-seat">' + UI.esc(r.guest || r.housekeeper) + '</div></button>';
    }).join('') + '</div>');
  }

  function renderHousekeeping() {
    return UI.panel('Phân công dọn phòng + inspection', UI.table([
      { label: 'Phòng', key: 'room' }, { label: 'Nhân viên', key: 'staff' }, { label: 'Ca', key: 'shift' }, { label: 'Inspection', render: function (r) { return UI.badge(r.inspection, r.inspection === 'Đạt' ? 'green' : 'yellow'); } }, { label: 'Ảnh', key: 'photo' }
    ], state.op.housekeeping));
  }

  function renderPOS() {
    var body = '<div class="grid-2"><div>' + UI.panel('Sơ đồ bàn F&B', '<div class="table-map">' + state.op.tables.map(function (t) {
      return '<div class="fnb-table ' + (t.status === 'Trống' ? 'free' : 'busy') + '"><div class="fnb-name">' + t.id + '</div><div class="fnb-seat">' + UI.esc(t.zone) + '</div><div class="fnb-seat">' + t.seats + ' ghế · ' + UI.esc(t.status) + '</div></div>';
    }).join('') + '</div>') + '</div><div>' + UI.panel('Ghi order', UI.table([
      { label: 'Món', key: 'name' }, { label: 'Giá', render: function (r) { return UI.money(r.price); } }, { label: 'Dị ứng', render: function (r) { return r.allergy ? UI.badge(r.allergy, 'red') : UI.badge('Không', 'green'); } }
    ], state.op.menu), '<button class="btn btn-primary" data-action="open-order" type="button">Thêm order</button>') + '</div></div>';
    body += UI.panel('Order đang chạy', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Bàn', key: 'table' }, { label: 'Khách/phòng', key: 'guest' }, { label: 'Món', render: function (r) { return UI.esc(r.items.join(', ')); } }, { label: 'Tổng', render: function (r) { return UI.money(r.total); } }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đang bếp' ? 'yellow' : 'green'); } }, { label: 'Charge', render: function (r) { return r.chargeToRoom ? UI.badge('Charge-to-room', 'blue') : UI.badge('Tại bàn', 'gray'); } }
    ], state.op.orders));
    return body;
  }

  function renderCheckin() {
    return UI.panel('Check-in / Check-out', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'guest' }, { label: 'Booking', key: 'booking' }, { label: 'Phòng', key: 'room' }, { label: 'CCCD/QR', key: 'cccd' }, { label: 'Thẻ từ', key: 'card' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Đang lưu trú' ? 'green' : 'yellow'); } }
    ], state.op.checkins), '<button class="btn btn-primary" data-action="open-checkin" type="button">Check-in khách</button>');
  }

  function renderRequests() {
    return UI.panel('Yêu cầu/khiếu nại + SLA timer', UI.table([
      { label: 'Mã', key: 'id' }, { label: 'Phòng', key: 'room' }, { label: 'Loại', key: 'type' }, { label: 'Mô tả', key: 'desc' }, { label: 'Phân công', key: 'assigned' }, { label: 'SLA còn', render: function (r) { return UI.badge(r.sla + ' phút', r.sla <= 10 ? 'red' : 'yellow'); } }, { label: 'Trạng thái', key: 'status' }
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
    return '<div class="grid-3">' +
      UI.panel('Báo cáo ngày 07:00', '<div class="note">Tự tổng hợp doanh thu lưu trú, F&B, spa; gửi BLĐ bản mock.</div>') +
      UI.panel('Công suất phòng', '<div class="progress"><span style="width:76%"></span></div><br>76% · RevPAR 1,42tr · ADR 1,88tr') +
      UI.panel('Dịch vụ bổ sung', '<div class="progress"><span style="width:61%"></span></div><br>F&B 22,6tr · Spa 14,4tr · Vé 19,8tr') + '</div>';
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
      { label: 'Mã', key: 'id' }, { label: 'Khách', key: 'guest' }, { label: 'SDT', key: 'phone' }, { label: 'Dịch vụ', key: 'item' }, { label: 'Ngày', render: function (r) { return UI.esc(r.from + ' → ' + r.to); } }, { label: 'Tổng', render: function (r) { return UI.money(r.total); } }, { label: 'Thanh toán', key: 'pay' }, { label: 'Trạng thái', render: function (r) { return UI.badge(r.status, r.status === 'Chờ xác nhận' ? 'yellow' : 'green'); } }
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
    return page('it', view, body, 'Quản trị thiết bị IT, uptime, helpdesk, quyền truy cập từ FR_MAP và backup/DR.');
  }

  function renderAccessMatrix() {
    var keys = ['lt-reception','ql-ngan-quy','ql-ke-toan-th','ctv-hat-vi-dam','ql-phan-mem'];
    var modules = ['OP','BK','HR','FM','VT','SP','VG','NT','IT'];
    var html = '<div class="matrix" style="grid-template-columns:190px repeat(' + modules.length + ', minmax(78px, 1fr))"><div class="head">Vai trò/tổ</div>' + modules.map(function (m) { return '<div class="head">' + m + '</div>'; }).join('');
    keys.forEach(function (key) {
      var name = SOURCE.toData && SOURCE.toData[key] ? SOURCE.toData[key].name : key;
      var allowed = (SOURCE.frMap && SOURCE.frMap[key] || []).map(function (p) { return p.slice(0, 2); });
      html += '<div>' + UI.esc(name) + '</div>' + modules.map(function (m) { return '<div>' + (allowed.indexOf(m) >= 0 ? UI.badge('Có', 'green') : UI.badge('Không', 'gray')) + '</div>'; }).join('');
    });
    html += '</div><br><div class="note">Ma trận này đọc trực tiếp từ FR_MAP của charts_html, dùng để minh họa cấp/thu hồi quyền tập trung.</div>';
    return UI.panel('Bảng vai trò × quyền từ FR_MAP', html);
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

  document.addEventListener('click', function (event) {
    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    var action = actionEl.dataset.action;
    if (action === 'cycle-room') {
      var room = state.op.rooms.find(function (r) { return r.id === actionEl.dataset.room; });
      var list = ['Trống sạch','Có khách','Cần dọn','Bảo trì','Đặt trước'];
      room.status = list[(list.indexOf(room.status) + 1) % list.length];
      if (room.status !== 'Có khách') room.guest = '';
      saveState(); render(); UI.toast('Đã đổi trạng thái phòng ' + room.id + ' thành ' + room.status, 'success');
    }
    if (action === 'open-order') openOrderModal();
    if (action === 'submit-order') {
      var form = document.getElementById('order-form');
      var item = state.op.menu.find(function (m) { return m.id === form.item.value; });
      state.op.orders.unshift({ id: 'OD-' + (1100 + state.op.orders.length), table: form.table.value, guest: form.guest.value, items: [item.name], total: item.price, status: 'Đang bếp', chargeToRoom: form.charge.value === '1' });
      var table = state.op.tables.find(function (t) { return t.id === form.table.value; });
      if (table) table.status = 'Đang phục vụ';
      saveState(); UI.closeModal(); render(); UI.toast('Đã thêm order và in phiếu bếp giả lập', 'success');
    }
    if (action === 'open-checkin') openCheckinModal();
    if (action === 'submit-checkin') {
      var f = document.getElementById('checkin-form');
      state.op.checkins.unshift({ id: 'CI-' + (2500 + state.op.checkins.length), guest: f.guest.value, booking: f.booking.value, room: f.room.value, cccd: f.cccd.value, card: 'Đã giao thẻ', status: 'Đang lưu trú' });
      var r = state.op.rooms.find(function (room) { return room.id === f.room.value; });
      if (r) { r.status = 'Có khách'; r.guest = f.guest.value; }
      saveState(); UI.closeModal(); render(); UI.toast('Đã check-in và cập nhật trạng thái phòng', 'success');
    }
    if (action === 'open-expense') openExpenseModal();
    if (action === 'submit-expense') {
      var ef = document.getElementById('expense-form');
      var amount = Number(ef.amount.value || 0);
      state.fm.expenses.unshift({ id: 'PC-2606-' + String(100 + state.fm.expenses.length), maker: role().label, dept: ef.dept.value, category: ef.category.value, amount: amount, status: amount > 20000000 ? 'Chờ TGĐ duyệt' : 'Chờ KTT duyệt', level: amount > 20000000 ? 'TGĐ' : 'KTT', invoice: ef.invoice.value });
      saveState(); UI.closeModal(); render(); UI.toast('Đã lập phiếu chi. Nút duyệt phụ thuộc vai trò checker.', 'success');
    }
    if (action === 'approve-expense') {
      var expense = state.fm.expenses.find(function (e) { return e.id === actionEl.dataset.id; });
      if (expense && canApproveExpense()) {
        expense.status = 'Đã duyệt';
        saveState(); render(); UI.toast('Đã duyệt phiếu chi theo vai trò checker', 'success');
      }
    }
  });

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () {
    initControls();
    if (!location.hash) location.hash = firstRoute();
    render();
  });
})();
