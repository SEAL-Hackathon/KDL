/* Dữ liệu giả khối Vận hành: phòng, bàn, POS, check-in, yêu cầu, sự cố. */
(function () {
  var roomTypes = ['Superior biển', 'Deluxe vườn', 'Bungalow', 'Family suite'];
  var statuses = ['Trống sạch', 'Có khách', 'Cần dọn', 'Bảo trì', 'Đặt trước'];
  var guests = ['Nguyễn Thị Mai', 'Trần Quốc Hưng', 'Lê Hoàng Anh', 'Phan Minh Châu', 'Võ Đức Tài', 'Đặng Thu Hà', 'Bùi Khánh Linh', 'Hoàng Gia Bảo'];
  var rooms = Array.from({ length: 42 }, function (_, i) {
    var floor = Math.floor(i / 14) + 1;
    return {
      id: 'P' + floor + String((i % 14) + 1).padStart(2, '0'),
      floor: floor,
      type: roomTypes[i % roomTypes.length],
      status: statuses[(i * 2 + floor) % statuses.length],
      guest: statuses[(i * 2 + floor) % statuses.length] === 'Có khách' ? guests[i % guests.length] : '',
      housekeeper: ['Lan', 'Hạnh', 'Tú', 'Nhi', 'Thảo'][i % 5],
      minibar: i % 5 === 0 ? 180000 : 0
    };
  });

  var tables = Array.from({ length: 20 }, function (_, i) {
    return { id: 'B' + String(i + 1).padStart(2, '0'), zone: i < 10 ? 'Nhà hàng Cu Đơ' : 'Bar ven hồ', seats: [2, 4, 6, 8][i % 4], status: i % 3 === 0 ? 'Đang phục vụ' : 'Trống' };
  });

  window.MOCK_OP = {
    rooms: rooms,
    housekeeping: rooms.filter(function (r) { return r.status === 'Cần dọn'; }).slice(0, 10).map(function (r, i) {
      return { room: r.id, staff: r.housekeeper, shift: i % 2 ? 'Chiều 14-22' : 'Sáng 06-14', inspection: i % 3 ? 'Chờ kiểm' : 'Đạt', photo: i % 2 ? 'Ảnh sau dọn đã nhận' : 'Chưa có ảnh' };
    }),
    tables: tables,
    menu: [
      { id: 'M01', name: 'Cháo hàu Lộc Hà', price: 85000, allergy: 'Hải sản' },
      { id: 'M02', name: 'Ram bánh mướt', price: 65000, allergy: '' },
      { id: 'M03', name: 'Gỏi cá đục', price: 145000, allergy: 'Hải sản' },
      { id: 'M04', name: 'Cu đơ Hà Tĩnh', price: 45000, allergy: 'Lạc' },
      { id: 'M05', name: 'Trà thảo dược Hương Sơn', price: 39000, allergy: '' }
    ],
    orders: [
      { id: 'OD-1001', table: 'B01', guest: 'Phòng P103', items: ['Cháo hàu Lộc Hà', 'Trà thảo dược'], total: 124000, status: 'Đang bếp', chargeToRoom: true },
      { id: 'OD-1002', table: 'B07', guest: 'Walk-in', items: ['Ram bánh mướt', 'Cu đơ Hà Tĩnh'], total: 110000, status: 'Đã phục vụ', chargeToRoom: false }
    ],
    checkins: [
      { id: 'CI-2406', guest: 'Nguyễn Thị Mai', booking: 'BK-240610-001', room: 'P103', cccd: 'QR giả lập', card: 'Đã giao thẻ', status: 'Đang lưu trú' },
      { id: 'CI-2407', guest: 'Trần Quốc Hưng', booking: 'Walk-in', room: 'P214', cccd: 'CCCD ảnh giả', card: 'Chờ thẻ', status: 'Chờ xác minh' }
    ],
    requests: [
      { id: 'SLA-01', room: 'P103', type: 'Khăn tắm', desc: 'Khách cần thêm 2 khăn', assigned: 'Concierge', sla: 8, status: 'Đang xử lý' },
      { id: 'SLA-02', room: 'P208', type: 'Khiếu nại', desc: 'Điều hòa ồn', assigned: 'Kỹ thuật điện', sla: 24, status: 'Escalate P2' },
      { id: 'SLA-03', room: 'P302', type: 'Y tế', desc: 'Khách dị ứng hải sản nhẹ', assigned: 'Y tá', sla: 5, status: 'Ưu tiên' }
    ],
    techTickets: [
      { id: 'KT-210', location: 'P208', issue: 'Điều hòa kêu lớn', priority: 'P2', before: 'Ảnh trước giả', after: 'Chưa có', status: 'Đang sửa', cost: 0 },
      { id: 'KT-211', location: 'Hồ bơi', issue: 'Đèn cảnh quan chập chờn', priority: 'P3', before: 'Ảnh trước giả', after: 'Ảnh sau giả', status: 'Đã đóng', cost: 450000 }
    ],
    securityLogs: [
      { time: '06:00', shift: 'Sáng', staff: 'Bảo vệ Cường', note: 'Giao ca bình thường, niêm phong kho nguyên vẹn' },
      { time: '13:40', shift: 'Chiều', staff: 'Bảo vệ Lâm', note: 'Hỗ trợ khách thất lạc ví tại cổng chính' },
      { time: '22:15', shift: 'Đêm', staff: 'Bảo vệ Phúc', note: 'Tuần tra khu bungalow, không phát sinh' }
    ]
  };
})();
