# Gia cố bảo mật Kiến Học — 30/10/2026

Trạng thái: đã triển khai production ngày 30/10/2026; migration bảng security_mail đã chạy và xác minh quyền trên Supabase thật. Nhánh này dựa trên production, độc lập với PR giao diện bộ đếm #7.

## Phần có ảnh hưởng tới đăng nhập/cấu trúc

- Phiên người học chuyển sang cookie `__Host-kienhoc_session`, HttpOnly, Secure, SameSite=Strict trên production. Token cookie có audience riêng, không dùng được làm Bearer. JavaScript chỉ giữ thông tin hiển thị và CSRF; không lưu JWT mới vào localStorage.
- Bổ sung kiểm tra Origin/CSRF cho thao tác ghi; ràng buộc tài khoản đích của tab trước khi ghi. Khi cookie đổi trong tab khác, làm mới CSRF cho cùng tài khoản; nếu đổi tài khoản thì chuyển ngữ cảnh, không gửi lại thao tác cũ cho người khác.
- Luồng đăng nhập/đăng xuất, quản trị, telemetry, ticket PK và chuyển miền dùng cơ chế mới. Luồng chuyển miền cấp cookie tại server và không trả JWT về JSON/localStorage. Tài khoản đang mở ở miền đích được ưu tiên, không bị tài khoản từ miền cũ ghi đè.
- Phiên Bearer cũ chỉ được nhận trong khoảng chuyển tiếp khai báo rõ bằng `AUTH_LEGACY_UNTIL`. Mặc định không bật. Cấu hình production không cho đặt thời hạn quá 7 ngày về tương lai. Script chuẩn bị rollout mặc định 48 giờ, tính từ khi chạy script, không tính từ ngày viết tài liệu.
- Khi trình duyệt mới chuyển phiên cũ thành cookie, thu hồi session cũ trong transaction; hai yêu cầu đồng thời chỉ một yêu cầu chuyển thành công. Không kéo dài hạn phiên hoặc làm mới thời điểm OTP để vượt step-up.
- Thêm bảng riêng `kienhoc.security_mail` cho thông báo đổi mật khẩu, bật RLS và revoke PUBLIC. Không thay đổi cấu trúc bảng tài khoản, câu hỏi hoặc tiến độ.

Ảnh hưởng có thể thấy: tab còn giữ mã frontend cũ sẽ cần tải lại khi hết thời gian chuyển tiếp. Phiên đã hết hạn/thu hồi phải đăng nhập lại; không thể hứa mọi phiên đều tiếp tục. Tiến độ offline được giữ trên trình duyệt. Khi offline, đăng xuất không báo thành công nếu chưa thu hồi được cookie/server session.

## Đã xử lý các mục audit thế nào

