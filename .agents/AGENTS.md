# Quy Tắc Dự Án (Project Rules)

## 1. Git Workflow (Luồng Làm Việc Git)
Đối với TẤT CẢ các thay đổi mã nguồn trong dự án này (thêm tính năng mới, sửa lỗi, cập nhật tài liệu), AI Agent PHẢI tuân thủ nghiêm ngặt quy trình làm việc tự động qua Pull Request (PR) như sau:

1. **Tạo nhánh mới:** Tạo một nhánh riêng biệt từ nhánh `main` (ví dụ: `git checkout -b feature/ten-tinh-nang` hoặc `docs/cap-nhat-tai-lieu`).
2. **Commit và Push:** Thêm các thay đổi và commit với nội dung rõ ràng, sau đó đẩy lên remote repository (`git add . && git commit -m "..." && git push -u origin <ten-nhanh>`).
3. **Tạo Pull Request:** Sử dụng GitHub CLI (`gh`) để tự động tạo PR (`env -u GITHUB_TOKEN gh pr create --title "..." --body "..."`).
4. **Merge Pull Request:** Tự động merge PR vào nhánh `main` và xóa nhánh phụ trên remote (`env -u GITHUB_TOKEN gh pr merge --merge --delete-branch`).
5. **Đồng bộ nhánh Local:** Trở lại nhánh `main`, cập nhật code mới nhất và xóa nhánh phụ ở dưới máy (`git checkout main && git pull origin main && git branch -d <ten-nhanh>`).

*Lưu ý:* Luôn sử dụng lệnh `env -u GITHUB_TOKEN gh ...` khi gọi GitHub CLI để tránh lỗi cấu hình token trên máy cục bộ, đảm bảo lệnh chạy bằng keyring đã được xác thực thành công.
