# Phòng tranh đấu — bản duyệt riêng

Preview: https://kienhoc-pk-preview.anhdungcasi.workers.dev/#tranh-dau

Không triển khai Worker `kienhoc`, không đổi cơ sở dữ liệu học thật, không bật phòng PK trên miền chính trong lần thay đổi này. Nhánh này dựa trên nhánh cập nhật câu chữ và dock của PR #5.

## Cách thử

1. Mỗi người mở preview trên trình duyệt của mình, chọn **Phòng tranh đấu** trong dock.
2. Tạo **hồ sơ thử** bằng tên và ảnh tùy chọn. Không nhập email, mật khẩu hoặc OTP thật. Hồ sơ thử có cookie riêng, hiệu lực 2 giờ.
3. Chủ phòng chọn một trong ba môn, 5/10/20 câu và 15/20/30/45 giây mỗi câu. Sao chép mã hoặc link để mời bạn.
4. Phòng có 2–8 người. Tất cả trực tuyến và sẵn sàng thì chủ phòng bắt đầu.
5. Chat gửi trực tiếp qua WebSocket. Mở voice và chọn **Tham gia voice** nếu muốn nói chuyện; cho phép micro khi trình duyệt hỏi, sau đó bấm **Bật micro**. Có thể tiếp tục chat/thi nếu từ chối quyền micro.
6. Kết thúc lượt có bục xếp hạng, bảng điểm, đáp án và lời giải. Đấu lại dùng cùng bộ câu, đảo điểm bắt đầu; tạo phòng mới để lấy bộ đề ngẫu nhiên mới.

Hồ sơ thử đồng bộ tên/ảnh giữa các phòng của cùng trình duyệt. Adapter cho bản thật lấy trực tiếp username/avatar từ `user_profiles` sau khi xác thực phiên đăng nhập; không nhận danh tính do trình duyệt tự khai. Dữ liệu thử không chuyển sang tài khoản học thật.

## Phạm vi thiết kế

- `countup.txt`: chuyển hiệu ứng cuộn từng chữ số sang Vanilla JS, giữ độ rộng ổn định, hỗ trợ giảm chuyển động, dùng chung frontend và trang quản trị.
- `avtgroup.txt`: nhóm avatar chồng lớp, nhấc nhẹ khi hover/focus, tooltip và avatar cá nhân.
- `voicechatwd.txt`: thanh voice gọn có thể mở rộng, thành viên, bật/tắt micro, rời voice, chỉ báo âm lượng lấy từ luồng âm thanh.
- `leaderboard.txt`: bố cục bục 2–1–3, vàng/bạc/đồng và danh sách xếp hạng; hỗ trợ đồng hạng.
- `groupchatpk.txt`: tin nhắn liên tiếp cùng người gửi gom dưới một avatar; header có nhóm avatar, kênh và thời gian. Dùng Blobatar 2.7.0 tạo avatar mẫu ổn định bằng ID ngay trên trình duyệt, không gửi tên/ID sang dịch vụ ảnh. Avatar tải lên luôn được ưu tiên. Nguồn: https://github.com/Alain00/blobatar (MIT, giấy phép kèm bundle).
- Dùng nền website đang chọn và các token màu `--ui-*`, không dựng một nền riêng hoặc một runtime React thứ hai.

## Số liệu cộng đồng

`GET /api/community/stats` chỉ trả số tổng hợp: không email, IP, mã phiên, avatar hay hồ sơ người học.

- Đang hoạt động: trình duyệt có tín hiệu trong 120 giây gần nhất, không phải số người tuyệt đối.
- Đã ghé thăm: trình duyệt duy nhất trong 90 ngày dữ liệu đang giữ.
- Tài khoản: tổng tài khoản đang có trong hệ thống. Trên preview đây là **hồ sơ thử**, không phải số tài khoản thật.
- Frontend cập nhật khoảng 30 giây khi tab hiện; response backend thật cho phép cache 15 giây. Tôn trọng cơ chế chặn đo lường hiện có nên có thể đếm thiếu. Một người dùng nhiều trình duyệt có thể được đếm nhiều lần.
- Các số quản trị vẫn ở sau xác thực quản trị. Chỉ thêm hoạt ảnh vào số liệu đã có, không công khai API quản trị.

