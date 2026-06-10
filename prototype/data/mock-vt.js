/* Dữ liệu giả vật tư, tài sản, tồn kho, NCC. */
(function () {
  window.MOCK_VT = {
    assets: [
      { code: 'TS-001', name: 'Máy bơm hồ bơi chính', area: 'Hồ bơi', qr: 'QR-TS-001', status: 'Đang hoạt động', value: 86000000 },
      { code: 'TS-002', name: 'Máy pha cà phê Ý', area: 'Bar ven hồ', qr: 'QR-TS-002', status: 'Cần bảo trì', value: 62000000 },
      { code: 'TS-003', name: 'Máy in bếp', area: 'Bếp nóng', qr: 'QR-TS-003', status: 'Đang hoạt động', value: 8500000 }
    ],
    stock: [
      { code: 'VT-HAU', name: 'Hàu Lộc Hà', unit: 'kg', onhand: 18, min: 25, quota: 12, status: 'Dưới tối thiểu' },
      { code: 'VT-CUDO', name: 'Cu đơ Hà Tĩnh', unit: 'hộp', onhand: 120, min: 50, quota: 35, status: 'Đủ' },
      { code: 'VT-THAODUOC', name: 'Thảo dược xông Hương Sơn', unit: 'gói', onhand: 32, min: 30, quota: 10, status: 'Cận mức' },
      { code: 'VT-KHAN', name: 'Khăn tắm trắng', unit: 'cái', onhand: 280, min: 180, quota: 75, status: 'Đủ' }
    ],
    imports: [
      { id: 'PN-01', item: 'Hàu Lộc Hà', qty: 40, amount: 3600000, maker: 'Thủ kho F&B', status: 'Chờ duyệt' },
      { id: 'PN-02', item: 'Khăn tắm trắng', qty: 120, amount: 9600000, maker: 'Thủ kho', status: 'Đã duyệt' }
    ],
    exports: [
      { id: 'PX-01', item: 'Thảo dược xông Hương Sơn', dept: 'Spa', qty: 12, status: 'Vượt định mức 20%' },
      { id: 'PX-02', item: 'Cu đơ Hà Tĩnh', dept: 'F&B', qty: 30, status: 'Trong định mức' }
    ],
    maintenance: [
      { id: 'BT-01', asset: 'Máy pha cà phê Ý', symptom: 'Áp suất yếu', tech: 'Tổ Cơ khí', status: 'Lên lịch 14/06', cost: 1200000 },
      { id: 'BT-02', asset: 'Máy bơm hồ bơi chính', symptom: 'Rung nhẹ', tech: 'Tổ Điện nước', status: 'Theo dõi', cost: 0 }
    ],
    suppliers: [
      { name: 'Hải sản Lộc Hà', score: 91, quote: 3600000, legal: 'Đủ hồ sơ' },
      { name: 'Thực phẩm Hồng Lĩnh', score: 84, quote: 3900000, legal: 'Cần bổ sung VSATTP' },
      { name: 'HTX Thảo dược Hương Sơn', score: 95, quote: 2400000, legal: 'Đủ hồ sơ' }
    ]
  };
})();
