# Kiến Học — Supabase + Cloudflare

## Trạng thái ngày 24/10/2026

- Repo: https://github.com/Kiencodon777/web_hoc ; nhánh triển khai: `codex/supabase-cloudflare`.
- Supabase project `kienhoc`, Singapore, ref `tfpxpfjuoliltjhqvjyx` đã tạo trong `concas2025's Org`.
- Đã áp dụng hai migration trong `supabase/migrations/`. Các bảng hiện chưa có tài khoản/tiến độ cũ.
- Frontend + API chạy cùng origin trên Cloudflare Workers. PostgreSQL nằm trên Supabase.
- Chưa deploy Cloudflare: chủ tài khoản cần đăng ký và đăng nhập. Chưa có DATABASE_URL, Resend key hay backup SQLite nguồn.
- Giữ OTP/JWT/bcrypt hiện có, không chuyển người dùng sang Supabase Auth trong đợt này. Không cần publishable key hay service-role key trong frontend.

## Chạy ngay trên máy

```powershell
npm ci
npm run setup:local
npm start
```

Mở http://localhost:3000 . `setup:local` tạo `.env` riêng với JWT secret ngẫu nhiên, không ghi đè file có sẵn. Mặc định dùng SQLite trên máy. Khi chưa cấu hình email, vẫn học và lưu tiến độ cục bộ được; gửi OTP trả lỗi rõ ràng. Không có mã OTP giả cho production.

## Kết nối Supabase

Mở https://supabase.com/dashboard/project/tfpxpfjuoliltjhqvjyx và chọn **Connect → Transaction pooler**. Lưu URI vào `DATABASE_URL` trong `.env` trên máy và Cloudflare secret khi deploy. Nếu chưa biết mật khẩu database, đặt lại trong Dashboard rồi dùng mật khẩu mới. URL-encode phần mật khẩu trong URI; không đưa URI vào chat, commit, log hoặc `dist/`.

Driver dùng TLS và kiểm tra chứng chỉ, không dùng named prepared statements, pool tối đa hai kết nối mỗi request Worker. `server/supabase-ca.cjs` chứa chứng chỉ CA công khai của Supabase, tải qua HTTPS từ kho chính thức và dùng cho kết nối Supabase; luôn giữ kiểm tra chứng chỉ/hostname. Các tùy chọn SSL trong URI không được ghi đè chính sách TLS của ứng dụng. Đợt đầu có thể dùng tài khoản database từ Dashboard; trước khi vận hành lớn nên tách role backend có quyền trên schema `kienhoc` và quản lý credential riêng.

Schema `kienhoc` không được thêm vào danh sách Exposed schemas của Data API. RLS đã bật, không có policy cho anon/authenticated; frontend chỉ đi qua API đã xác thực. Security Advisor báo INFO “RLS Enabled No Policy” là hệ quả chủ đích của cấu hình backend truy cập riêng, không phải lý do để mở policy public.

Migration đã chạy cho project trên. Với project mới:

```powershell
npm run db:migrate
```

`npm start` tự chọn PostgreSQL khi `.env` có DATABASE_URL; để trống biến này để dùng SQLite.

## Chuyển dữ liệu thực tế

1. Dừng ghi trên ứng dụng cũ, chạy `npm run backup` trên máy đang giữ SQLite và giữ bản gốc.
2. Chép file snapshot vào `backups/` trên máy quản lý. Không đẩy file lên GitHub.
3. Chưa mở website cloud cho người dùng, giữ database đích trống. Đặt DATABASE_URL trong `.env` rồi chạy:

```powershell
npm run db:import -- ./backups/TEN_FILE.sqlite
```

Script mở nguồn read-only, kiểm tra integrity/schema tiến độ, nhập trong một transaction, kiểm tra lại từng dòng trước commit. Từ chối nếu users/progress/sessions/otps đích có dữ liệu, giữ nguyên database khi lỗi. Giữ user ID, email, bcrypt hash, tiến độ, revision và timestamp. Không nhập OTP/session cũ: người dùng đăng nhập lại. File nguồn không bị thay đổi.