| Mục | Thay đổi |
|---|---|
| 1. Proxy | Khai báo `BEHIND_TRUSTED_PROXY=true` cho Worker, yêu cầu đúng một hop. Worker vẫn thay X-Forwarded-For bằng IP Cloudflare, không tin header người gửi. Bucket hạn mức có prefix ổn định, không lệch theo thứ tự đăng ký middleware. |
| 2. Origin | Một parser dùng chung chuẩn hóa slash/default port, loại bỏ cấu hình có userinfo, path, query, protocol lạ; PK cũng dùng cùng parser. So khớp chính xác Origin/Host cho cookie ghi. |
| 3. SQLite | Production Node không được tự rơi về file tạm nếu thiếu DATABASE_URL. Bản SQLite cần bật rõ ALLOW_PERSISTENT_SQLITE; manifest Render chỉ bật với đĩa /var/data đã khai báo. Cloudflare vẫn dùng PostgreSQL qua Hyperdrive. |
| 4. Progress | Giới hạn IP trước parse JSON và ở edge Worker; GET 120/phút, POST 90/phút theo user ID, tách riêng. Validator từ chối padding/trường lạ trong envelope, progress, prefs, metadata và session; giữ trường hints/hintsUsed đang dùng. Không hạ giới hạn byte tùy tiện làm mất snapshot cũ. |
| 5. Mail đổi mật khẩu | Đổi mật khẩu, thu hồi phiên khác và ghi outbox trong cùng transaction. Cron gửi với idempotency key, retry có backoff tối đa 8 lần, không đưa password/hash/OTP vào mail. Lỗi mail không đảo kết quả đổi mật khẩu đã commit. |
| 6. JWT | Cookie HttpOnly/Secure, audience tách biệt, CSRF; frontend mới không lưu JWT. Có cơ chế chuyển phiên cũ hữu hạn và test cách ly tài khoản qua nhiều tab. |
| 7. Cleanup | Scheduled Worker dọn sessions/OTPs độc lập với telemetry. Node tự host cũng có maintenance mỗi 5 phút. Giữ OTP thêm một ngày để không xóa lịch sử chống spam trong cửa sổ một giờ. |
| 8. Email | Chặn ký tự không hỗ trợ như dấu ngoặc nhọn, quote và CRLF trước khi gọi nhà cung cấp; không âm thầm đổi địa chỉ nhận. Giữ escape ở UI. |
| 9. CSP | Tách CSS boot ra stylesheet ngoài và thêm style-src-elem self/Google Fonts để chặn style block tùy ý. Vẫn giữ inline style attribute cần cho thanh tiến độ/animation; không tuyên bố đã xóa hoàn toàn unsafe-inline. Chưa có đường nhận CSS tùy ý từ người học trong phạm vi đã kiểm tra. |
| 10. Lệch giờ | Cooldown fail-closed và retryAfter không vượt 30 giây cho nhánh cooldown. Không bỏ qua giới hạn khi timestamp ở tương lai. Step-up đổi password cũng từ chối authAt nằm quá xa trong tương lai. Việc đồng hồ host thực sự bị sai vẫn cần vận hành sửa; mã không tự chỉnh đồng hồ. |

## Kiểm tra

- `npm test`: 107/107 tests, cộng kiểm tra academy và physics đều đạt.
- `npm run cf:check`: build Worker/dry-run đạt, không triển khai.
- Các ca mới: cookie flags và không trả token, CSRF sai, cookie không dùng như Bearer, legacy deadline/replay/race, không kéo dài OTP age/expiry, account rate limit, hai user chung IP, padding/hints, outbox retry/concurrent claim, cleanup và clock skew, PK cookie, chuyển miền không lộ JWT/không ghi đè tài khoản hiện tại.
- Client integration kiểm tra sync thực, snapshot ba môn, deadline bài thi, hai thiết bị, cookie đổi cùng tài khoản và đổi sang người khác.
- Trình duyệt cục bộ: đăng nhập OTP giả, lưu hồ sơ, giữ phiên sau reload, mở quản trị với cookie. Không gửi email thật, không sửa tài khoản thật. Cloudflare Access production vẫn giữ nguyên; kiểm tra verifier bằng test chữ ký/issuer/audience, không tắt lớp bảo vệ live.
- Migration chạy trên PostgreSQL engine test thông qua bộ test hiện có. Quyền/backup/khôi phục DB live chưa bị thay đổi; cần kiểm tra ở bước triển khai. Không kiểm thử tải lớn trên production.

## Trình tự triển khai sau khi chủ dự án duyệt

