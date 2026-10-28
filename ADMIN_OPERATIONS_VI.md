# Kiến Học Operations

Trạng thái 29/10/2026: chủ dự án đã duyệt triển khai. Mã backend và telemetry đã lên production (Worker `f2d7ccb1-f7a5-4ed3-b3e1-fb50b88ed026`); migration đã áp dụng và backfill 9 tài khoản thành 27 bản tổng hợp môn học. **Cửa quản trị vẫn đóng (`ADMIN_ENABLED=false`) trong khi chờ chủ tài khoản kích hoạt Cloudflare Zero Trust Free.** Trang checkout yêu cầu thẻ/địa chỉ thanh toán, chấp nhận điều khoản và ủy quyền tính phí vượt mức; chủ tài khoản phải tự hoàn tất. Các sửa card/tiêu đề trước đó đã triển khai riêng từ commit `1cf6c85`. Không dùng link preview PR của website học tập để xem quản trị vì preview đó chỉ phục vụ `dist/` và khóa API thật.

## Xem giao diện

Chạy `npm run admin:preview`, mở http://localhost:3197/preview . Server chỉ bind `127.0.0.1`, dùng SQLite trong bộ nhớ, không đọc `.env` hoặc database thật, không gửi email. Trang mẫu tự cấp cookie cho tài khoản `example.test` trong database thử. Đây là **fixture riêng**, không có nhánh bỏ qua đăng nhập trong backend production. Tắt server thì dữ liệu mẫu mất; mở lại lệnh để xem tiếp. Phiên mẫu hết hạn thì vào lại `/preview`.

`admin/` chứa HTML/CSS/JS quản trị. `npm run admin:build` đóng gói chúng vào module backend `server/admin-assets.cjs`; chúng không nằm trong `dist/`. Backend chỉ gửi dashboard, CSS dashboard và JS dashboard sau khi kiểm tra quyền. Form đăng nhập tối giản được chặn thêm bởi Cloudflare Access ở production. Giao diện luôn cần chạy trên trình duyệt; dữ liệu, quyết định phân quyền và mã nguồn phục vụ giao diện không được đặt ở frontend công khai.

## Áp dụng bốn mẫu

- `dashboard.txt`: sidebar, header, bộ lọc kỳ thống kê, biểu đồ diện tích, bố cục hai cột và hoạt động gần đây; thay số dự án/nhiệm vụ bằng dữ liệu website học.
- `statband.txt`: dải bốn chỉ số có đường phân cách, số tabular, sparkline nhỏ, phần giải nghĩa từng chỉ số. Không chạy count-up lại mỗi 10 giây để tránh nhấp nháy.
- `realtime.txt`: các ô trạng thái, tín hiệu độ trễ, điểm nhấn khi hover và nhật ký dạng terminal. Dữ liệu thật từ API thay cho timer sinh số ngẫu nhiên hoặc Lighthouse giả trong mẫu.
- `backgroundqt.txt`: Ribbon Field đen → xám `#000/#3a3a3a/#a7a7a7`, góc 306°, scale .67, softness tương ứng các mép 35.5/39.27/81.73/85.5%, cross-axis wave .028, clock 20.75 và phase .52; grain theo overlay, tương phản giảm để nội dung đọc được. Canvas giới hạn 400k pixel, khoảng 20 FPS, dừng khi tab ẩn, hỗ trợ reduced motion và fallback CSS.

Các file mẫu là component React kèm hướng dẫn khởi tạo framework, được dùng làm tài liệu thiết kế; dự án hiện là Vanilla JS + Express/Workers. Không cài React, Tailwind hoặc thay luồng học chỉ để dùng lại giao diện.

## Các số liệu và định nghĩa

