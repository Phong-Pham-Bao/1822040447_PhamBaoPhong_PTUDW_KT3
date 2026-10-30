import React, { useState, useEffect } from 'react';

/**
 * Component ProductList - Hiển thị danh sách sản phẩm bảo vệ bằng JWT
 * Đáp ứng đầy đủ 3 state: data, loading, error và vòng đời useEffect
 * @param {{ onRequireLogin: () => void }} props
 */
export default function ProductList({ onRequireLogin }) {
  // 1. Khai báo 3 state bắt buộc theo yêu cầu đề bài
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm gọi API /api/products có gắn kèm JWT Bearer Token
  const fetchProducts = async () => {
    // Bắt đầu gọi API: kích hoạt loading, reset lỗi cũ
    setLoading(true);
    setError(null);

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Không tìm thấy Token xác thực! Bạn chưa đăng nhập.');
      setLoading(false);
      return;
    }

    try {
      // Gửi GET request kèm Header Authorization: Bearer <token>
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Chuyển đổi response HTTP sang đối tượng JavaScript JSON
      const resData = await response.json();

      if (!response.ok) {
        // Xử lý khi token bị sai (403), hết hạn hoặc thiếu (401)
        throw new Error(
          resData.message || `Lỗi máy chủ với mã trạng thái: ${response.status}`
        );
      }

      // Cập nhật state data nếu gọi API thành công
      setData(resData.data || []);
    } catch (err) {
      // Cập nhật state error khi xảy ra sự cố
      setError(err.message || 'Lỗi không xác định khi tải dữ liệu sản phẩm!');
    } finally {
      // Kết thúc quá trình gọi API: tắt trạng thái loading
      setLoading(false);
    }
  };

  // 2. Vòng đời Component: Gọi API ngay khi component được Mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="card product-card">
      <div className="card-header flex-between">
        <div>
          <h2 className="card-title">📦 Danh Sách Sản Phẩm Bảo Mật</h2>
          <p className="card-subtitle">
            Dữ liệu được bảo vệ bởi Express Middleware <code>xacThuc</code> (JWT Bearer Auth)
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            🔄 Tải lại dữ liệu
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* TRƯỜNG HỢP 1: ĐANG TẢI (LOADING = TRUE) */}
        {loading && (
          <div className="state-container loading-state">
            <div className="spinner"></div>
            <p className="state-text">⏳ Đang tải danh sách sản phẩm từ máy chủ Express...</p>
            <span className="state-sub">Vui lòng chờ trong giây lát (Async Fetching)</span>
          </div>
        )}

        {/* TRƯỜNG HỢP 2: GẶP LỖI (ERROR !== NULL) */}
        {!loading && error && (
          <div className="state-container error-state">
            <div className="error-icon">❌</div>
            <h3 className="error-title">Truy Cập Bị Từ Chối hoặc Xảy Ra Lỗi</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button onClick={fetchProducts} className="btn btn-warning">
                🔁 Thử lại
              </button>
              <button onClick={onRequireLogin} className="btn btn-primary">
                🔑 Đăng nhập lại
              </button>
            </div>
          </div>
        )}

        {/* TRƯỜNG HỢP 3: THÀNH CÔNG VÀ CÓ DỮ LIỆU */}
        {!loading && !error && data && data.length > 0 && (
          <div className="products-view">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th className="text-right">Đơn Giá</th>
                    <th className="text-center">Kho</th>
                    <th>Mô Tả</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted">#{item.id}</td>
                      <td className="product-name">
                        <strong>{item.tenSanPham}</strong>
                      </td>
                      <td>
                        <span className="category-pill">{item.danhMuc}</span>
                      </td>
                      <td className="text-right text-price">
                        {formatCurrency(item.gia)}
                      </td>
                      <td className="text-center">
                        <span className="stock-badge">{item.soLuong} cái</span>
                      </td>
                      <td className="text-muted text-sm">{item.moTa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Danh sách thẻ hiển thị dạng <li> theo đúng mô tả đề bài */}
            <div className="raw-list-section">
              <h4 className="raw-list-title">📋 Danh sách rút gọn (Dạng thẻ &lt;li&gt;):</h4>
              <ul className="products-list-ul">
                {data.map((item) => (
                  <li key={item.id} className="product-list-item">
                    <span className="item-bullet">🔹</span>
                    <strong>{item.tenSanPham}</strong> — Giá:{' '}
                    <span className="item-price">{formatCurrency(item.gia)}</span> | Số lượng:{' '}
                    <code>{item.soLuong}</code> ({item.danhMuc})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TRƯỜNG HỢP 4: KHÔNG CÓ DỮ LIỆU NÀO */}
        {!loading && !error && (!data || data.length === 0) && (
          <div className="state-container empty-state">
            <p>📭 Hiện chưa có sản phẩm nào trong kho lưu trữ.</p>
          </div>
        )}
      </div>
    </div>
  );
}
