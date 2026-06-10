/* Dữ liệu giả nhân sự, ca, phép, lương, CTV. */
(function () {
  var names = ['Nguyễn Lan Anh','Trần Minh Đức','Lê Thị Hạnh','Phan Quốc Bảo','Võ Thu Trang','Đặng Anh Tuấn','Bùi Hà My','Hoàng Văn Long','Dương Khánh Linh','Mai Đức Huy','Ngô Thanh Tâm','Hồ Bích Ngọc','Đinh Quang Vinh','Cao Thị Như','Phạm Hải Nam','Tạ Minh Châu','Lương Gia Hân','Trịnh Bảo Ngân','Chu Hoàng Sơn','Đỗ Ngọc Ánh','Lê Thành Đạt','Nguyễn Thảo Vy','Trần Quốc Khánh','Võ Minh Tâm','Phan Hồng Nhung','Đặng Hoài Nam','Bùi Thị Mai','Hoàng Đức Anh','Dương Nhật Linh','Ngô Bảo Trâm','Hồ Gia Khang','Đinh Thu Phương','Cao Minh Khoa','Phạm Quỳnh Anh','Tạ Hoàng Minh','Lương Thanh Hà','Trịnh Đức Toàn','Chu Mỹ Duyên','Đỗ Quang Huy','Mai Thanh Thảo'];
  var depts = ['Lễ tân', 'Buồng phòng', 'F&B', 'Kỹ thuật', 'An ninh', 'Spa', 'Tài chính', 'Nhân sự'];
  var employees = names.map(function (name, i) {
    return { code: 'NV' + String(i + 1).padStart(3, '0'), name: name, dept: depts[i % depts.length], role: i % 7 === 0 ? 'Tổ trưởng' : 'Nhân viên', shift: ['Sáng 06-14','Chiều 14-22','Đêm 22-06','Hành chính'][i % 4], status: i % 13 === 0 ? 'Theo mùa' : 'Đang làm', salary: 7800000 + (i % 9) * 850000 };
  });
  window.MOCK_HR = {
    employees: employees,
    attendances: employees.slice(0, 12).map(function (e, i) { return { code: e.code, name: e.name, shift: e.shift, checkin: i % 4 ? 'Đúng giờ' : 'Muộn 12 phút', overtime: i % 5 === 0 ? '2 giờ' : '0' }; }),
    leaves: [
      { id: 'P-01', name: 'Võ Thu Trang', dept: 'F&B', days: '12/06 - 13/06', reason: 'Việc gia đình', status: 'Chờ duyệt' },
      { id: 'P-02', name: 'Ngô Thanh Tâm', dept: 'Spa', days: '15/06', reason: 'Khám bệnh', status: 'Đã duyệt' }
    ],
    payroll: employees.slice(0, 10).map(function (e) { return { code: e.code, name: e.name, dept: e.dept, period: '06/2026', net: e.salary, status: e.code.endsWith('1') ? 'Chờ KTT duyệt' : 'Nháp' }; }),
    ctv: [
      { name: 'Nghệ nhân Nguyễn Văn Lộc', specialty: 'Hát Ví Dặm', rate: 900000, status: 'Hợp đồng còn hạn' },
      { name: 'Nghệ nhân Trần Thị Sen', specialty: 'Nhạc cụ dân gian', rate: 750000, status: 'Chờ ký điện tử' },
      { name: 'CTV Phạm Hoài An', specialty: 'Hướng dẫn viên địa phương', rate: 500000, status: 'Theo sự kiện' }
    ]
  };
})();