| Chỉ số | Nguồn / ý nghĩa |
|---|---|
| Tài khoản đã tạo | `COUNT(users)` hiện tại, không coi phiên đăng nhập là tài khoản mới |
| Tài khoản mới | `users.created_at` trong kỳ theo UTC+7 |
| Trình duyệt truy cập | Mã ngẫu nhiên first-party được HMAC tại backend, distinct trong kỳ; **không khẳng định số người thật** |
| Đang hoạt động | Distinct trình duyệt có heartbeat 120 giây gần nhất; client chỉ gửi khi tab hiện và có tương tác trong 120 giây |
| Thành viên online | Distinct user ID từ JWT đã xác minh, không lấy user ID do client khai |
| Lượt xem | Sự kiện đổi trang logic, không tăng khi heartbeat |
| Thời gian hoạt động | Ước lượng từ heartbeat, mỗi đoạn tối đa 45 giây; không giám sát nội dung người học |
| Tiến độ theo môn | Tổng snapshot đã đồng bộ: câu đã học, attempts/correct, bookmarks; là toàn bộ tiến độ hiện tại, **không phải riêng kỳ lọc** |
| API | Phương thức, route cố định, status, tổng/thời gian xử lý trung bình/max; phân biệt 4xx/5xx |
| Lỗi UI | Phân loại JS error, giới hạn tần suất; là tín hiệu do client gửi, có thể giả mạo, không phải bằng chứng kết luận lỗi |
| Web Vitals | Mẫu LCP/CLS/INP khi browser hỗ trợ; giá trị báo về, không thay Lighthouse hoặc cam kết thiết bị thật |
| Audit | Đăng nhập, mở quản trị, đăng xuất và xuất báo cáo; email actor được che trong API trả về |

Không thể dựng lại số khách trước ngày bật telemetry. Trình duyệt có chặn đo hoặc bật DNT/GPC không được đếm. Một người nhiều máy hoặc xóa localStorage có thể được tính nhiều trình duyệt. Mở nhiều tab không làm tăng số trình duyệt nhưng có thể tăng phút hoạt động ước lượng. Không đếm học offline chưa đồng bộ là mất dữ liệu.

Chưa kết nối: uptime probe ngoài Internet, Cloudflare CPU/chi phí/analytics, trạng thái phát thư Resend, lỗi runtime phát sinh trước Express/ở mạng CDN. Giao diện ghi rõ “chưa đo/chưa kết nối”, không dựng số 100% hay số mẫu lên production. Hệ thống hiện read-only, không có xóa tài khoản, sửa đáp án hoặc đặt lại mật khẩu người học.

## Quyền truy cập

Mặc định `ADMIN_ENABLED` và `TELEMETRY_ENABLED` đều tắt khi chưa cấu hình; `/ops` và `/api/ops` trả 404.

Production yêu cầu đồng thời:

1. Host khớp `ADMIN_ORIGIN`, nên dùng một tên miền quản trị riêng, không dùng chung origin với trang học.
2. Cloudflare Access trên toàn bộ host; backend xác minh `Cf-Access-Jwt-Assertion` bằng public JWK, RS256, issuer và audience. Không tin một header email trần. Mặc định không có cấu hình Access thì từ chối.
3. Email nằm trong `ADMIN_EMAILS` (chỉ cấu hình server). Email Access và email ứng dụng phải trùng.
4. Đăng nhập email OTP mới trong 5 phút để đổi sang phiên quản trị riêng. Token người học tự nó không gọi được API quản trị.
5. Cookie quản trị `__Host-kienhoc_ops`, HttpOnly, Secure, SameSite=Strict, Path=/, 30 phút. Cookie không lưu ở localStorage. Mỗi request kiểm tra lại cả phiên quản trị, phiên nguồn trong DB và allowlist hiện tại.
6. Đăng xuất quản trị cần Origin đúng và token CSRF; thu hồi phiên quản trị không làm mất phiên học. Logout/thu hồi phiên nguồn cũng làm quản trị mất hiệu lực.

Không có link quản trị trong website học, không index, no-store, không iframe. Đường dẫn không phải yếu tố xác thực. Ba email chủ dự án cung cấp được lưu tại `.env.admin.local` bị Git bỏ qua; **không commit allowlist thật vào repo công khai**. Bản mẫu chỉ dùng `example.test`. Không đặt `ADMIN_REQUIRE_ACCESS=false` trên production; cờ đó chỉ dùng cho unit test cookie.

