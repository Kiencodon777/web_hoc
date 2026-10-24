# Quy trình sửa và duyệt giao diện Kiến Học

## Dành cho Viết Kiên

1. Lấy bản mới nhất của nhánh `codex/supabase-cloudflare`. Khi nhánh này được hợp nhất vào `main`, dùng `main` làm nền cho công việc mới.
2. Tạo nhánh riêng, ví dụ `codex/ui-ten-thay-doi`; sửa giao diện trong `dist/`. Không sửa bản cũ trên Sites.
3. Kiểm tra local bằng `npm ci` rồi `npm run dev` (xem cổng server thông báo). Chạy kiểm tra phù hợp, đặc biệt với điều hướng và cử chỉ.
4. Commit, push và mở PR về nhánh nền. Không hợp nhất hoặc triển khai production khi Dũng chưa chốt.
5. Xem link trong PR → Checks → UI Preview, hoặc dùng trực tiếp:

   `https://kienhoc-ui-preview.anhdungcasi.workers.dev/pr/SO_PR/`

   Ví dụ PR #1: https://kienhoc-ui-preview.anhdungcasi.workers.dev/pr/1/

6. Gửi Dũng link PR và preview. Nếu cần sửa, đẩy commit tiếp lên cùng nhánh; không cần tạo PR mới. Mở lại link `/pr/SO_PR/` hoặc bấm “Nạp commit mới nhất”; GitHub metadata được cache 30 giây.

## Dành cho Dũng

- Xem trên máy tính và điện thoại, kiểm tra chữ, điều hướng, cuộn trang và tắt chuyển động.
- Ghi rõ phần đồng ý hoặc yêu cầu sửa trên PR. Nếu không dùng thay đổi, đóng PR; bản thật không bị ảnh hưởng.
- Sau khi chốt, lấy đúng commit đã duyệt, chạy kiểm tra và `npm run cf:check`; chỉ người giữ quyền Cloudflare chạy `npm run cf:deploy` để cập nhật bản thật.
- Repo chưa có cơ chế bắt buộc Dũng review/khóa merge do tài khoản hiện tại chỉ có quyền write, không có admin. Preview và merge không có quyền triển khai Cloudflare. Chủ repo có thể cấu hình bảo vệ nhánh sau.

## Phạm vi preview

Worker `kienhoc-ui-preview` đọc các file `dist/` của PR công khai từ GitHub. Không cần khóa Cloudflare hay khóa GitHub trong repo. Mỗi lần mở link PR sẽ chuyển tới URL có SHA commit cố định; tất cả asset của trang đó dùng cùng SHA, tránh trộn các phiên bản. Banner hiển thị số PR và commit đang xem.

Preview không liên kết production Worker, Supabase, Resend hoặc secret nào. API bị chặn và CSP chặn kết nối API ra ngoài origin preview. Không nhập thông tin đăng nhập thật ở preview. Có thể thử bài học và ghi chú với dữ liệu lưu cục bộ ở origin preview; dữ liệu này không đồng bộ lên tài khoản thật. Preview không dùng để nghiệm thu OTP/backend.

Chỉ hỗ trợ nhánh trong cùng repo `Kiencodon777/web_hoc`, không hỗ trợ fork/private repo. Source repo hiện công khai nên preview cũng công khai, có noindex. Khi GitHub giới hạn đọc công khai, preview có thể báo chờ; bản production không phụ thuộc dịch vụ này.

Workflow chỉ đưa link vào Checks/Deployments và không checkout hoặc chạy source PR. Khi workflow chưa nằm trong nhánh dùng làm nền, vẫn có thể dùng link trực tiếp theo số PR. Workflow không chứa bước triển khai production.

## Quản lý hạ tầng preview

Chỉ người quản lý Cloudflare mới cần chạy `npm run cf:preview:deploy` khi sửa code hạ tầng `preview/`. Viết Kiên không cần lệnh này để xem các sửa đổi giao diện trong PR. Không dùng `npm run cf:deploy` để tạo preview.
