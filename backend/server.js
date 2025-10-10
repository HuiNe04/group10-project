const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware phải có
app.use(cors());
app.use(express.json()); // <==== Cực kỳ quan trọng

// ===== Mảng tạm users =====
let users = [
  { id: 1, name: 'Khanh', email: 'khanh@example.com' },
  { id: 2, name: 'Huyen Anh', email: 'huyenanh@example.com' },
  { id: 3, name: 'Huy', email: 'huy@example.com' }
];

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.send('Welcome to Group 10 API (Hoạt động 3)');
});

// GET /users - Lấy danh sách user
app.get('/users', (req, res) => {
  res.json(users);
});

// POST /users - Thêm user mới
app.post('/users', (req, res) => {
  console.log('Body nhận được:', req.body); // Debug xem có dữ liệu chưa
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Thiếu thông tin name hoặc email!' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json({ message: 'Thêm user thành công!', user: newUser });
});

// ===== Khởi động server =====
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});