## Quy tắc và an toàn

- Máy chủ Durable Object giữ trạng thái và đồng hồ; mỗi người khóa một đáp án mỗi câu. Đúng được 1.000 điểm và tối đa 500 điểm tốc độ; trình duyệt không gửi điểm được tin cậy.
- Chỉ chọn câu có một đáp án rõ ràng, không cần đối chiếu hoặc đáp án bổ sung. Ngân hàng hiện có 337 câu Lịch sử Đảng, 167 câu Truyền tin, 104 câu AI đủ điều kiện.
- Không gửi đáp án/lời giải trong snapshot trước khi kết thúc lượt. Đây là thi vui: bộ đề học gốc vốn có sẵn trên website, không phải hệ thống chống tra cứu/gian lận cho kỳ thi chính thức.
- Vé WebSocket dùng một lần trong 30 giây. Kiểm tra Origin, danh tính, thành viên, quyền chủ phòng, dung lượng tin và giới hạn thao tác. Chat hiển thị bằng escape HTML.
- Phòng và tin nhắn tối đa 80 tin tồn tại 12 giờ; alarm xóa trạng thái khi hết hạn. Chủ phòng mất kết nối 45 giây có thể chuyển quyền cho người trực tuyến. Người bỏ cuộc khi đang thi không nhận hạng; người rời sau khi đã kết thúc vẫn giữ kết quả; chủ phòng có thể mời người khác rời phòng chờ.
- Voice dùng WebRTC mesh, không ghi âm. Micro tắt lúc vào; rời voice/phòng, đổi mục hoặc đóng trang sẽ dừng track. Các yêu cầu cấp quyền/ICE trả về muộn không được bật voice trở lại.
- Chưa cấu hình TURN relay. STUN hỗ trợ kết nối trực tiếp nhưng **không bảo đảm thông thoại giữa mọi mạng/Wi‑Fi/4G hoặc firewall**. Kết nối P2P có thể lộ địa chỉ mạng giữa các thành viên. Chưa bật dịch vụ relay có tính phí vượt hạn mức.
- Secret preview trong `battle-preview/.dev.vars`/Cloudflare secret, không đưa vào Git. Preview không có secret Supabase, khóa gửi mail hay khóa đăng nhập thật.

## Kiểm tra và vận hành

`npm test` kiểm tra backend hiện tại và quy tắc PK; bổ sung kiểm tra danh tính server, phiên bị thu hồi, đồng hồ, quyền, giới hạn phòng, chat, khóa đáp án và dừng micro khi đóng trong lúc đang xin quyền.

`PK_TEST_ORIGIN=https://kienhoc-pk-preview.anhdungcasi.workers.dev node scripts/check-battle-preview.cjs` chạy hai danh tính độc lập, WebSocket, chat, tín hiệu voice và đủ 5 câu qua alarm thật. Script xác nhận đúng service preview trước khi tạo dữ liệu thử; không chạy vào production.

`/__fixture/rtc` trên preview có nút kiểm tra hai WebRTC peer bằng âm thanh tổng hợp, không dùng micro. Kiểm tra được RTP audio thật ở vòng lặp trình duyệt, **không thay thế thử voice bằng hai thiết bị trên hai mạng khác nhau**.

Đã kiểm tra UI phòng, khóa đáp án, kết quả và đổi nền bằng trình duyệt; kiểm tra viewport 390px. Vẫn cần nhóm thử trên Xiaomi/Safari thực tế để đánh giá mic, autoplay và điều kiện NAT.

```sh
npm run pk:dev
npm run pk:preview:deploy
```

Lệnh preview chỉ dùng `battle-preview/wrangler.jsonc`, Worker `kienhoc-pk-preview`. Cấu hình production hiện chưa có `PK_ENABLED`, binding hay migration PK. Sau khi được duyệt mới chuẩn bị cấu hình production, kế hoạch TURN, xác minh phiên và kiểm tra hai thiết bị; không bật production bằng cách sao chép danh tính/hồ sơ thử.
