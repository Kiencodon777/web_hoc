# Kiến Học — Backend thật, hosting và tên miền riêng

Cập nhật: 23/10/2026. Mã nguồn đã có Express, SQLite, OTP qua Resend, JWT, đăng nhập bằng mật khẩu và đồng bộ frontend. Chưa có tài khoản Render/Resend, khóa gửi email hoặc quyền DNS trong phiên làm việc này, nên chưa có backend production hay tên miền được cấu hình thay bạn. Bản Sites cũ chỉ phục vụ frontend tĩnh; không chạy tiến trình Node.js Express.

## 1. Chọn phương án lưu dữ liệu trước

Bản này triển khai **một Node Web Service trên Render, kèm Persistent Disk**. Express phục vụ cả thư mục `dist/` và `/api/`, nên frontend/backend dùng cùng một tên miền, không cần sửa URL API.

**SQLite + Render Free không phù hợp để lưu tài khoản thật:** Render Free không có persistent disk; file DB có thể mất khi restart, deploy hoặc dịch vụ ngủ. Blueprint `render.yaml` chọn `starter` và disk 1 GB, có phí. Đọc chi phí hiện tại trong Dashboard trước khi tạo. Không đổi `starter` thành `free` rồi sử dụng DB đó cho dữ liệu quan trọng.

Nếu bắt buộc miễn phí, cần đổi database sang Postgres bên ngoài (ví dụ Supabase), thay lớp truy vấn SQLite và kiểm tra lại. Không đưa nguyên `better-sqlite3` lên Vercel serverless để làm database bền vững. Railway cũng cần volume bền vững cho SQLite; không mặc định xem là hosting miễn phí lâu dài. Hướng dẫn dưới đây dùng Render để tránh hai bộ cấu hình khác nhau.

