/* Dữ liệu giả Spa, Vui chơi, Nghệ thuật dân gian, IT. */
(function () {
  window.MOCK_MISC = {
    spa: {
      services: [
        { name: 'Massage đá nóng Hà Tĩnh', duration: 90, price: 850000, status: 'Đang bán' },
        { name: 'Xông thảo dược Hương Sơn', duration: 45, price: 420000, status: 'Đang bán' },
        { name: 'Chăm sóc da phục hồi nắng biển', duration: 60, price: 680000, status: 'Đang bán' }
      ],
      bookings: [
        { time: '09:00', room: 'Spa 01', guest: 'Nguyễn Lan Anh', service: 'Massage đá nóng', ktv: 'Hồ Bích Ngọc', status: 'Đã check-in' },
        { time: '10:30', room: 'Spa 02', guest: 'Trần Minh Đức', service: 'Xông thảo dược', ktv: 'Chờ phân công', status: 'Chờ check-in' },
        { time: '14:00', room: 'Spa 03', guest: 'Phan Minh Châu', service: 'Chăm sóc da', ktv: 'Võ Thu Trang', status: 'Đã đặt' }
      ],
      cards: [
        { owner: 'Bùi Khánh Linh', package: 'Thẻ 10 buổi xông', balance: '7 buổi', expire: '31/12/2026' }
      ]
    },
    vg: {
      counters: [
        { area: 'Công viên nước', count: 218, capacity: 250 },
        { area: 'Khu trò chơi dân gian', count: 86, capacity: 140 },
        { area: 'Bãi biển thể thao', count: 132, capacity: 160 }
      ],
      checklists: [
        { device: 'Máng trượt 01', mechanical: 'Đạt', electric: 'Đạt', hygiene: 'Đạt', sign: 'Đạt', status: 'Cho mở' },
        { device: 'Nhà phao nước', mechanical: 'Đạt', electric: 'Không áp dụng', hygiene: 'Cần vệ sinh', sign: 'Đạt', status: 'Tạm dừng' }
      ],
      incidents: [
        { id: 'SC-01', area: 'Công viên nước', type: 'Trượt ngã nhẹ', severity: 'P3', status: 'Đã sơ cứu' }
      ]
    },
    nt: {
      schedules: [
        { id: 'NT-01', title: 'Đêm Ví Dặm bên hồ', date: 'Thứ 7, 13/06', time: '19:30', venue: 'Sân khấu ven hồ', artists: 5, musicians: 2, published: true },
        { id: 'NT-02', title: 'Giao lưu dân ca Nghệ Tĩnh', date: 'Chủ nhật, 14/06', time: '18:30', venue: 'Nhà hàng Cu Đơ', artists: 2, musicians: 1, published: false }
      ],
      artists: [
        { name: 'Nghệ nhân Nguyễn Văn Lộc', role: 'Hát Ví Dặm', shows: 12, own: true },
        { name: 'Nghệ nhân Trần Thị Sen', role: 'Đàn nhị', shows: 9, own: false },
        { name: 'Nghệ nhân Hồ Thị Mận', role: 'Hát đối', shows: 7, own: false }
      ],
      contracts: [
        { artist: 'Nghệ nhân Nguyễn Văn Lộc', period: '06/2026', amount: 7200000, tax: 'Khấu trừ TNCN 10%', status: 'Chờ ký điện tử' },
        { artist: 'Nghệ nhân Trần Thị Sen', period: '06/2026', amount: 5400000, tax: 'Khấu trừ TNCN 10%', status: 'Đã ký' }
      ]
    },
    it: {
      assets: [
        { code: 'IT-01', name: 'Firewall cổng chính', location: 'Phòng server', status: 'Tốt', warranty: '12/2027' },
        { code: 'IT-02', name: 'POS nhà hàng 01', location: 'Nhà hàng Cu Đơ', status: 'Cần cập nhật', warranty: '04/2027' },
        { code: 'IT-03', name: 'Camera hồ bơi 03', location: 'Hồ bơi', status: 'Mất tín hiệu', warranty: '09/2026' }
      ],
      services: [
        { name: 'PMS nội bộ', uptime: 99.97, status: 'Online', mttr: '12 phút' },
        { name: 'ERP kế toán', uptime: 99.82, status: 'Online', mttr: '24 phút' },
        { name: 'Web booking', uptime: 99.91, status: 'Online', mttr: '18 phút' },
        { name: 'Email/Zalo OA', uptime: 99.48, status: 'Cảnh báo', mttr: '42 phút' }
      ],
      tickets: [
        { id: 'HD-01', reporter: 'Lễ tân', priority: 'Cao', desc: 'Máy đọc QR chập chờn', sla: '4h', status: 'Đang xử lý' },
        { id: 'HD-02', reporter: 'F&B', priority: 'Khẩn', desc: 'POS không in bếp', sla: '30 phút', status: 'Đã phân công' }
      ],
      backups: [
        { target: 'PMS', time: '02:00 10/06', size: '18 GB', status: 'Thành công', verified: 'Đã kiểm' },
        { target: 'ERP', time: '02:30 10/06', size: '9 GB', status: 'Thành công', verified: 'Chờ test quý' }
      ]
    }
  };
})();