Nếu trước đây chỉ học offline, tiến độ có thể ở localStorage trên trình duyệt của từng người, không có trong SQLite. Cần xuất/nhập tiến độ từ site cũ hoặc đăng nhập trên origin cũ để đồng bộ trước khi đổi domain. Domain mới không đọc được localStorage của domain cũ.

## Triển khai Cloudflare

Sau khi chủ tài khoản đăng ký và xác minh email:

```powershell
npx wrangler login
npx wrangler whoami
```

Tạo secret bằng prompt tương tác, không đặt giá trị bí mật trong dòng lệnh hoặc mã nguồn:

```powershell
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_FROM
```

JWT_SECRET là chuỗi ngẫu nhiên riêng tối thiểu 32 ký tự. RESEND_API_KEY và EMAIL_FROM cần domain gửi đã được Resend xác minh (xem mục email trong DEPLOY_VI.md). Không có cấu hình mail thì OTP chưa hoạt động.

Sửa `vars.APP_ORIGINS` trong `wrangler.jsonc` thành origin HTTPS thật của Worker/custom domain; các origin cách nhau dấu phẩy. Giữ frontend `apiBase:''`. Chưa có URL thật thì không tự đoán hostname. `TRUST_PROXY_HOPS=1` dùng cùng mã Worker lọc header IP.

```powershell
npm test
npm run cf:check
npm run cf:deploy
```

Static assets chỉ lấy từ `dist/`, API dùng Express qua Node HTTP compatibility. Kết nối PostgreSQL được tạo/đóng theo request để tuân thủ vòng đời socket của Workers. Rate limit IP lưu trên PostgreSQL, bổ sung binding AUTH_LIMITER tại Cloudflare; cooldown/giới hạn OTP theo email và khóa giao dịch cũng nằm trong PostgreSQL. Lưu tiến độ dùng khóa giao dịch theo tài khoản, tránh ghi đè khi nhiều Worker cùng nhận revision cũ.

Để thử runtime Worker local, sao chép `.dev.vars.example` thành `.dev.vars`, điền giá trị thật rồi `npm run cf:dev`. File này được Git bỏ qua. Kiểm tra giới hạn CPU của gói Cloudflare với bcrypt cost 12 trước khi vận hành; đóng gói thành công không chứng minh thời gian CPU production đủ.

Chỉ trỏ domain/DNS sau khi URL Worker đã qua nghiệm thu; lưu các bản ghi DNS hiện tại để khôi phục. Không cần chuyển nameserver để thử bằng workers.dev.

## Nghiệm thu và quay lại

- `/api/health` phải trả 200, `database:true`; DB không truy cập được trả 503.
- Gửi OTP tới email thật, đăng nhập mật khẩu cũ sau import, xác nhận OTP chỉ dùng một lần.
- Hai máy đăng nhập cùng email phải thấy tiến độ, hai tài khoản không được thấy dữ liệu nhau.
- Hai thiết bị cùng sửa: revision xung đột trả 409, frontend merge rồi gửi lại.
- Kiểm tra offline/online, đăng xuất thu hồi phiên, đổi mật khẩu thu hồi phiên khác, redeploy không mất dữ liệu.
- `.env`, source backend và backup truy cập bằng URL phải trả 404.

Test tự động: SQLite API/client/sync, PostgreSQL bằng PGlite (engine PostgreSQL WASM), nhập snapshot giữ mật khẩu/ID/revision, từ chối ghi đè đích đã có dữ liệu. PGlite chỉ có một session nên không thay thế kiểm thử nhiều kết nối thật. Worker đã được chạy thử local với assets 200, API báo 503 khi DB không truy cập được và source/secrets 404. Chưa kiểm chứng TCP/TLS tới Supabase từ Worker production, email thật, CPU production hay DNS.

Giữ bản SQLite và phiên bản ứng dụng cũ để rollback trước khi mở ghi cloud. Khi đã có dữ liệu mới trên cloud, không quay về SQLite cũ mà bỏ qua dữ liệu mới; cần dừng ghi và đối chiếu/xuất dữ liệu trước. Chưa sửa DNS hay ngừng backend trên máy cũ.

Tài liệu nền: [Cloudflare Express](https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/), [Supabase kết nối Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres), [RLS không có policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
