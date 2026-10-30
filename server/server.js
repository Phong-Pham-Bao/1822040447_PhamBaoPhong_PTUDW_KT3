/**
 * Express Server API - Ket hop React va Node.js
 * Sinh vien: Pham Bao Phong - MSSV: 1822040447
 * Mon hoc: Phat trien ung dung web - Chuong 4: JWT & Phan quyen
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { xacThuc, SECRET_KEY } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. CAU HINH MIDDLEWARE CO BAN
// ==========================================

// Cau hinh CORS: Cho phep Client React (Vite: port 5173) truy cap API
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    // Cho phep request tu allowedOrigins hoac tools nhu Postman/Curl (origin undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS khong cho phep truy cap tu Origin nay: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Doc du lieu request body o dinh dang JSON
app.use(express.json());

// Log don gian de theo doi cac request den server
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. DU LIEU MAU (MOCK DATA)
// ==========================================

const danhSachSanPham = [
  {
    id: 1,
    tenSanPham: 'Bút bi cao cấp Parker Jotter',
    gia: 350000,
    soLuong: 45,
    danhMuc: 'Bút viết',
    moTa: 'Bút bi kim loại mạ crom sáng bóng, mực êm trơn.'
  },
  {
    id: 2,
    tenSanPham: 'Vở ghi chép Klong 200 trang Caro B5',
    gia: 35000,
    soLuong: 150,
    danhMuc: 'Sổ - Vở',
    moTa: 'Giấy định lượng 100gsm chống thấm nhòe, bìa cứng sang trọng.'
  },
  {
    id: 3,
    tenSanPham: 'Thước kẻ nhôm định hình 30cm Deli',
    gia: 22000,
    soLuong: 80,
    danhMuc: 'Dụng cụ học tập',
    moTa: 'Thước vạch chia chính xác, hợp kim nhôm chống trầy.'
  },
  {
    id: 4,
    tenSanPham: 'Hộp bút vải Canvas đa năng phong cách Hàn Quốc',
    gia: 65000,
    soLuong: 35,
    danhMuc: 'Phụ kiện',
    moTa: 'Sức chứa lớn hơn 50 bút, khóa kéo mượt mà.'
  },
  {
    id: 5,
    tenSanPham: 'Bộ 6 bút dạ quang Pastel Stabilo Boss',
    gia: 120000,
    soLuong: 60,
    danhMuc: 'Bút viết',
    moTa: 'Màu sắc nhã nhặn, công nghệ chống khô mực đến 4 giờ.'
  },
  {
    id: 6,
    tenSanPham: 'Máy tính khoa học Casio FX-580VN X',
    gia: 680000,
    soLuong: 25,
    danhMuc: 'Thiết bị điện tử',
    moTa: 'Tốc độ xử lý siêu nhanh, 521 tính năng toán học.'
  }
];

// ==========================================
// 3. XAY DUNG CAC ROUTE & API
// ==========================================

// Route kiem tra trang thai server
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend Node.js + Express dang hoat dong binh thuong!',
    author: 'Pham Bao Phong - 1822040447',
    endpoints: {
      login: 'POST /login',
      products: 'GET /api/products (Requires Bearer Token)'
    }
  });
});

/**
 * API Dang nhap (POST /login)
 * Body: { email, matKhau }
 */
app.post('/login', (req, res) => {
  const { email, matKhau } = req.body;

  // Kiem tra du thong tin hay khong
  if (!email || !matKhau) {
    return res.status(400).json({
      success: false,
      message: 'Vui long cung cap day du email va mat khau!'
    });
  }

  // Hardcode xac thuc theo de bai yeu cau:
  // email === "admin@gmail.com" va matKhau === "123456"
  if (email === 'admin@gmail.com' && matKhau === '123456') {
    // Tao payload chua thong tin can thiet cua nguoi dung
    const payload = {
      email: email,
      role: 'admin',
      fullName: 'Phạm Bảo Phong',
      studentId: '1822040447'
    };

    // Tao JWT Token su dung jwt.sign() voi thoi han 2 gio
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '2h'
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: token,
      user: payload
    });
  } else {
    // Neu sai thong tin dang nhap, tra ve status 401 Unauthorized
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác!'
    });
  }
});

/**
 * API Danh sach san pham (GET /api/products)
 * Day la Protected Route: Can co middleware xacThuc kiem tra token hop le
 */
app.get('/api/products', xacThuc, (req, res) => {
  // Neu qua duoc middleware xacThuc, thong tin user se nam o req.user
  return res.status(200).json({
    success: true,
    message: 'Lấy danh sách sản phẩm thành công!',
    currentUser: req.user,
    total: danhSachSanPham.length,
    data: danhSachSanPham
  });
});

// Khoi dong Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Server dang chay tai: http://localhost:${PORT}`);
  console.log(` Client React duoc phep truy cap tu: http://localhost:5173`);
  console.log(` Sinh vien: Pham Bao Phong - MSSV: 1822040447`);
  console.log(`====================================================`);
});
