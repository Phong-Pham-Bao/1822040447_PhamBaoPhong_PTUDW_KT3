/**
 * Middleware xac thuc JWT (Authentication Middleware)
 * Sinh vien: Pham Bao Phong - MSSV: 1822040447
 * Hoc phan: Phat trien ung dung web - Bai KT3
 */

const jwt = require('jsonwebtoken');

// Secret key dung de ky va xac thuc token (dong bo voi server.js)
const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY_PHONG_1822040447_KTHP_PTUDW';

/**
 * Middleware xac thuc Token tu request header
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function xacThuc(req, res, next) {
  // 1. Lay gia tri tu Header Authorization
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  // 2. Kiem tra xem Header co ton tai va dung dinh dang 'Bearer <token>' khong
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Khong tim thay Token xac thuc! Vui long dang nhap de tiep tuc.'
    });
  }

  // Header thuong co dang: "Bearer eyJhbGciOi..."
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Dinh dang Token khong hop le! Dinh dang chuan: Bearer <token>'
    });
  }

  const token = parts[1];

  // 3. Su dung jwt.verify() de xac thuc chu ky va thoi han cua token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Neu token het han hoac bi sua doi, tra ve ma 403 Forbidden
      return res.status(403).json({
        success: false,
        message: 'Token khong hop le hoac da het han! Vui long dang nhap lai.',
        errorDetail: err.message
      });
    }

    // 4. Neu token hop le, gan thong tin payload da decode vao req.user
    req.user = decoded;

    // 5. Goi next() de chuyen tiep sang route xu ly tiep theo
    next();
  });
}

module.exports = {
  xacThuc,
  SECRET_KEY
};
