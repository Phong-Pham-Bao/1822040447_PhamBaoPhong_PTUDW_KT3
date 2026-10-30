import React from 'react';

/**
 * Component Navbar - Thanh điều hướng & hiển thị trạng thái phiên làm việc
 * @param {{ user: any, onLogout: () => void, onCorruptToken: () => void }} props
 */
export default function Navbar({ user, onLogout, onCorruptToken }) {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <span className="brand-badge">KT3</span>
        <div>
          <h1 className="brand-title">Hệ Thống Quản Lý Sản Phẩm Bảo Mật</h1>
          <p className="brand-subtitle">
            Học phần: Phát triển ứng dụng Web | SV: Phạm Bảo Phong - MSSV: 1822040447
          </p>
        </div>
      </div>

      <div className="navbar-actions">
        {user ? (
          <div className="user-profile">
            <span className="user-badge">🛡️ {user.role || 'Admin'}</span>
            <span className="user-email">{user.email}</span>
            <button
              onClick={onCorruptToken}
              className="btn btn-warning btn-sm"
              title="Cố tình làm sai lệch token trong localStorage để kiểm tra middleware 403"
            >
              ⚠️ Thử Token Lỗi (403)
            </button>
            <button
              onClick={onLogout}
              className="btn btn-danger btn-sm"
              title="Đăng xuất và xóa token khỏi localStorage"
            >
              🚪 Đăng xuất
            </button>
          </div>
        ) : (
          <div className="guest-badge">
            <span className="dot dot-offline"></span> Chưa đăng nhập
          </div>
        )}
      </div>
    </header>
  );
}
