/* Dữ liệu giả Web Booking. */
(function () {
  window.MOCK_BK = {
    services: [
      { id: 'SV-01', type: 'Phòng', name: 'Bungalow ven hồ', price: 1850000, capacity: 3, status: 'Còn chỗ' },
      { id: 'SV-02', type: 'Phòng', name: 'Family suite biển Thiên Cầm', price: 2450000, capacity: 5, status: 'Còn 2 phòng' },
      { id: 'SV-03', type: 'Vé', name: 'Combo vui chơi trong ngày', price: 220000, capacity: 250, status: 'Mở bán' },
      { id: 'SV-04', type: 'Activity', name: 'Đêm Ví Dặm cuối tuần', price: 180000, capacity: 80, status: 'Mở bán' },
      { id: 'SV-05', type: 'F&B', name: 'Set đặc sản Hà Tĩnh', price: 420000, capacity: 60, status: 'Mở bán' }
    ],
    bookings: [
      { id: 'BK-240610-001', guest: 'Nguyễn Thị Mai', phone: '0912345678', item: 'Bungalow ven hồ', from: '2026-06-10', to: '2026-06-12', total: 3700000, status: 'Đã xác nhận', pay: 'VNPay' },
      { id: 'BK-240610-002', guest: 'Phan Minh Châu', phone: '0987654321', item: 'Combo vui chơi trong ngày', from: '2026-06-10', to: '2026-06-10', total: 880000, status: 'Chờ xác nhận', pay: 'Pay-at-resort' },
      { id: 'BK-240609-009', guest: 'Lê Hoàng Anh', phone: '0905123456', item: 'Family suite biển Thiên Cầm', from: '2026-06-11', to: '2026-06-13', total: 4900000, status: 'Check-in', pay: 'MoMo' }
    ],
    vouchers: [
      { code: 'HATINH20', value: '20%', condition: 'Tối thiểu 2 đêm', used: 38, status: 'Đang chạy' },
      { code: 'VIDAM', value: '100.000đ', condition: 'Kèm vé Ví Dặm', used: 12, status: 'Đang chạy' }
    ],
    reviews: [
      { guest: 'Bùi Khánh Linh', rating: 5, text: 'Nhân viên lễ tân hỗ trợ nhanh, món cháo hàu ngon.' },
      { guest: 'Hoàng Gia Bảo', rating: 4, text: 'Phòng sạch, khu vui chơi đông vào cuối tuần.' }
    ]
  };
})();
