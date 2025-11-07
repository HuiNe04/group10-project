# 🌐 Group10 Project – User Management System

## 👋 Giới thiệu

Dự án **Quản lý người dùng (User Management System)** được xây dựng nhằm giúp nhóm **Group 10** thực hành quy trình phát triển ứng dụng web **Fullstack (Frontend + Backend + Database)**.

🔊  Ứng dụng hỗ trợ:

* 👥 Đăng ký, đăng nhập, phân quyền (User / Moderator / Admin)
* 🖼️ Upload ảnh đại diện (Cloudinary)
* 🔐 Đổi, quên mật khẩu (qua email thật với Gmail SMTP)
* 🚫 Giới hạn đăng nhập sai (Rate Limiting)
* 🧠 Quản lý nhật ký hoạt động (Activity Logging)
* 🧱️ Bảo vệ route với Redux + Protected Routes

---

## 🎯 Mục tiêu dự án

* Áp dụng kiến thức **ReactJS, Redux Toolkit, NodeJS, Express, MongoDB (Mongoose)**.
* Hiểu rõ mô hình **Client–Server** và quy trình **CRUD (Create – Read – Update – Delete)**.
* Thực hành quản lý nhóm, sử dụng **Git / GitHub** (branch, commit, merge, pull request).
* Làm quen với các kỹ thuật bảo mật cơ bản: JWT Authentication, Refresh Token, Rate Limit.
* Tích hợp dịch vụ đám mây: **Cloudinary**, **Gmail SMTP**.

---

## 👨‍💻 Thành viên nhóm

| Họ tên                     | Vai trò                 | Nhiệm vụ                                                                                                    |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Nguyễn Châu Trường Huy** | Database & Quản lý nhóm | Thiết kế và quản lý CSDL MongoDB Atlas, kết nối Mongoose, kiểm thử dữ liệu                                  |
| **Võ Văn Khanh**           | Backend Developer       | Xây dựng RESTful API (Auth, User, Upload, Log, Rate Limit), Middleware bảo mật, JWT, Refresh Token          |
| **Đoàn Thị Huyền Anh**     | Frontend Developer      | Thiết kế giao diện bằng ReactJS, Redux Toolkit, gọi API bằng Axios, xử lý Protected Routes và UI role-based |

---

## ⚙️ Công nghệ sử dụng

| Thành phần         | Công nghệ                                                            |
| ------------------ | -------------------------------------------------------------------- |
| **Frontend**       | ReactJS, Redux Toolkit, Axios, React Router DOM                      |
| **Backend**        | Node.js, Express.js, JWT, Multer, Cloudinary SDK, BcryptJS           |
| **Database**       | MongoDB Atlas + Mongoose ODM                                         |
| **Email Service**  | Nodemailer (Gmail SMTP)                                              |
| **Storage**        | Cloudinary (Upload Avatar)                                           |
| **Security**       | JWT Access + Refresh Tokens, Role-based Access (RBAC), Rate Limiting |
| **Công cụ hỗ trợ** | Postman, VSCode, Git/GitHub, npm, Redux DevTools                     |

---

## 🧹 Kiến trúc hệ thống

```
[ ReactJS (Frontend) ]
        ⬇️
[ Axios + Redux ]
        ⬇️
[ ExpressJS API (Backend) ]
        ⬇️
[ MongoDB Atlas (Database) ]
        ⬇️
[ Cloudinary / Nodemailer (Service Integrations) ]
```

---

### Luồng hoạt động:
1. Người dùng đăng ký → Backend lưu vào MongoDB.  
2. Đăng nhập → Nhận `AccessToken` + `RefreshToken`.  
3. Gọi API bằng Bearer Token → Middleware xác thực.  
4. Hết hạn token → Backend cấp mới bằng Refresh Token.  
5. Admin có thể xem danh sách người dùng + nhật ký log.  
6. Người dùng có thể đổi avatar, quên mật khẩu, đổi mật khẩu.

---

## 🧰 Hướng dẫn cài đặt & chạy dự án

### ⚙️ 1. Chuẩn bị môi trường
- Cài đặt **Node.js >= 18**
- Cài đặt **npm** (đi kèm Node)
- Tạo tài khoản **MongoDB Atlas** và **Cloudinary**
- Tạo ứng dụng Gmail & bật “App Password” (cho Nodemailer)

---

