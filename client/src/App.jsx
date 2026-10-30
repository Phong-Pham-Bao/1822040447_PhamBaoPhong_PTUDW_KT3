import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LoginForm from './components/LoginForm.jsx';
import ProductList from './components/ProductList.jsx';

/**
 * Main Application Component
 * Sinh vien: Pham Bao Phong - MSSV: 1822040447
 */
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Khi dang nhap thanh cong tu LoginForm
  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser || { email: 'admin@gmail.com', role: 'admin' });
  };

  // Xu ly Dang xuat: Xoa khoi localStorage va reset state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  // Tinh nang demo kiem thu: Co tinh lam hong token de kiem tra 403 Forbidden
  const handleCorruptToken = () => {
    const fakeToken = 'THIS_IS_AN_INVALID_TOKEN_FOR_TESTING_403';
    localStorage.setItem('token', fakeToken);
    setToken(fakeToken);
    alert('⚠️ Đã thay thế Token trong localStorage thành token không hợp lệ!\nComponent sẽ tự động gửi token này để kiểm tra phản hồi 403 Forbidden từ Middleware Express.');
  };

  return (
    <div className="app-layout">
      {/* Thanh Header / Navbar */}
      <Navbar
        user={token ? user : null}
        onLogout={handleLogout}
        onCorruptToken={handleCorruptToken}
      />

      <main className="main-content">
        <div className="container">
          {/* Hien thi co dieu kien: Neu chua co token thi hien Form Dang Nhap, neu da co thi hien Danh sach san pham */}
          {!token ? (
            <div className="auth-wrapper">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
          ) : (
            <div className="dashboard-wrapper">
              <ProductList onRequireLogin={handleLogout} />
            </div>
          )}
        </div>
      </main>

      <footer className="footer-container">
        <div className="container footer-content">
          <p>© 2026 - BÀI KIỂM TRA 3: KẾT HỢP REACT VÀ NODE.JS</p>
          <p>Sinh viên thực hiện: <strong>Phạm Bảo Phong</strong> | MSSV: <strong>1822040447</strong></p>
        </div>
      </footer>
    </div>
  );
}
