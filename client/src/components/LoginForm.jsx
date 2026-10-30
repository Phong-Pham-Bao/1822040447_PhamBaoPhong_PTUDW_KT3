import React, { useState } from 'react';

/**
 * Component LoginForm - Form đăng nhập xác thực JWT
 * @param {{ onLoginSuccess: (token: string, user: any) => void }} props
 */
export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm điền nhanh tài khoản admin theo yêu cầu đề bài
  const handleQuickFill = () => {
    setEmail('admin@gmail.com');
    setMatKhau('123456');
    setErrorMessage('');
  };

  // Xử lý gửi Form Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Gửi POST request tới API /login của backend (port 3000)
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, matKhau })
      });

      // Chuyển đổi phản hồi HTTP thành đối tượng JSON
      const resData = await response.json();

      if (!response.ok) {
        // Ném lỗi nếu server trả về status 401 hoặc lỗi khác
        throw new Error(resData.message || 'Đăng nhập không thành công!');
      }

      // Lưu Token vào localStorage theo đúng yêu cầu đề bài
      localStorage.setItem('token', resData.token);
      if (resData.user) {
        localStorage.setItem('user', JSON.stringify(resData.user));
      }

      // Gọi callback để thông báo cho component cha (App.jsx)
      onLoginSuccess(resData.token, resData.user);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ Express!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card login-card">
      <div className="card-header">
        <div className="login-icon">🔐</div>
        <h2 className="card-title">Đăng Nhập Quản Trị</h2>
        <p className="card-subtitle">
          Vui lòng nhập tài khoản để nhận JWT Token và truy cập danh sách sản phẩm
        </p>
      </div>

      <div className="card-body">
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Địa chỉ Email:</label>
            <input
              id="email"
              type="email"
              required
              className="form-control"
              placeholder="VD: admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="matKhau">Mật khẩu:</label>
            <input
              id="matKhau"
              type="password"
              required
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
            >
              {isSubmitting ? '🔄 Đang xác thực...' : '🚀 Đăng Nhập'}
            </button>

            <button
              type="button"
              onClick={handleQuickFill}
              className="btn btn-outline btn-block"
            >
              ⚡ Điền nhanh tài khoản Admin mẫu
            </button>
          </div>
        </form>

        <div className="login-hints">
          <p className="hint-title">📌 Tài khoản mẫu hợp lệ:</p>
          <p>Email: <code>admin@gmail.com</code> | Mật khẩu: <code>123456</code></p>
        </div>
      </div>
    </div>
  );
}
