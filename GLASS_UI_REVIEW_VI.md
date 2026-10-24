# Phân tích mẫu và bản nâng cấp Liquid Glass

Ngày 24/10/2026. Phạm vi: đăng nhập, dock, đổi môn, footer và lịch ghi chú. Giữ bộ câu hỏi, cách chấm bài, backend và khóa lưu tiến độ hiện có.

## 1. Phân tích bốn file được cung cấp

Các bản gốc được giữ trong `design-references/2026-glass/`. Những lời dẫn như “install React/shadcn”, “copy-paste” và “fill Unsplash images” là hướng dẫn của mẫu, không phải yêu cầu chuyển framework của chủ dự án. Website này đang dùng JavaScript thuần; chuyển toàn bộ sang React chỉ để dùng bốn thành phần sẽ tăng đáng kể phạm vi và rủi ro. Bản triển khai chuyển hành vi/thiết kế sang cấu trúc hiện tại, không thêm dependency runtime.

| Mẫu | Cấu trúc và hành vi thật | Điều cần sửa khi tích hợp |
|---|---|---|
| `signinspace.txt` | SpaceLogin, phi hành gia PNG nhúng trong file, starfield canvas, parallax/float, trường kính với SVG displacement theo kênh màu. Có nhánh fallback theo trình duyệt. | Nhánh submit mặc định chỉ chờ rồi báo thành công; không thể dùng làm xác thực thật. Các nút mạng xã hội cần OAuth riêng. Dùng asset phi hành gia thật của mẫu, chuyển chuyển động sang CSS; giữ API OTP/mật khẩu hiện có và không thêm social login giả. |
| `otpbox.txt` | Luồng email → code → success, phong bì, 6 ô mã, hỗ trợ paste/autofill, đổi email, resend theo deadline, xử lý pending và response cũ, reduced motion. | Đây là UI do host cung cấp delivery/verification. Phần demo có mã và autoplay giả, không dùng trong production. Giữ request tới backend thật, giới hạn 5 phút/5 lần thử và chỉ báo thành công sau khi backend xác nhận. |
| `glasscalendar.txt` | Thẻ kính 360px, nhãn tuần/tháng, tháng trước/sau, dải ngày ngang và chấm hôm nay. | Hai nút tuần/tháng không có handler; Add note/New Event/Settings cũng chưa có chức năng. Không có model ghi chú hoặc lưu trữ. Bổ sung hai chế độ tuần/tháng thật, ghi chú theo ngày, lưu trình duyệt, thông báo lỗi và xuất JSON. Không thêm event/planner khi chưa được yêu cầu. |
| `footer.txt` | Footer nhiều cột với newsletter, quick links, địa chỉ mẫu, mạng xã hội, theme switch và legal links. | Email/địa chỉ/company/links là placeholder; newsletter không có backend. Thay bằng tên tác giả Dũng Phạm và Viết Kiên, liên kết nội bộ hoạt động, trạng thái liên hệ đang chờ bổ sung. Không dựng địa chỉ, mạng xã hội hay điều khoản giả. |

### Phối hợp OTP và SpaceLogin

Một dialog chung với nền vũ trụ, phi hành gia và một vùng biểu mẫu kính. OTP là cách đăng nhập mặc định; mật khẩu là lựa chọn phụ. Ba bước dùng cùng bố cục và hệ màu. Trên điện thoại, phi hành gia thu nhỏ ở đầu dialog để dành chỗ cho trường nhập. Giữ native dialog, focus containment, Escape, paste mã, cooldown, lỗi tại chỗ và trạng thái pending. Không thêm nút đăng nhập Google/GitHub khi chưa có tích hợp xác thực tương ứng.

## 2. Phân tích repo archisvaze/liquid-glass

Nguồn: https://github.com/archisvaze/liquid-glass, commit `fbeb99ef5e8dad2cbbc991ffc23e186a28dc01c4`. Đã đọc README, giấy phép, `index.html`, cấu trúc `index.css`/`ui.js` và nhánh shader trong `webgl.html`.

Repo là demo tương tác, không phải một thư viện thành phần UI hoàn chỉnh. Có hai cách vẽ:

1. SVG: tạo profile khúc xạ từ độ dày kính, bezel và IOR, dùng gradient bề mặt để tính normal và hướng khúc xạ; xuất displacement map RG cùng specular map. Filter kết hợp blur → feImage → feDisplacementMap → saturation → specular/composite/blend, áp dụng bằng backdrop-filter. Map phụ thuộc kích thước và bán kính của từng khối. README ghi nhánh này chỉ dành cho Chrome/Chromium.
2. WebGL: Three.js và shader toàn màn hình, signed distance của rounded rectangle, pháp tuyến bề mặt, ray refraction và nhiều mẫu blur. Shader lấy nền từ texture ảnh, không tự chụp được DOM hoặc canvas Sakura bên dưới thành nền khúc xạ. Vì vậy không thể đặt nguyên demo WebGL lên dock rồi hứa nó khúc xạ đúng toàn bộ website.