### 📄 2. Cấu hình `.env` (đặt trong thư mục `backend`)
```env
PORT=5000
MONGO_URI=mongodb+srv://Hui:Huy201104@cluster0.i0qbyri.mongodb.net/groupDB?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME=dbkwx9fgt
CLOUDINARY_API_KEY=561113265812322
CLOUDINARY_API_SECRET=Lr5EKcoRzipqkvj9HRF9a9_wY2c

JWT_SECRET=secret123
JWT_REFRESH_SECRET=refresh456
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE_DAYS=7

EMAIL_USER=nguyenchautruonghuy@gmail.com
EMAIL_PASS=dnbu izfy mxmq nzvm
CLIENT_URL=http://localhost:3000

## 🔧 Hướng dẫn cài đặt

### 1. Backend

```bash
cd backend
npm install
npm start
```

Chạy tại: [http://localhost:5000](http://localhost:5000)

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Chạy tại: [http://localhost:3000](http://localhost:3000)

---
🧪 Chức năng chính & Flow kiểm thử
🟢 Đăng ký & Đăng nhập

Đăng ký người dùng mới (/auth/signup)

Đăng nhập → Nhận AccessToken + RefreshToken

Redux lưu auth.user và auth.isAuthenticated = true

Token tự động refresh khi hết hạn

🧑‍💻 Quản lý người dùng (Admin Panel)

Admin có thể thêm / sửa / xóa / xem danh sách người dùng

Moderator chỉ được xem danh sách (chế độ readonly)

User chỉ xem và chỉnh sửa hồ sơ cá nhân

🖼️ Upload ảnh đại diện (Cloudinary)

Upload ảnh tại /profile/edit

Ảnh được resize (400x400) và lưu vào Cloudinary

URL avatar cập nhật trong MongoDB và hiển thị lên UI

🔐 Quên mật khẩu / Đặt lại mật khẩu

Gửi email thật chứa token reset (qua Gmail SMTP)

Người dùng truy cập link /reset-password?token=...

Cập nhật mật khẩu mới thành công

🧱 Phân quyền (RBAC)
Role	Quyền
Admin	CRUD User + Xem Log + Upload Avatar
Moderator	Chỉ xem danh sách người dùng
User	Chỉ xem & sửa hồ sơ cá nhân
🧠 Logging & Rate Limiting

Mọi hành động quan trọng (login, CRUD, upload) được ghi vào collection logs.

Tự động giới hạn đăng nhập sai: 5 lần / 1 phút / 1 email.

Ghi log hành vi rate-limit (LOGIN_RATE_LIMIT) vào DB.

🔎 Kiểm thử với Postman
API	Method	URL	Mô tả
Đăng ký	POST	/api/auth/signup	Tạo tài khoản mới
Đăng nhập	POST	/api/auth/login	Lấy AccessToken + RefreshToken
Refresh Token	POST	/api/auth/refresh	Cấp lại AccessToken
Lấy user info	GET	/api/auth/me	Trả về thông tin người dùng hiện tại
Upload Avatar	POST	/api/upload-avatar	Upload file ảnh đại diện
Forgot Password	POST	/api/forgot-password	Gửi token reset qua email
Reset Password	POST	/api/reset-password	Đặt lại mật khẩu
Xem Logs (Admin)	GET	/api/logs	Lấy danh sách log hoạt động
## 🛋️ Cấu trúc dự án

### 💡 Backend

```
backend/
├── config/
│   ├── cloudinary.js
│   └── nodemailer.js
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── userController.js
│   ├── profileController.js
│   ├── passwordController.js
│   ├── uploadController.js
│   └── logController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── rateLimitLogin.js
│   ├── logActivity.js
│   └── uploadAvatar.js
├── models/
│   ├── User.js
│   ├── Log.js
│   └── RefreshToken.js
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── upload.js
│   ├── logs.js
│   ├── profile.js
│   └── password.js
├── .env
├── package.json
└── server.js
```

### 🖥️ Frontend

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── app/
│   │   └── store.js
│   ├── features/
│   │   └── authSlice.js
│   ├── components/
│   │   ├── AddUser.jsx
│   │   ├── AdminLogs.jsx
│   │   ├── EditProfile.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Signup.jsx
│   │   ├── UserList.jsx
│   │   └── ViewProfile.jsx
│   ├── App.js
│   └── index.js
├── package.json
└── .gitignore
```

---

## 🦉 Redux Store (Frontend)

```json
{
  "auth": {
    "user": {
      "_id": "68f7023debe31ae677f26aef",
      "name": "Nguyễn Châu Trường Huy",
      "email": "nguyenchautruonghuy@gmail.com",
      "role": "admin",
      "avatar": "https://res.cloudinary.com/dbkwx9fgt/image/upload/v1761383475/avatars/g0674f72adrdhvn9jwyn.png",
      "createdAt": "2025-10-21T03:47:09.522Z",
      "updatedAt": "2025-11-06T13:02:12.725Z",
      "resetToken": "93fd2a7e9d855a6eb38a8b40ae9ecb6308700bb4162f54331ee0f2f503d850f2",
      "resetTokenExpire": "2025-11-06T13:17:12.725Z"
    },
    "isAuthenticated": true,
    "loading": false,
    "error": null
  }
}
```

---

## 🔗 Chức năng nổi bật

* 🔑 JWT Authentication + Refresh Token
* 🔐 Quên / Đặt lại mật khẩu (qua email thật)
* 🖼️ Upload Avatar (Cloudinary)
* 📈 Admin xem Log hệ thống
* 🚫 Rate limit login sai (5 lần / 1 phút / email)
* 🔰 Role-based UI (Admin / Moderator / User)
* 🧰 Redux State Management + Protected Routes

---

## 💡 Kết luận

Dự án **Group10 – User Management System** hoàn thiện đầy đủ backend – frontend, áp dụng nhiều kỹ thuật thực tế:

* JWT + Refresh Token Rotation
* Cloudinary Image Upload
* Email Reset Flow (SMTP)
* Role-based Access & Protected Routes
* Redux Toolkit + Axios Instance
* MongoDB Atlas + Express REST API

🎯 Kết hợp các công nghệ hiện đại, giúp nhóm nắm vững quy trình phát triển ứng dụng web từ A → Z.
