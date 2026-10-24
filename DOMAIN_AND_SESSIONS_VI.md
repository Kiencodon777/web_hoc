# Tên miền chính và giữ phiên học khi đổi link

## Trạng thái ngày 24/10/2026

Địa chỉ chính đã hoạt động: **https://study.anhdungece.id.vn/**. HTTPS và API kiểm tra sức khỏe trả 200 với `database:true`.

ZoneDNS có thêm đúng một bản ghi:

| Loại | Tên | Đích | TTL |
|---|---|---|---|
| CNAME | study | kienhoc-study.pages.dev | 300 |

Các A record của `@` tới GitHub Pages và CNAME `www → concas2025.github.io.` được giữ nguyên. Không đổi nameserver, không chuyển website chính sang backend học tập.

Cloudflare Pages project `kienhoc-study` làm cổng cho custom subdomain khi ZoneDNS vẫn quản lý DNS. Gateway dùng service binding `KIENHOC` tới Worker `kienhoc`, giữ URL và Origin gốc; frontend/API cùng origin trên domain chính. Backend và Supabase dùng chung với bản đã triển khai trước đó.

## Người học đi qua các link như thế nào

- Mở `study.anhdungece.id.vn`: vào ứng dụng học trực tiếp.
- Mở root/index của `kienhoc.anhdungcasi.workers.dev` hoặc `kienhoc-study.pages.dev`: trang chuyển phiên đọc dữ liệu học riêng của origin đó rồi đưa người dùng sang địa chỉ chính.
- Trình duyệt chưa có dữ liệu: chuyển thẳng sang địa chỉ chính.
- Đã có dữ liệu: tiến độ các môn, bookmark, bài đang dở, deadline thi, tùy chọn giao diện và phiên đăng nhập còn hiệu lực được chuyển. Không gia hạn thời gian đăng nhập hay thời gian làm bài.
- Nếu hai origin đang thuộc hai tài khoản khác nhau, giữ nguyên tài khoản ở đích; lưu tiến độ tài khoản nguồn vào cache riêng và giữ bản sao phục hồi, hiển thị lựa chọn tải bản sao/tiếp tục. Không trộn tiến độ giữa tài khoản.
- Không xóa bản gốc trong localStorage của origin cũ. Nếu mạng hoặc storage lỗi, có thể mở lại link cũ để thử lại. Các thao tác ghi đích lỗi sẽ cố gắng rollback trước khi báo lỗi.

Không dùng redirect 301 ngay từ server ở root link cũ vì redirect sẽ bỏ qua cơ hội đọc localStorage của origin cũ. Các tab cũ đang mở trước khi triển khai cần được tải lại/mở lại để chạy bước chuyển. Những tab đó vẫn có thể gọi API cùng database trong thời gian chuyển tiếp.

Việc này giữ phiên trên cùng trình duyệt khi đổi địa chỉ. Nó không khôi phục phiên đã hết hạn, dữ liệu đã bị người dùng xóa hay dữ liệu ở trình duyệt/thiết bị khác. Đồng bộ giữa thiết bị cần đăng nhập tài khoản và cấu hình OTP khi hoàn tất giai đoạn email. Dữ liệu tại `vietkienetet.id.vn` và SQLite trên máy cũ thuộc giai đoạn chuyển riêng, chưa được tự nhận là đã nhập.

## Cơ chế chuyển an toàn

`dist/domain-state.js` chỉ đọc danh sách khóa của Kiến Học, gộp tiến độ bằng cùng thuật toán timestamp/tombstone hiện có và giữ deadline. Các khóa không liên quan của origin không được gửi.

`POST /api/domain-transfer/create` chỉ nhận từ origin nguồn đã khai báo. Server mã hóa gói dữ liệu bằng AES-256-GCM với khóa suy ra từ JWT_SECRET và nhãn riêng, lưu ciphertext trong bảng riêng `kienhoc.domain_handoffs` có RLS, phát mã ngẫu nhiên 256-bit. Database chỉ giữ SHA-256 của mã.

Trình duyệt chuyển tới `/domain-transfer/receive#handoff=...` ở domain chính. Fragment chỉ chứa mã dùng một lần, không chứa JWT/tiến độ. Trang nhận xóa fragment khỏi thanh địa chỉ trước khi gọi `POST /api/domain-transfer/consume` cùng origin. Server lấy và xóa gói bằng một câu DELETE RETURNING, kiểm tra hạn 2 phút, giải mã và trả dữ liệu no-store. Sau đó trình duyệt gộp vào localStorage và mở ứng dụng.

Hai endpoint kiểm tra Origin/host, Content-Type, kích thước, tên khóa, dữ liệu nguy hiểm, return path và giới hạn 30 yêu cầu/giờ/IP cho từng endpoint. Mã đã dùng hoặc hết hạn trả 410. Gói hết hạn được dọn ở lần tạo tiếp theo và cron Worker mỗi 5 phút. Bản sao phục hồi trong trình duyệt không lưu lại token hay hồ sơ đăng nhập.

## Triển khai lại và quay về

```powershell
npm ci
npm test
npm run cf:deploy
# Chỉ cần deploy gateway khi sửa mã/cấu hình gateway:
npm run cf:gateway
```

Worker config khai báo `CANONICAL_ORIGIN`, `CANONICAL_ENABLED` và `MIGRATION_SOURCE_ORIGINS`. Để ngừng chuyển địa chỉ tạm thời, đặt `CANONICAL_ENABLED` thành `false`, deploy Worker; các origin lại phục vụ ứng dụng riêng, bản dữ liệu đã chuyển vẫn giữ nguyên. Không tự xóa dữ liệu trình duyệt để rollback.

Khi thiết lập cho tài khoản khác, tạo Pages project, deploy gateway và đăng ký custom domain trong Cloudflare trước khi thêm CNAME. Không tự trỏ CNAME thẳng tới workers.dev. Chỉ bật chuyển phiên sau khi HTTPS và `/api/health` của tên miền chính đã hoạt động.

## Kiểm chứng

- 26 Node tests cùng bộ academy/UI physics đạt, gồm merge hai origin, giữ tab session/expiry/deadline, bảo vệ khác tài khoản, rollback khi quota lỗi, Origin validation, mã hóa, mã một lần và expiry.
- Kiểm thử trình duyệt thực tế bằng hai origin thử độc lập: progress, vị trí bài thi, deadline, token và marker phiên tab đều được giữ. Các origin thử được dọn sau kiểm chứng.
- Kiểm thử production bằng tài khoản tạm: đăng nhập ở link cũ, chuyển bằng mã một lần, xác thực cùng JWT ở domain chính, lưu tiến độ tại domain chính và đọc được từ API link cũ. Tài khoản thử đã được xóa.
- Tab học tập trong trình duyệt người dùng đã chuyển từ workers.dev sang `study.anhdungece.id.vn` thành công.
- Bố cục màn hình chuyển không tràn ngang ở 375px và ở chế độ ngang; hiệu ứng tôn trọng prefers-reduced-motion.

Trong kiểm tra read-only, HTTPS của website tại apex `anhdungece.id.vn` có lỗi chứng chỉ GitHub không khớp hostname. Không sửa website đó trong đợt này; các DNS record cũ được giữ nguyên.

Tham khảo: [Cloudflare Pages custom subdomain với DNS ngoài](https://developers.cloudflare.com/pages/configuration/custom-domains/).