`ui.js` phục vụ demo (slider, presets, drag, lưu cấu hình/share); `bg-picker.js` đổi ảnh nền demo. Không nhập các bảng điều khiển, telemetry hoặc ảnh nền của demo vào website. Giấy phép MIT được giữ trong thư mục reference và trong phần mã tính toán được chuyển sang `dist/glass-optics.js`. Ảnh nền của repo không thuộc giấy phép MIT, nên không sao chép chúng.

### Cách áp dụng

- Chuyển nguyên thuật toán profile, displacement và specular sang module thuần JavaScript có attribution; IOR 1,45, độ dày tương đối 14px, strength 0,35 và specular 0,24 để kính không quá gắt.
- Mỗi bề mặt có filter ID riêng, đo bằng ResizeObserver và tạo lại khi thay kích thước. Giới hạn cạnh dài của map ở 540px rồi scale về kích thước logic; thu hồi observer/filter khi phần tử rời DOM. Không chạy shader/vòng animation liên tục cho khúc xạ tĩnh.
- Kính đặt ở lớp pseudo-element phía sau chữ. Foreground, biểu tượng và mã OTP không bị displacement.
- Chrome/Edge dùng nhánh SVG; Safari/Firefox dùng blur/saturation và viền sáng làm fallback. Không nhận là đã kiểm thử trực tiếp Safari/Firefox trong môi trường hiện tại.
- Dock giữ điều hướng và spring indicator hiện có, đổi vật liệu, giảm phóng to icon để chữ không xô lệch. Bộ chọn môn native được thay bằng listbox có mã môn, tên, số câu, dấu chọn, phím mũi tên/Home/End/Enter/Escape và đóng khi click ngoài.

## 3. Lịch và dữ liệu ghi chú

- Mặc định xem tuần; có xem tháng, tuần bắt đầu thứ Hai, hôm nay, chuyển khoảng ngày và chọn ngày.
- Khóa lưu riêng `kienhoc-calendar-notes-v1`, phân ngày bằng ngày địa phương (không cắt ISO UTC). Tối đa 4.000 ký tự/ngày, 1.000 ngày; không ảnh hưởng các khóa tiến độ và tài khoản.
- Có lưu, tự lưu khi đổi ngày/đóng lịch/rời trang, chấm báo ngày có ghi chú và xuất bản sao JSON gồm cả bản nháp. Ghi chú được đưa vào textarea bằng value, không nội suy thành HTML.
- Lỗi lưu trữ không báo thành công, giữ bản nháp và chặn đổi ngày/đóng lịch qua điều khiển để người dùng còn có thể xuất bản sao.
- Chỉ lưu trên trình duyệt này, chưa đồng bộ giữa thiết bị/tài khoản; ghi rõ trong UI. Không phải hệ thống lập kế hoạch, nhắc việc hay sự kiện đầy đủ.

## 4. Kiểm chứng và giới hạn

- Bộ 26 Node tests và academy/UI physics đã đạt sau tích hợp; không sửa schema hay logic chấm bài.
- Trình duyệt với backend SQLite trong bộ nhớ riêng: gửi OTP, nhập sai mã nhận lỗi, nhập đúng đăng nhập và đồng bộ thành công. Hộp thư kiểm thử chỉ có trên server tạm localhost, không gửi email và không đưa vào dist/production.
- Đổi môn bằng ArrowDown + Enter hoạt động; listbox giữ lựa chọn và trả focus về nút hiển thị.
- Ghi chú thử được lưu, tải lại trang vẫn đọc đúng, rồi dọn ghi chú thử. Xem tuần hoạt động, có dấu ngày đã ghi chú.
- Kiểm tra thực tế ở 375×812 và 812×375: không tràn ngang; dialog cao giới hạn theo viewport và cuộn được khi nằm ngang. Có CSS cho reduced motion, motion-off của website, reduced transparency và forced colors.
- Chưa kiểm chứng VoiceOver/NVDA, Dynamic Type cấp hệ điều hành, hoặc máy Safari/Firefox thật. Không tuyên bố chứng nhận WCAG hay giống từng pixel.

## 5. Đánh giá mức hoàn thiện

Đây là đánh giá thiết kế, không phải số đo khoa học: khoảng **85–90% về mức bám sát tinh thần các mẫu trên Chromium**. Các hạng mục được yêu cầu đã có chức năng: login kết hợp, vật liệu dock, bảng đổi môn, footer hai tác giả và lịch ghi chú. Khác biệt còn lại có chủ đích: không chạy Three.js toàn màn hình, không khúc xạ chữ, không tạo social/contact/newsletter giả và chưa có planner/cloud notes. Mức tương đồng trên Safari/Firefox thấp hơn do dùng fallback và cần kiểm tra thiết bị thật.

Phản biện thiết kế: kính quá trong trên nền Sakura nhiều chi tiết sẽ làm giảm khả năng đọc. Giữ một lớp tint đủ tối, giảm mức khúc xạ và chỉ dùng kính cho điều khiển là lựa chọn phù hợp hơn cho website học tập. Hiệu ứng phải phục vụ nhận biết lựa chọn và điều hướng, không cạnh tranh với câu hỏi.
