# KLTN Social - Admin Management Portal (Frontend)

Trang web Quản Trị Hệ Thống Mạng Xã Hội Khoá Luận Tốt Nghiệp xây dựng với **React 19, Vite, TypeScript, Tailwind CSS v4, React Router DOM v7, Redux Toolkit và Recharts**.

---

## 🚀 Các Tính Năng Đã Triển Khai

1. **🔐 Xác Thực & Bảo Mật Chuẩn Doanh Nghiệp**:
   - Xác thực quyền Quản trị (`ROLE_ADMIN`, `ROLE_MODERATOR`).
   - **Access Token & User Profile** lưu hoàn toàn trong bộ nhớ **Redux Store (In-Memory)**.
   - **Refresh Token** chạy qua cơ chế **HttpOnly Cookie** (`withCredentials: true`), tự động refresh token ngầm khi access token hết hạn.
   - **Tuyệt đối KHÔNG lưu trữ dữ liệu vào `localStorage` hay `sessionStorage`**.
   - `ProtectedRoute` tự động kiểm tra và chuyển hướng an toàn.

2. **📊 Bảng Điều Khiển Tổng Quan (Dashboard)**:
   - Các thẻ KPI (Tổng người dùng, Bài viết, Báo cáo chờ duyệt, Dung lượng S3).
   - Biểu đồ tăng trưởng người dùng mới theo thời gian (Area Chart - Recharts).
   - Biểu đồ phân bố tỷ lệ báo cáo vi phạm theo danh mục (Pie Chart - Recharts).
   - Danh sách báo cáo vi phạm mới nhất cần xử lý gấp.

3. **👥 Quản Lý Người Dùng (User Management)**:
   - Danh sách thành viên toàn mạng xã hội kèm phân trang và tìm kiếm đa năng.
   - Lọc theo Trạng thái (`ACTIVE`, `BANNED`, `PENDING`) và Vai trò (`USER`, `MODERATOR`, `ADMIN`).
   - Xem chi tiết hồ sơ cá nhân và số lượng bài viết / bạn bè.
   - Khóa tài khoản (Ban User) kèm lý do vi phạm chi tiết & Mở khóa tài khoản (Unban).

4. **📝 Quản Lý Bài Viết & Nội Dung (Post Management)**:
   - Quản lý toàn bộ bài viết, lọc theo quyền riêng tư và tác giả.
   - Xem trước chi tiết bài viết (Post Preview Modal) kèm danh sách hình ảnh, lượt thích, bình luận.
   - Gỡ bỏ / Xóa vĩnh viễn bài viết vi phạm khỏi hệ thống.

5. **🛡️ Trung Tâm Kiểm Duyệt & Báo Cáo (Reports & Moderation)**:
   - Quản lý các báo cáo vi phạm từ người dùng (Bài viết, Bình luận, Người dùng, Nhóm).
   - Đối soát vi phạm và xử lý 1-Click: Chấp nhận báo cáo (tự động xóa bài viết) hoặc Bác bỏ báo cáo (Dismiss).

6. **👥 Quản Lý Hội Nhóm & Cộng Đồng (Group Management)**:
   - Danh sách nhóm, số lượng thành viên, chế độ công khai / riêng tư.
   - Giải tán hội nhóm vi phạm chính sách cộng đồng.

7. **⚙️ Từ Điển Từ Cấm & Nhật Ký Hệ Thống (Settings & Audit Logs)**:
   - Quản lý từ khóa vi phạm (Blacklist filter): Thêm / Xóa từ ngữ nhạy cảm.
   - Nhật ký kiểm duyệt (Audit Logs): Ghi nhận hành động của Admin / Moderator, IP và thời gian.
   - Giám sát trạng thái hoạt động của 10 Microservices qua cổng API Gateway `:8080`.

8. **🎨 Giao Diện Hiện Đại & Tối Ưu Trải Nghiệm**:
   - Hỗ trợ chế độ Sáng / Tối (Light / Dark Mode).
   - Hệ thống Toast Notification thông báo kết quả tức thì.
   - Bộ UI Components tách nhỏ chuẩn Clean Code: `Button`, `Input`, `Badge`, `Modal`, `DataTable`, `Pagination`, `StatCard`, `ConfirmDialog`.

---

## 🛠️ Hướng Dẫn Chạy Dự Án

```powershell
# Chuyển vào thư mục Admin Frontend
cd e:\KhoaLuan\KhoaLuanTotNghiep_MXH_Admin_FE

# Cài đặt thư viện dependencies (nếu chưa cài)
npm install

# Khởi chạy môi trường phát triển (Port: 5174)
npm run dev

# Build kiểm tra sản phẩm
npm run build
```

Ứng dụng chạy tại địa chỉ: `http://localhost:5174` (Tất cả API trỏ về API Gateway `http://localhost:8080`).