Tài liệu xác minh [Cloudflare Access JWT](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/) và [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Database và retention

Migration `supabase/migrations/20261028172755_private_operations_console.sql` tạo sáu bảng riêng trong schema `kienhoc`: sessions quản trị, visits, events, API buckets, learning summaries, audit. RLS bật, không policy anon/authenticated, revoke PUBLIC; không đưa `kienhoc` vào Exposed schemas.

Index cho last_seen, user_id, day/kind, request minute và audit time. Endpoint users phân trang 20 dòng, email che mặc định và chỉ trả trường được chọn. Không trả password_hash, OTP, token, avatar blob, đáp án, IP thô hoặc raw URL/query/stack. JSON telemetry giới hạn 2 KiB và enum; input SQL là tham số. Dữ liệu 90 ngày được xóa theo cron hiện có khi telemetry bật; audit 365 ngày, phiên hết hạn được dọn. Sessions nguồn có expiry được kiểm tra mỗi lần, không đếm theo số session còn hạn.

## Các bước mở quyền quản trị còn lại

1. Tạo/gắn host quản trị riêng với Worker, cấu hình Access allowlist/MFA tại Cloudflare, giữ site học hiện tại nguyên vẹn. Chốt `ADMIN_ORIGIN`, `ADMIN_ACCESS_TEAM`, `ADMIN_ACCESS_AUD`; thêm origin quản trị vào `APP_ORIGINS`. Chưa tạo DNS trong đợt preview.
2. Đã áp dụng migration qua Supabase MCP; xác minh sáu bảng ops có RLS, anon/authenticated không có SELECT. Không bật public Data API.
3. Đã dry-run rồi backfill 9 snapshot, không sửa tiến độ gốc. Lệnh dùng lại khi cần: `node --env-file=.env scripts/backfill-operations.cjs` mặc định dry-run; thêm `--apply` khi đã kiểm tra. Chỉ ghi bảng ops_learning, không sửa tiến độ nguồn.
4. Đặt `ADMIN_EMAILS` bằng secret server, `ADMIN_ENABLED=true`, `TELEMETRY_ENABLED=true`, Access đúng. Giữ `JWT_SECRET` hiện tại để không ngắt phiên người học. Không đặt `ADMIN_DEMO=true` trong production.
5. Build/test/dry-run rồi triển khai theo lệnh riêng của chủ dự án. Kiểm tra không quyền, đúng quyền, workers.dev không vượt host gate, logout/revocation, telemetry thật, dữ liệu rỗng và quyền Data API.

Kiểm tra: `npm test`, `npm run cf:check`. Test dùng SQLite và PGlite PostgreSQL, có chữ ký Access thật với khóa test, sai audience/algorithm, email ngoài allowlist, OTP cũ, cookie/CSRF/revocation, đếm browser, retention và RLS. Chưa nghiệm thu trên host quản trị production hay trên điện thoại thật.

## Kiểm tra bản triển khai đầu tiên

`npm test`: 86 test pass, academy và UI physics pass. `cf:check` pass. Production health HTTP 200, database/email ready; `/ops`, `/ops/login`, `/api/ops/overview` đều HTTP 404 khi cửa quản trị đóng. Telemetry sai payload HTTP 400; request bucket đã được ghi. Supabase advisor chỉ báo INFO RLS không policy, đúng chủ đích schema private chỉ backend truy cập. Chưa tạo DNS hoặc Access application. Host dự kiến `https://ops.vietkienetet.id.vn` (zone này hiện đã thuộc tài khoản Cloudflare), `ADMIN_REQUIRE_ACCESS=true`; cần Access TEAM/AUD, ứng dụng allowlist ba email và kiểm tra login thực tế trước khi đặt ADMIN_ENABLED=true. Không đổi JWT_SECRET hay cấu hình phiên người học.

## Cập nhật sau khi kích hoạt Zero Trust Free

Cloudflare đã xác nhận gói Free, team `empty-union-9700`. Phương thức One-time PIN đã thêm. Custom domain `ops.vietkienetet.id.vn` đã gắn Worker và HTTPS hoạt động; Worker `4f8f539e-d150-4ae4-9f4f-fe31608f29bf` vẫn ADMIN_ENABLED=false. Chính sách ba email đã soạn trong trình duyệt nhưng CHƯA lưu/chưa tạo Access application: đang chờ xác nhận tại thời điểm cấp quyền theo quy tắc trình duyệt. Sau xác nhận: Save policy, Create application (30m, only One-time PIN), lấy AUD, bật ADMIN_ENABLED với TEAM/AUD và kiểm tra Access/host gate. Kiểm tra mới nhất: admin login 404 khi đóng, study health200, workers.dev ops404. Không coi việc kích hoạt gói Free là đã bảo vệ một ứng dụng.