1. Kiểm tra backup/khả năng restore của Supabase và các quyền backend đang dùng; giữ bản Worker trước đó để rollback. Không xoay JWT_SECRET trong đợt này vì sẽ làm mất mọi phiên.
2. Chạy migration additive `20261030083603_security_mail_outbox.sql` theo quy trình migration của dự án. Kiểm tra bảng mới bật RLS và không cấp quyền Data API cho anon/authenticated. Không drop hay reset bảng cũ.
3. Ngay trước khi release, chạy `node scripts/prepare-security-rollout.cjs 48`. Script CHỈ tạo `build/security-rollout/wrangler.jsonc` với deadline mới; không deploy, không sao chép secret vào file. Dùng config sinh ra khi deploy để phiên cũ có 48 giờ chuyển tiếp. Không dùng file config đã tạo từ nhiều ngày trước.
4. Deploy backend và assets cùng phiên bản; giữ ADMIN_REQUIRE_ACCESS=true và các secret hiện có. Thông báo người đang học tải lại khi thuận tiện, không buộc reload giữa lượt thi. Các tab frontend cũ dùng Bearer vẫn hoạt động tới deadline đã thông báo; frontend mới chuyển sang cookie rồi xóa token cũ.
5. Kiểm tra OTP/password, sync/câu đang làm dở, hồ sơ, PK và quản trị trên HTTPS thật; kiểm tra mail thông báo và cron. Không cần thay đổi giao diện học.
6. Sau deadline, Bearer tự bị từ chối; xóa AUTH_LEGACY_UNTIL khỏi cấu hình ở đợt cấu hình tiếp theo. Kiểm tra không còn token mới xuất hiện trong localStorage.

Rollback code cũ có thể khiến người đã dùng cookie phải đăng nhập lại vì code cũ chỉ hiểu Bearer. Không xóa local progress hoặc drop bảng outbox để rollback. Cần thông báo tác động đăng nhập này nếu chọn rollback.

Không có cơ sở để cam kết an toàn tuyệt đối hoặc đã xử lý mọi loại tấn công ngoài phạm vi audit. Các rủi ro vận hành (đĩa bền vững, đồng hồ và backup) cần được xác minh trên hạ tầng thật khi triển khai.

## Kết quả phát hành thực tế

- Worker: `9ed51879-d213-49dd-9a87-e89830c0a644`; Worker trước phát hành: `f44426c9-d721-44bc-bd22-feff02870a00`.
- Deadline chuyển tiếp: `2026-11-01T09:11:30.493Z` (16:11:30 ngày 01/11/2026, giờ Việt Nam). Đã lưu deadline trong config nguồn để deploy sau không vô tình cắt sớm cửa sổ này.
- Cloudflare đóng băng đồng hồ ở global scope khi khởi tạo: chuyển kiểm tra thời hạn tối đa 7 ngày sang thời điểm xử lý request; thêm test clock=0. Bản upload bị từ chối trước đó không thay Worker đang phục vụ.
- Đã snapshot nhất quán 13 bảng trước migration vào bản sao mã hóa AES-256-GCM trong thư mục build cục bộ, kiểm tra giải mã và nội dung bằng nhau. Khóa giải mã dẫn xuất từ JWT_SECRET tại thời điểm snapshot với context kienhoc-release-backup-v1; giữ bản secret gốc nếu cần khôi phục sau khi xoay khóa. Đây là snapshot dữ liệu ứng dụng, không thay thế backup toàn bộ hạ tầng Supabase.
- Đã kiểm tra RLS bật cho bảng mới, anon/authenticated không có USAGE schema và không có SELECT trên bảng. Advisor chỉ báo thông tin RLS không có policy — chủ ý của schema backend riêng, không thêm policy public.
- Smoke test HTTPS bằng hai tài khoản UUID @example.invalid: chuyển phiên Bearer cũ một lần, cookie Secure/HttpOnly, OTP verify không gửi mail thật, password login, cách ly tài khoản, lưu và đọc deadline bài thi, CSRF sai bị chặn, lưu hồ sơ, ticket PK và WebSocket qua tên miền chính, logout thu hồi phiên cho cả API và PK.
- Tài khoản thử và OTP thử đã được dọn. Các account ID và progress row có trước phát hành vẫn hiện diện, revision tiến độ không giảm.
- Cloudflare Access vẫn trả challenge/redirect cho người chưa đăng nhập; script quản trị không được phục vụ từ miền học.