Nguồn: [Render Free](https://render.com/docs/free), [Persistent Disk](https://render.com/docs/disks), [Web Services](https://render.com/docs/web-services).

## 2. Cấu trúc project

| Đường dẫn | Vai trò |
|---|---|
| `dist/index.html` | Trang vào thật của dự án; không có file riêng `site_index.html` |
| `dist/` | Toàn bộ frontend Vanilla JS, CSS, shader và ngân hàng câu hỏi |
| `dist/auth-modal.js` | Gọi API OTP, mật khẩu, đặt mật khẩu và đăng xuất |
| `dist/cloud-sync.js` | JWT, tải/lưu tiến độ, xử lý mất mạng và xung đột |
| `dist/progress-merge.js` | Gộp dữ liệu theo thời điểm, giữ thao tác bỏ đánh dấu |
| `dist/api-config.js` | API mặc định cùng origin; để `apiBase: ''` khi chạy chung |
| `server/app.cjs` | Express, các route API, bảo mật, static frontend |
| `server/database.cjs` | Schema SQLite, WAL, index |
| `server/mail.cjs` | Gửi email HTML thương hiệu Kiến Học qua Resend |
| `server/index.cjs` | Cổng HTTP và tắt server an toàn |
| `server/preview.cjs` | Chỉ dành cho preview nội bộ; không thay production entrypoint |
| `.env.example` | Mẫu biến môi trường, không chứa secret thật |
| `render.yaml` | Blueprint Render có disk bền vững |
| `scripts/backup.cjs` | Sao lưu online bằng SQLite Backup API |
| `tests/` | Kiểm tra API, OTP, đồng bộ, tài khoản và frontend cũ |

`express.static()` chỉ mở `dist/`. Database, `.env`, source backend và thư mục backup không được phục vụ qua HTTP.

## 3. Chạy thử trên máy tính

Cài Node.js 22 rồi giải nén source. Mở terminal trong thư mục chứa `package.json`:

```bash
npm ci
```

Sao chép `.env.example` thành `.env`. Tạo secret trên máy của bạn:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Dán kết quả vào `JWT_SECRET` trong `.env`, không đưa vào GitHub hay mã frontend. Các giá trị chạy local:

```dotenv
PORT=3000
NODE_ENV=development
JWT_SECRET=THAY_BANG_CHUOI_NGAU_NHIEN_VUA_TAO
DATABASE_PATH=./data/kienhoc.sqlite
RESEND_API_KEY=THAY_BANG_API_KEY_CUA_BAN
EMAIL_FROM=Kiến Học <dangnhap@auth.vietkienetet.id.vn>
APP_ORIGINS=http://localhost:3000
TRUST_PROXY_HOPS=0
```

Điền khóa Resend thật và xác minh domain theo mục 4. Sau đó:

```bash
npm test
npm start
```

Mở `http://localhost:3000`. Kiểm tra `/api/health` trả JSON có `service: "kienhoc-api"`. Thiếu `JWT_SECRET` hợp lệ, production server sẽ từ chối chạy; thiếu cấu hình email, API gửi mã trả lỗi thay vì giả vờ gửi thành công.

## 4. Bật gửi email thật với Resend

1. Tạo tài khoản tại [Resend](https://resend.com), tự hoàn tất đăng nhập/xác minh tài khoản.
2. Vào **Domains**, thêm `auth.vietkienetet.id.vn`. Dùng subdomain riêng để tách email xác thực khỏi email khác đang có của domain.
3. Resend cung cấp bản ghi DKIM/SPF và bản ghi liên quan. Đăng nhập [zonedns.vn](https://zonedns.vn), chọn đúng zone `vietkienetet.id.vn`, mở phần quản lý bản ghi DNS.
4. Sao chép **đúng loại, tên host và giá trị do Resend hiển thị**. Ví dụ nếu tên đầy đủ là `resend._domainkey.auth.vietkienetet.id.vn`, trường tên tương đối trong zone sẽ là `resend._domainkey.auth` nếu ZoneDNS tự thêm đuôi domain. Kiểm tra tên đầy đủ sau khi lưu để tránh thêm đuôi hai lần.
5. Không tự đoán DKIM/SPF. Không thay bản ghi MX/TXT email hiện có ở `@` bằng giá trị cho subdomain gửi mail. Tên/giá trị cụ thể được sinh theo tài khoản và vùng của Resend.
6. Bấm xác minh domain trong Resend, chờ trạng thái verified.
7. Tạo API key có quyền gửi mail, giới hạn đúng domain nếu có lựa chọn. Lưu vào `RESEND_API_KEY` của hosting; `EMAIL_FROM` dùng địa chỉ thuộc domain đã xác minh như mẫu ở trên.
8. Thử gửi mã đến email của chính bạn. Xem cả Spam. API key có định dạng hợp lệ chưa đồng nghĩa domain hay khả năng gửi đã được cấu hình đúng.

Không dùng địa chỉ gửi thử mặc định của Resend cho người học thật. Không gửi API key vào khung chat hoặc đặt trong `dist/`.

Nguồn: [SDK Node.js](https://resend.com/docs/send-with-nodejs), [Verified Domains](https://resend.com/docs/dashboard/domains/introduction), [Create API key](https://resend.com/docs/create-an-api-key).

## 5. Đẩy lên GitHub

Tạo repository mới trong tài khoản GitHub của bạn, khuyên chọn **Private** cho phần vận hành. Upload toàn bộ source đã giải nén, gồm `dist`, `server`, `scripts`, `tests`, `package.json`, `package-lock.json`, `render.yaml` và `.env.example`.

Không upload `node_modules/`, `.env`, `data/`, `backups/`, các file `.sqlite`, `.db`, bản sao lưu hoặc log. `.gitignore` đã chặn các đường dẫn đó. Nếu dùng Git qua terminal trên một thư mục giải nén mới:

```bash
git init
git add .
git commit -m "Add Kien Hoc backend and cloud sync"
git branch -M main
git remote add origin URL_REPOSITORY_GITHUB_CUA_BAN
git push -u origin main
```

Thay `URL_REPOSITORY_GITHUB_CUA_BAN` bằng URL GitHub thực tế, không dùng Git remote nội bộ của Sites. Kiểm tra danh sách file trước khi push.

## 6. Deploy Render

1. Đăng ký/đăng nhập [Render](https://dashboard.render.com), kết nối repository GitHub vừa tạo. Tự xác nhận điều khoản và chi phí trong tài khoản của bạn.
2. Chọn **New → Web Service**, chọn repo và branch `main`. Root Directory để trống nếu `package.json` ở gốc.
3. Runtime: Node. Build Command: `npm ci --omit=dev`. Start Command: `npm start`. Health Check Path: `/api/health`.
4. Chọn gói có Persistent Disk. Gắn disk 1 GB ở `/var/data`. Một instance ứng dụng, không chạy nhiều replica chia sẻ file SQLite.
5. Trong Environment, khai báo bảng dưới. Không cần tự đặt `PORT` trên Render: ứng dụng đọc biến `PORT` do Render cấp và listen `0.0.0.0`.
6. Deploy, lấy **URL thật Render trả về**. Hướng dẫn dùng ký hiệu `<TEN_DICH_VU>.onrender.com`, không khẳng định `kienhoc.onrender.com` còn trống hoặc đã được tạo.
7. Mở URL đó, kiểm tra health, đăng nhập OTP và làm thử câu hỏi. Restart service, đăng nhập lại và kiểm tra tiến độ vẫn còn; bước này kiểm chứng disk được mount đúng.

| Biến | Giá trị production |
|---|---|
| `NODE_VERSION` | `22` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Chuỗi ngẫu nhiên riêng, tối thiểu 32 ký tự; Blueprint có thể tự sinh |
| `DATABASE_PATH` | `/var/data/kienhoc.sqlite` |
| `RESEND_API_KEY` | Khóa gửi mail thật, chỉ lưu ở Environment |
| `EMAIL_FROM` | `Kiến Học <dangnhap@auth.vietkienetet.id.vn>` sau khi xác minh |
| `APP_ORIGINS` | `https://<TEN_DICH_VU>.onrender.com,https://vietkienetet.id.vn,https://www.vietkienetet.id.vn` |
| `TRUST_PROXY_HOPS` | `1` trên Render; không đặt `true` để tin mọi proxy |

Thay placeholder bằng hostname thật. Các origin cách nhau dấu phẩy, không có dấu `/` cuối. Có thể dùng **New → Blueprint** để đọc `render.yaml`; cấu hình này cũng tạo tài nguyên trả phí, cần kiểm tra trước khi xác nhận.

## 7. Trỏ tên miền tại ZoneDNS

Chỉ thực hiện khi Render URL đã chạy tốt. Trong Render Web Service → **Settings → Custom Domains → Add Custom Domain**, nhập `vietkienetet.id.vn`. Render có thể tự thêm hostname `www` và cấu hình chuyển hướng. Ghi lại hướng dẫn DNS của đúng service đó.

Đăng nhập [ZoneDNS](https://zonedns.vn), chọn zone `vietkienetet.id.vn`. Trước khi sửa, xuất/chụp lại bản ghi hiện tại. Với cấu hình root A và www CNAME, điền:

| Loại | Tên / Host | Giá trị | TTL |
|---|---|---|---|
| `A` | `@` | `216.24.57.1` | `300` hoặc mặc định |
| `CNAME` | `www` | `<TEN_DICH_VU>.onrender.com` — hostname thật từ Render | `300` hoặc mặc định |

IP trên là giá trị Render công bố tại thời điểm viết. Nếu Dashboard hướng dẫn khác, ưu tiên giá trị mới tại Dashboard. Không đưa `https://`, đường dẫn `/` hoặc cổng vào giá trị CNAME. Không đặt CNAME cho `@` nếu ZoneDNS không hỗ trợ alias/flattening tại root.

Chỉ thay/xóa các A, AAAA, CNAME hay forwarding xung đột ở **đúng hostname web `@` và `www`**. Không xóa hàng loạt TXT/MX/DKIM, không đổi nameserver khi chưa cần. Nếu domain hiện đang trỏ về một website khác, thay bản ghi web sẽ chuyển lưu lượng sang Kiến Học.

Nguồn: [Render DNS](https://render.com/docs/configure-other-dns).

## 8. Kiểm tra DNS và HTTPS

Quay lại Render, bấm Verify ở Custom Domains. Chờ DNS cập nhật rồi kiểm tra:

```bash
nslookup -type=A vietkienetet.id.vn
nslookup -type=CNAME www.vietkienetet.id.vn
```

A phải ra IP được Render yêu cầu, CNAME phải đúng hostname của service. Kiểm tra zone đang có nameserver authoritative của ZoneDNS; nếu domain dùng nameserver nhà cung cấp khác thì bản ghi vừa nhập ZoneDNS chưa có hiệu lực.

Sau khi domain được xác minh, Render tự cấp và gia hạn TLS, tự chuyển HTTP sang HTTPS. Mở `https://vietkienetet.id.vn` và `/api/health`, kiểm tra chứng chỉ hợp lệ. Nếu lỗi cấp chứng chỉ, kiểm tra A/AAAA/CNAME cũ, các bản ghi CAA hiện có và hướng dẫn lỗi trong Dashboard; không bỏ qua cảnh báo SSL của trình duyệt. Xác minh cả `www` và hướng chuyển hướng.

Nguồn: [Custom Domains và TLS](https://render.com/docs/custom-domains).

## 9. Chuyển tiến độ từ website cũ

`localStorage` phụ thuộc origin: dữ liệu ở `chatgpt.site`, `onrender.com` và tên miền riêng **không tự xuất hiện ở nhau**.

- Trước khi chuyển, xuất bản sao tiến độ Lịch sử Đảng qua mục Lộ trình & lưu ý của website cũ. Trên domain mới, nhập bản sao đó rồi đăng nhập để tải lên cloud.
- Nếu muốn chuyển cả các lựa chọn KHDL và trạng thái bài đọc, cấu hình `dist/api-config.js` trên **website cũ** với `apiBase` là URL Render thật, thêm origin website cũ vào `APP_ORIGINS` của backend, rồi xuất bản frontend cũ. Đăng nhập một lần trên site cũ để tải cả ba loại dữ liệu lên tài khoản. Sau đó đăng nhập cùng tài khoản ở tên miền mới.
- Trong bản chạy chung frontend/backend trên Render, vẫn để `apiBase: ''`.

Không có cách hợp lệ để domain mới âm thầm đọc localStorage của domain cũ. Giữ bản sao trước khi chuyển; không xóa tiến độ cũ để thử đồng bộ.

## 10. Cách đăng ký, mật khẩu và đồng bộ

Lần đầu: nhập email → nhận OTP → xác thực; server tự tạo tài khoản. Muốn dùng mật khẩu: sau khi đăng nhập OTP, mở **Tài khoản → Tạo / đổi mật khẩu** trong vòng 15 phút. Quên mật khẩu: xác minh lại bằng OTP rồi đặt mật khẩu mới. Việc đổi mật khẩu kết thúc những phiên đăng nhập khác.

JWT lưu localStorage theo yêu cầu, tồn tại 7 ngày khi ghi nhớ hoặc 12 giờ khi không ghi nhớ; trường hợp không ghi nhớ còn bị giới hạn bởi marker phiên tab. Không có refresh-token dài hạn. Logout thu hồi session phía server khi kết nối được; nếu offline chỉ xóa token ở máy, token server còn hiệu lực đến khi hết hạn.

Đồng bộ tự tải khi đăng nhập, lưu sau thay đổi, tự thử lại khi có mạng. History, bookmark, lượt đang dở, tùy chọn đọc/âm thanh, lựa chọn KHDL và bài đọc được lưu cùng tài khoản. Dữ liệu tài khoản cũ được tách cache khi đổi người dùng để tránh nhập nhầm vào tài khoản mới.

Khi hai thiết bị cùng sửa: dùng revision để phát hiện xung đột; frontend gộp theo timestamp rồi gửi lại. Câu trả lời lấy bản mới hơn. Counter số lần làm dùng `max`, không cộng bản sao lặp; vì thế hai lần làm đồng thời ở hai máy không bảo đảm được cộng thành hai lượt analytics riêng. Bỏ bookmark và xóa tiến độ có dấu thời gian để dữ liệu cũ không tự khôi phục. Cần giờ thiết bị tương đối chính xác. Đây không phải nhật ký sự kiện phục vụ thi có giám sát.

## 11. API và schema

| API | Đầu vào / xác thực | Kết quả |
|---|---|---|
| `GET /api/health` | Không cần JWT | Tình trạng API, cấu hình email |
| `POST /api/auth/send-otp` | `{email}` | Gửi thật, `retryAfter:30`; mã hết hạn sau 5 phút |
| `POST /api/auth/verify-otp` | `{email,code,remember}` | `{token,user,expiresIn}` |
| `POST /api/auth/password-login` | `{email,password,remember}` | `{token,user,expiresIn}` |
| `GET /api/auth/me` | Bearer JWT | `{user}` |
| `POST /api/auth/set-password` | Bearer JWT từ OTP gần đây, `{password}` | Lưu bcrypt hash |
| `POST /api/auth/logout` | Bearer JWT, `{}` | Thu hồi session hiện tại |
| `GET /api/progress` | Bearer JWT | `{progressData,revision,updatedAt}` |
| `POST /api/progress` | Bearer JWT, `{progressData,expectedRevision}` | Revision mới; `409` chứa bản hiện tại nếu xung đột |

POST dùng `Content-Type: application/json`. `progressData` giữ schema legacy `version:1`, thêm `_sync` để đồng bộ. SQLite có `users`, `otps`, `progress` và `sessions`. Cột `otps.code` lưu **HMAC-SHA256**, không lưu mã rõ 6 số; thêm `attempts`, `created_at` để khóa sau 5 lần sai và giữ cooldown qua restart. `progress` thêm revision. Email không xác thực không được tự chọn user ID của tài khoản khác; ID lấy từ JWT đã kiểm tra session.

## 12. Sao lưu, kiểm thử và giới hạn triển khai

Trên server có quyền vào disk:

```bash
npm run backup
```

Mặc định lưu snapshot trong `./backups` (thư mục này không bền trên Render). Để giữ tại disk, đặt `BACKUP_DIR=/var/data/backups`. Dùng Backup API có trong script, không copy riêng file DB đang ghi WAL. Tải bản sao định kỳ ra nơi lưu trữ khác và bảo vệ như dữ liệu tài khoản. Không để backup trong `dist/` hoặc GitHub.

Khôi phục: dừng service ghi dữ liệu; giữ nguyên bản cũ; tải snapshot lên **đường dẫn file SQLite mới** trong disk; đổi `DATABASE_PATH` sang file mới; khởi động lại và kiểm tra. Chọn file mới giúp tránh gắn nhầm WAL cũ. Không dùng xoay JWT_SECRET như thao tác bảo trì thông thường: đổi secret sẽ kết thúc mọi phiên và làm mã OTP đang phát mất hiệu lực.

Kiểm tra nghiệm thu trên hosting thật:

1. OTP đến email thật, không có mã trong API response/log; sai mã, mã cũ, mã dùng lại đều bị từ chối.
2. Đăng nhập máy A, làm bài; đăng nhập cùng email máy B thấy dữ liệu.
3. Làm thêm khi mất mạng rồi có mạng trở lại; kiểm tra trạng thái đồng bộ.
4. Tài khoản B khác email không nhìn thấy dữ liệu của tài khoản A.
5. Restart/redeploy vẫn còn user và progress.
6. Root domain/www đều có HTTPS hợp lệ; trang học không gọi nhầm API của frontend tĩnh.

Các test tự động đã kiểm tra API + client với SQLite thật và bộ gửi mail giả lập dành riêng cho test. **Chưa kiểm chứng email giao đến hộp thư thật, DNS hay dịch vụ Render thật**, vì cần tài khoản/khóa/cấu hình riêng của bạn. Không có mock authentication hay đường tắt chấp nhận mã bất kỳ trong runtime production.
