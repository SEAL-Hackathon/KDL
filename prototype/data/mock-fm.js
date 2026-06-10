/* Dữ liệu giả tài chính: ngân sách, thu, chi, công nợ, quỹ. */
(function () {
  window.MOCK_FM = {
    budgets: [
      { dept: 'Lưu trú', plan: 420000000, actual: 312000000, status: 'Trong ngưỡng' },
      { dept: 'F&B', plan: 360000000, actual: 385000000, status: 'Vượt 6,9%' },
      { dept: 'Spa', plan: 110000000, actual: 76000000, status: 'Trong ngưỡng' },
      { dept: 'Nghệ thuật', plan: 95000000, actual: 88000000, status: 'Cần theo dõi' }
    ],
    expenses: [
      { id: 'PC-2606-001', maker: 'Thủ quỹ Hương', dept: 'F&B', category: 'Nguyên liệu đặc sản', amount: 6300000, status: 'Chờ KTT duyệt', level: 'KTT', invoice: 'HD-8891' },
      { id: 'PC-2606-002', maker: 'Kế toán chi phí', dept: 'Kỹ thuật', category: 'Sửa bơm hồ bơi', amount: 23800000, status: 'Chờ TGĐ duyệt', level: 'TGĐ', invoice: 'HD-8892' },
      { id: 'PC-2606-003', maker: 'Thủ quỹ Hương', dept: 'Nghệ thuật', category: 'Thù lao CTV Ví Dặm', amount: 4200000, status: 'Đã duyệt', level: 'KTT', invoice: 'BB-NT-12' }
    ],
    revenues: [
      { source: 'Booking online', amount: 118000000, date: '2026-06-10', status: 'Đã đối soát' },
      { source: 'Quầy lễ tân', amount: 38400000, date: '2026-06-10', status: 'Chênh 80.000đ' },
      { source: 'F&B', amount: 22600000, date: '2026-06-10', status: 'Chờ khóa ca' },
      { source: 'Spa', amount: 14400000, date: '2026-06-10', status: 'Đã đối soát' }
    ],
    debts: [
      { partner: 'NCC hải sản Lộc Hà', type: 'Phải trả', amount: 52000000, due: '2026-06-18', status: 'Sắp đến hạn' },
      { partner: 'Công ty Du lịch Lam Hồng', type: 'Phải thu', amount: 76000000, due: '2026-06-25', status: 'Trong hạn' }
    ],
    cash: [
      { shift: 'Sáng', opener: 35000000, revenue: 18400000, paid: 6200000, close: 47200000, checker: '2 người kiểm' },
      { shift: 'Chiều', opener: 47200000, revenue: 20000000, paid: 1200000, close: 66000000, checker: 'Chờ đối soát' }
    ]
  };
})();
