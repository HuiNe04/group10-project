# Group10 Project – User Management System

## Giới thiệu
Dự án Quản lý người dùng (User Management System) được xây dựng nhằm giúp nhóm làm quen với quy trình phát triển ứng dụng web **Fullstack** bao gồm Frontend, Backend và Database.  
Người dùng có thể thêm, sửa, xóa và xem danh sách người dùng thông qua giao diện trực quan được kết nối với cơ sở dữ liệu thật.

## Mục tiêu dự án
- Áp dụng kiến thức **ReactJS, NodeJS, Express và MySQL**.
- Hiểu rõ mô hình **Client–Server** và quy trình CRUD (Create – Read – Update – Delete).
- Thực hành quản lý dự án với **Git/GitHub**, xử lý **xung đột, squash commit, pull request**.
- Cộng tác nhóm theo mô hình **phân chia vai trò rõ ràng**.

## Thành viên nhóm

| STT | Họ và Tên                | Vai trò | Phụ trách |
|-----|---------------------------|----------|------------|
| 1️⃣ | **Nguyễn Châu Trường Huy** | Database & Quản lý nhóm | Thiết kế CSDL MySQL, tạo bảng, kết nối DB, kiểm thử dữ liệu |
| 2️⃣ | **Võ Văn Khanh**          | Backend | Xây dựng API RESTful (GET, POST, PUT, DELETE) bằng Express, tích hợp với MongoDB/Mongoose |
| 3️⃣ | **Đoàn Thị Huyền Anh**     | Frontend | Thiết kế giao diện bằng ReactJS, gọi API bằng Axios, xử lý validation form |

---


## Công nghệ sử dụng

| Thành phần | Công nghệ |
|-------------|------------|
| **Frontend** | ReactJS, Axios, useState, useEffect |
| **Backend** | Node.js, ExpressJS, CORS, dotenv |
| **Database** | MongoDB Atlas, Mongoose |
| **Quản lý mã nguồn** | Git, GitHub |
| **Công cụ hỗ trợ** | Postman, VSCode, npm |

---

## Kiến trúc hệ thống
[ReactJS Frontend] → [ExpressJS Backend] → [MongoDB Database]

markdown
Copy code
- **Frontend** gửi request đến API qua Axios.
- **Backend** xử lý logic và tương tác với MongoDB qua Mongoose.
- **Database** lưu trữ thông tin người dùng.

---

## Hướng dẫn cài đặt & chạy dự án

### Chuẩn bị
- Cài đặt **Node.js** và **npm**.
- Tạo tài khoản và cluster MongoDB Atlas.
- Cập nhật file `.env` trong backend:
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/group10
PORT=5000cluster0.i0qbyri.mongodb.net/groupDB?retryWrites=true&w=majority
---

## Cài đặt Backend
```bash
cd backend
npm install
npm start
Server chạy tại: http://localhost:5000

## Cài đặt Frontend
bash
Copy code
cd frontend
npm install
npm start

Ứng dụng mở tại: http://localhost:3000

