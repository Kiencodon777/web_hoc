'use strict';
const INFO_QUESTIONS=[
  {
    "number": 1,
    "page": 1,
    "question": "Hệ thống truyền tin bao gồm các khối chính:",
    "options": [
      "Nguồn tin – Bộ nhớ – Bộ xử lý",
      "Nguồn tin – Kênh tin – Nhận tin",
      "Phát tin – Điều khiển – Nhận tin",
      "Nguồn tin – Thiết bị khuếch đại – Nhận tin"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nguồn phát tin → kênh truyền → nơi nhận tin.",
    "sources": [
      "comm",
      "shannon"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 2,
    "page": 1,
    "question": "Thông tin chỉ có ý nghĩa khi:",
    "options": [
      "Bên phát chưa biết",
      "Bên nhận chưa biết",
      "Bên phát và nhận đều biết",
      "Thông tin lặp lại"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Theo nghĩa giảm bất định: bên nhận thu được điều chưa biết.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 3,
    "page": 1,
    "question": "Tín hiệu là:",
    "options": [
      "Một dạng năng lượng mất mát",
      "Một đại lượng không xác định",
      "Dạng vật chất dùng để mang thông tin",
      "Dạng năng lượng dự phòng"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Tín hiệu là đại lượng vật lý mang thông tin.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 4,
    "page": 1,
    "question": "Nguồn tin nguyên thủy thường là:",
    "options": [
      "Các dãy số rời rạc",
      "Các hàm liên tục theo thời gian",
      "Các bit nhị phân",
      "Tín hiệu số"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Đề đang xét nguồn vật lý tương tự trước số hóa.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 5,
    "page": 1,
    "question": "Tín hiệu âm thanh, hình ảnh từ nguồn tin nguyên thủy thường:",
    "options": [
      "Là các hàm rời rạc",
      "Là các hàm liên tục",
      "Là tín hiệu nhị phân",
      "Là sóng vuông"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Âm thanh và hình ảnh nguyên thủy được mô hình bằng hàm liên tục.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 6,
    "page": 1,
    "question": "Tin từ nguồn liên tục gọi là:",
    "options": [
      "Tin số",
      "Tin rời rạc",
      "Tin liên tục",
      "Tin tương hỗ"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Nguồn liên tục phát tin liên tục.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 7,
    "page": 1,
    "question": "Ví dụ nguồn rời rạc là:",
    "options": [
      "Sóng âm",
      "Nhiệt độ môi trường",
      "Bảng chữ cái",
      "Ánh sáng mặt trời"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Chữ cái thuộc tập ký hiệu rời rạc.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 8,
    "page": 1,
    "question": "Kênh tin là:",
    "options": [
      "Thiết bị xử lý thông tin",
      "Môi trường lan truyền tín hiệu",
      "Bộ khuếch đại tín hiệu",
      "Nguồn tạo nhiễu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Kênh vận chuyển tín hiệu từ phát đến thu.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 9,
    "page": 2,
    "question": "Nhiễu trong hệ thống truyền tin phát sinh ở:",
    "options": [
      "Nguồn tin",
      "Kênh tin",
      "Thiết bị nhận",
      "Bộ lọc"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Trong sơ đồ rút gọn, nhiễu được đưa vào kênh.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Nhiễu thực tế còn phát sinh trong máy thu và linh kiện. B là đáp án theo mô hình kênh đơn giản, không phải vị trí duy nhất ngoài thực tế."
  },
  {
    "number": 10,
    "page": 2,
    "question": "Nơi nhận tin có nhiệm vụ:",
    "options": [
      "Tạo tín hiệu",
      "Phát hiện sai và sửa sai",
      "Khuếch đại tín hiệu",
      "Nén tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "B gần với chức năng giải mã, phát hiện và sửa lỗi.",
    "sources": [
      "block"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Máy thu còn có thể lọc và khuếch đại. Đề không liệt kê đầy đủ chuỗi chức năng; B phù hợp với ngữ cảnh giải mã chống lỗi."
  },
  {
    "number": 11,
    "page": 2,
    "question": "Hiệu suất của hệ thống truyền tin là:",
    "options": [
      "Tốc độ xử lý tín hiệu",
      "Lượng tin truyền trong một đơn vị thời gian",
      "Số lượng máy thu",
      "Mức nhiễu của kênh"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lượng tin chia thời gian là tốc độ thông tin.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Thuật ngữ chính xác cho B là tốc độ thông tin (bit/s), không phải hiệu suất không thứ nguyên."
  },
  {
    "number": 12,
    "page": 2,
    "question": "Độ chính xác trong hệ thống truyền tin thể hiện:",
    "options": [
      "Tốc độ lấy mẫu",
      "Khả năng chống nhiễu",
      "Kích thước kênh",
      "Tín hiệu đầu ra"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Chống nhiễu giúp khôi phục bản tin chính xác.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 13,
    "page": 2,
    "question": "Rời rạc hóa một nguồn tin liên tục gồm 2 bước:",
    "options": [
      "Lọc và biến đổi",
      "Mã hóa và giải mã",
      "Lấy mẫu và lượng tử hóa",
      "Tách sóng và khuếch đại"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Rời rạc theo thời gian: lấy mẫu; theo biên độ: lượng tử.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 14,
    "page": 2,
    "question": "Lấy mẫu là:",
    "options": [
      "Biến đổi tín hiệu rời rạc thành liên tục",
      "Trích giá trị tín hiệu tại các thời điểm xác định",
      "Mã hóa tín hiệu",
      "Nén tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lấy các giá trị x(nT) tại thời điểm lấy mẫu.",
    "sources": [
      "sampling"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 15,
    "page": 2,
    "question": "Định lý lấy mẫu Shannon yêu cầu tần số lấy mẫu:",
    "options": [
      "f ≥ f_max",
      "f ≥ 1,5 f_max",
      "f ≥ 2 f_max",
      "f ≥ f_max"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Với giới hạn phổ f_max, ngưỡng Nyquist là 2f_max.",
    "sources": [
      "sampling",
      "ti"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Ngưỡng ≥2f_max là cách phát biểu lý tưởng thường dùng trong đề. Thực tế chọn f_s>2f_max và lọc chống chồng phổ; đúng tại biên còn cần điều kiện phổ/pha."
  },
  {
    "number": 16,
    "page": 3,
    "question": "Tần số lấy mẫu f được tính bằng:",
    "options": [
      "f = 1/T",
      "f = T",
      "f = T²",
      "f = 2T"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Chu kỳ T giây cho tần số f=1/T Hz.",
    "sources": [
      "sampling"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 17,
    "page": 3,
    "question": "Lượng tử hóa là:",
    "options": [
      "Biến đổi tín hiệu liên tục theo thời gian",
      "Biến đổi tín hiệu liên tục theo biên độ thành mức rời rạc",
      "Lấy mẫu tín hiệu",
      "Khuếch đại tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lượng tử hóa ánh xạ biên độ vào tập mức hữu hạn.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 18,
    "page": 3,
    "question": "Mức lượng tử hóa ∆i là:",
    "options": [
      "Khoảng giữa các mức biên độ được chia",
      "Khoảng giữa các điểm thời gian",
      "Khoảng giữa hai tín hiệu",
      "Khoảng cách tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "∆ᵢ biểu diễn bước lượng tử giữa các mức lân cận.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Đề gọi “mức” nhưng ∆ᵢ chính xác hơn là bước lượng tử, khác với giá trị của một mức biên độ."
  },
  {
    "number": 19,
    "page": 3,
    "question": "Lượng tử hóa đều là khi:",
    "options": [
      "∆i khác nhau",
      "∆i bằng nhau",
      "∆i thay đổi ngẫu nhiên",
      "Không có mức lượng tử"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lượng tử đều có các bước ∆ᵢ bằng nhau.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 20,
    "page": 3,
    "question": "Khi tần số tối thiểu của tiếng nói là 4000 Hz, tần số lấy mẫu tối thiểu theo Shannon là:",
    "options": [
      "2000 Hz",
      "4000 Hz",
      "8000 Hz",
      "16000 Hz"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "Đề ghi “tần số tối thiểu” 4000 Hz nên chưa biết giới hạn phổ trên. Nếu sửa thành “tần số tối đa”, ngưỡng lấy mẫu mới là 8000 Hz (C).",
    "sources": [
      "sampling",
      "ti"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 21,
    "page": 3,
    "question": "Độ đo thông tin là:",
    "options": [
      "Cách tính độ lớn tín hiệu",
      "Cách xác định độ lớn thông tin",
      "Độ lệch chuẩn",
      "Sai số tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Độ đo lượng hóa lượng thông tin.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 22,
    "page": 3,
    "question": "Hàm độ đo thông tin có dạng:",
    "options": [
      "log(p(xᵢ))",
      "1/p(xᵢ)",
      "log(1/p(xᵢ))",
      "p(xᵢ)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "I(x)=−log p(x)=log(1/p(x)).",
    "sources": [
      "entropy"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 23,
    "page": 3,
    "question": "Khi p(xi) = 1 thì lượng tin I(xi) bằng:",
    "options": [
      "0",
      "1",
      "∞",
      "2"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "−log(1)=0.",
    "sources": [
      "entropy"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 24,
    "page": 4,
    "question": "Đơn vị đo thông tin khi cơ số là 2:",
    "options": [
      "Nat",
      "Bit",
      "Hartley",
      "Joule"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "log₂ cho đơn vị bit.",
    "sources": [
      "entropy"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 25,
    "page": 4,
    "question": "Khi cơ số là 10, đơn vị đo thông tin là:",
    "options": [
      "Nat",
      "Bit",
      "Hartley",
      "Joule"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "log₁₀ cho đơn vị hartley.",
    "sources": [
      "shannon"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 26,
    "page": 4,
    "question": "Mã hóa là quá trình:",
    "options": [
      "Nén và giải nén tín hiệu",
      "Biến đổi tương đương về mặt tin tức",
      "Lấy mẫu tín hiệu",
      "Điều chế tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Trong ngữ cảnh này, mã hóa đổi biểu diễn tin.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 27,
    "page": 4,
    "question": "Mã hóa không làm thay đổi:",
    "options": [
      "Số phần tử mạch",
      "Lượng tin",
      "Độ chính xác",
      "Mức nhiễu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Phép đổi biểu diễn khả nghịch bảo toàn lượng tin.",
    "sources": [
      "mutual"
    ],
    "topic": "Hệ thống & số hóa",
    "note": "Giả thiết phép mã hóa bảo toàn tin/khả nghịch. Nén mất dữ liệu không thỏa phát biểu này."
  },
  {
    "number": 28,
    "page": 4,
    "question": "Thông thường cơ số mã được chọn là:",
    "options": [
      "1",
      "2",
      "10",
      "e"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Mã nhị phân dùng hai ký hiệu 0 và 1.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 29,
    "page": 5,
    "question": "Lý do chọn cơ số m = 2 khi mã hóa:",
    "options": [
      "Giảm băng thông",
      "Dễ thực hiện với mạch điện tử",
      "Giảm tần số",
      "Tăng độ nhiễu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Hai trạng thái logic thuận tiện cho mạch điện tử.",
    "sources": [
      "comm"
    ],
    "topic": "Hệ thống & số hóa"
  },
  {
    "number": 30,
    "page": 5,
    "question": "Điều chế là:",
    "options": [
      "Tăng biên độ tín hiệu",
      "Chuyển thông tin thành dạng năng lượng phù hợp với môi trường truyền",
      "Nén tín hiệu",
      "Mã hóa tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Điều chế ánh xạ thông tin lên tín hiệu truyền phù hợp.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 31,
    "page": 5,
    "question": "Phương pháp điều chế biên độ viết tắt là:",
    "options": [
      "FM",
      "PM",
      "AM",
      "ASK"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "AM: amplitude modulation, điều chế biên độ.",
    "sources": [
      "cisco"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 32,
    "page": 5,
    "question": "Phương pháp điều chế đơn biên viết tắt là:",
    "options": [
      "AM",
      "SSB",
      "PM",
      "FM"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "SSB: single-sideband, điều chế đơn biên.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 33,
    "page": 5,
    "question": "Phương pháp điều chế tần số viết tắt là:",
    "options": [
      "AM",
      "PM",
      "FM",
      "ASK"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "FM: frequency modulation, điều chế tần số.",
    "sources": [
      "cisco"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 34,
    "page": 5,
    "question": "Khi tín hiệu rời rạc điều chế theo tần số gọi là:",
    "options": [
      "AM",
      "SSB",
      "FSK",
      "PSK"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "FSK thay đổi tần số theo ký hiệu rời rạc.",
    "sources": [
      "ni",
      "cisco"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 35,
    "page": 5,
    "question": "Khi tín hiệu rời rạc điều chế theo biên độ gọi là:",
    "options": [
      "ASK",
      "FSK",
      "PSK",
      "SSB"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "ASK thay đổi biên độ theo ký hiệu.",
    "sources": [
      "cisco"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 36,
    "page": 5,
    "question": "Khi tín hiệu rời rạc điều chế theo pha gọi là:",
    "options": [
      "ASK",
      "PSK",
      "FM",
      "AM"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "PSK thay đổi pha theo ký hiệu.",
    "sources": [
      "cisco"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 37,
    "page": 6,
    "question": "Giải điều chế là:",
    "options": [
      "Tăng tần số tín hiệu",
      "Thu nhận và tách thông tin từ tín hiệu nhận",
      "Khuếch đại tín hiệu",
      "Mã hóa tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Giải điều chế khôi phục thông tin từ tín hiệu mang.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 38,
    "page": 6,
    "question": "Phương pháp giải điều chế biên độ là:",
    "options": [
      "Tách sóng biên độ",
      "Tách sóng pha",
      "Tách sóng tần số",
      "Mã hóa lại tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Tách sóng biên độ phục hồi tín hiệu điều chế AM.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 39,
    "page": 6,
    "question": "Khi tín hiệu đầu vào bị nhiễu, quá trình giải điều chế phải:",
    "options": [
      "Bỏ qua tín hiệu nhiễu",
      "Tách và lọc thông tin gốc",
      "Khuếch đại toàn bộ tín hiệu",
      "Lấy mẫu lại"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Máy thu lọc nhiễu và ước lượng thông tin gốc.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế"
  },
  {
    "number": 40,
    "page": 6,
    "question": "Mục đích của điều chế trong hệ thống truyền tin:",
    "options": [
      "Tăng cường độ tín hiệu",
      "Giảm tổn hao và nhiễu khi truyền",
      "Tăng xác suất lỗi",
      "Giảm tần số lấy mẫu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "B gần nhất: điều chế giúp thích nghi với kênh truyền.",
    "sources": [
      "modulation"
    ],
    "topic": "Điều chế",
    "note": "Điều chế không tự động bảo đảm giảm mọi nhiễu hay tổn hao; hiệu quả phụ thuộc sơ đồ điều chế và kênh."
  },
  {
    "number": 41,
    "page": 6,
    "question": "Nguồn rời rạc là:",
    "options": [
      "Nguồn tạo ra tín hiệu liên tục",
      "Nguồn tạo ra các tin dưới dạng rời rạc",
      "Nguồn tạo ra tín hiệu hỗn hợp",
      "Nguồn tạo ra tín hiệu ngẫu nhiên"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nguồn rời rạc phát các ký hiệu thuộc tập rời rạc.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 42,
    "page": 6,
    "question": "Nguồn thông tin rời rạc tạo ra:",
    "options": [
      "Một tín hiệu cố định",
      "Một chuỗi các biến ngẫu nhiên rời rạc",
      "Một chuỗi hàm liên tục",
      "Một tín hiệu tần số cao"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Mô hình nguồn ngẫu nhiên rời rạc là dãy biến ngẫu nhiên.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 43,
    "page": 6,
    "question": "Nguồn rời rạc không nhớ là:",
    "options": [
      "Nguồn có tín hiệu phụ thuộc vào tín hiệu trước đó",
      "Nguồn mà xác suất xuất hiện của một ký hiệu độc lập với ký hiệu trước",
      "Nguồn có xác suất thay đổi",
      "Nguồn có nhớ"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nguồn không nhớ có các ký hiệu độc lập.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 44,
    "page": 7,
    "question": "Nguồn dừng là:",
    "options": [
      "Nguồn mà xác suất xuất hiện thay đổi theo thời gian",
      "Nguồn mà xác suất xuất hiện các ký hiệu không phụ thuộc gốc thời gian",
      "Nguồn có nhớ",
      "Nguồn liên tục"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nguồn dừng có phân bố hữu hạn chiều bất biến khi dịch thời gian.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 45,
    "page": 7,
    "question": "Nguồn có tốc độ thông tin điều khiển được là:",
    "options": [
      "Tốc độ phát cố định",
      "Có thể điều khiển tốc độ phát tin từ bên ngoài",
      "Không thể thay đổi tốc độ",
      "Phát ngẫu nhiên"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Tốc độ điều khiển được có thể thay đổi từ bên ngoài.",
    "sources": [
      "comm"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 46,
    "page": 7,
    "question": "Nguồn có tốc độ thông tin không điều khiển được là:",
    "options": [
      "Tốc độ phát tin ngẫu nhiên",
      "Tốc độ cố định, không điều khiển được",
      "Không phát tin",
      "Phát tin rời rạc không giới hạn"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "B phù hợp nhất với cách phân loại giản lược trong đề.",
    "sources": [
      "comm"
    ],
    "topic": "Thông tin & entropy",
    "note": "Không điều khiển được không nhất thiết có nghĩa tốc độ luôn cố định. B là cách diễn đạt gần nhất trong các lựa chọn."
  },
  {
    "number": 47,
    "page": 7,
    "question": "Lượng tin riêng của một ký hiệu được xác định bởi:",
    "options": [
      "I(xᵢ) = log p(xᵢ)",
      "I(xᵢ) = −log p(xᵢ) = log(1/p(xᵢ))",
      "I(xᵢ) = p(xᵢ)",
      "I(xᵢ) = 1 − p(xᵢ)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "I(x)=−log p(x).",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 48,
    "page": 7,
    "question": "Khi xác suất xuất hiện của ký hiệu càng nhỏ, lượng tin riêng:",
    "options": [
      "Giảm",
      "Tăng",
      "Không đổi",
      "Bằng 0"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "p nhỏ hơn làm −log p lớn hơn.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 49,
    "page": 7,
    "question": "Khi cơ số là e, đơn vị đo lượng tin là:",
    "options": [
      "Bit",
      "Nat",
      "Hartley",
      "Byte"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Logarit tự nhiên cho đơn vị nat.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 50,
    "page": 7,
    "question": "Tổng lượng tin của một bản tin n ký hiệu với m ký hiệu đẳng xác suất:",
    "options": [
      "I(x)=m.logn",
      "I(x)=n.logm",
      "I(x)=n+m",
      "I(x)=n/m"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nếu các ký hiệu độc lập, p(bản tin)=m⁻ⁿ; I=n log m.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy",
    "note": "Cần các ký hiệu độc lập (hoặc toàn bộ mⁿ bản tin đồng xác suất). Chỉ các phân bố biên đều chưa đủ."
  },
  {
    "number": 51,
    "page": 7,
    "question": "Lượng tin tương hỗ giữa hai tin xi và yj biểu thị:",
    "options": [
      "Phần tin bị nhiễu",
      "Phần tin của xi truyền được sang yj",
      "Phần tin không truyền được",
      "Phần tin bị mất"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lượng tin tương hỗ đo thông tin về x thu được từ y.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 52,
    "page": 8,
    "question": "Khi xác suất chuyển p(yj|xi) = 1 thì:",
    "options": [
      "I(xi,yj) = 0",
      "I(xi) = I(yj)",
      "I(xi,yj) = I(xi) - I(yj)",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "D"
    ],
    "explanation": "p(y|x)=1 chưa suy ra I(x)=I(y). Ví dụ Y luôn cố định: I(y)=0 dù I(x)>0. Không đủ dữ kiện cho các quan hệ A–C.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy",
    "note": "D được hiểu là “chưa xác định được quan hệ từ giả thiết”, không phải lượng tin không tồn tại. Muốn I(x)=I(y) cần thêm điều kiện ánh xạ một-một phù hợp."
  },
  {
    "number": 53,
    "page": 8,
    "question": "Khi xác suất chuyển p(yj|xi) < 1 thì:",
    "options": [
      "Không có lượng tin tương hỗ",
      "Lượng tin tương hỗ < I(xi)",
      "Lượng tin tương hỗ tăng",
      "Bằng I(yj)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "p(y|x)<1 chưa đủ suy ra mất tin về x. Phản ví dụ: X có hai giá trị đồng xác suất; mỗi X cho hai Y riêng biệt với xác suất 1/2. Y vẫn xác định X, nên i(x;y)=I(x)=1 bit.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy",
    "note": "B chỉ có thể suy ra với điều kiện thích hợp về p(x|y)<1; không được thay bằng p(y|x)<1."
  },
  {
    "number": 54,
    "page": 8,
    "question": "Lượng tin điều kiện I(xi|yj) thể hiện:",
    "options": [
      "Lượng tin mất mát khi truyền",
      "Tổng lượng tin",
      "Xác suất ngẫu nhiên",
      "Mức tín hiệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "I(x|y)=−log p(x|y): phần bất định về x còn lại.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy",
    "note": "Lượng tin điều kiện cho từng cặp khác với entropy có điều kiện là giá trị trung bình."
  },
  {
    "number": 55,
    "page": 8,
    "question": "Xác suất liên kết P(xi,yj) được xác định bằng:",
    "options": [
      "p(xi) × p(yj)",
      "p(xi) + p(yj)",
      "p(xi) × p(yj|xi)",
      "p(yj) × p(xi|yj)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C",
      "D"
    ],
    "explanation": "C và D đều đúng theo quy tắc nhân xác suất: p(x,y)=p(x)p(y|x)=p(y)p(x|y). A cần thêm điều kiện độc lập.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 56,
    "page": 8,
    "question": "Khi xi và yj độc lập thống kê thì lượng tin tương hỗ:",
    "options": [
      "I(xi,yj) = I(xi)",
      "I(xi,yj) = 0",
      "I(xi,yj) = I(yj)",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Độc lập: p(x,y)=p(x)p(y), nên i(x;y)=log 1=0.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 57,
    "page": 8,
    "question": "Tính chất 1: I(xi) luôn:",
    "options": [
      "Âm",
      "Không âm",
      "Bằng 0",
      "Dương vô hạn"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "0<p≤1 suy ra −log p≥0.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 58,
    "page": 8,
    "question": "Tính chất 2: I(xi) ≥ I(xi,yj) nghĩa là:",
    "options": [
      "Lượng tin ban đầu lớn hơn hoặc bằng phần truyền đi",
      "Lượng tin sau truyền lớn hơn",
      "Hai lượng tin bằng nhau",
      "Lượng tin điều kiện bằng 0"
    ],
    "labels": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answers": [
      "A"
    ],
    "explanation": "i(x;y)=I(x)−I(x|y)≤I(x), vì I(x|y)≥0.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 59,
    "page": 9,
    "question": "Tính chất 3: I(xi,yj) = ?",
    "options": [
      "I(xi) + I(yj) + I(xi,yj)",
      "I(xi) - I(yj)",
      "I(xi) + I(yj) - I(xi,yj)",
      "I(xi,yj) - I(xi)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "Đề dùng cùng I(xᵢ,yⱼ) cho hai đại lượng nên công thức tự tham chiếu. Phải phân biệt J(x,y)=−log p(x,y) và i(x;y)=I(x)+I(y)−J(x,y). C chỉ đúng nếu đổi ký hiệu vế trái thành J và hạng cuối thành i.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 60,
    "page": 9,
    "question": "Lượng tin trung bình của một nguồn là:",
    "options": [
      "Lượng tin lớn nhất của một ký hiệu",
      "Lượng tin riêng trung bình của tất cả các ký hiệu",
      "Lượng tin nhỏ nhất",
      "Độ nhiễu trung bình"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Entropy là kỳ vọng của lượng tin riêng.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 61,
    "page": 9,
    "question": "Công thức tính lượng tin trung bình:",
    "options": [
      "H(X) = Σ p(xᵢ) log(1/p(xᵢ))",
      "H(X) = Σ log p(xᵢ)",
      "H(X) = (1/n) Σ p(xᵢ)",
      "H(X) = Σ p(xᵢ)²"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "H(X)=Σ p(xᵢ)log(1/p(xᵢ)).",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 62,
    "page": 9,
    "question": "Khi xác suất của một ký hiệu bằng 1, entropi H(X) bằng:",
    "options": [
      "1",
      "0",
      "∞",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Nguồn chắc chắn: H=−1 log 1=0.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 63,
    "page": 9,
    "question": "Entropi đạt cực đại khi:",
    "options": [
      "Các xác suất bằng nhau",
      "Một ký hiệu có xác suất 1",
      "Xác suất ngẫu nhiên",
      "Tín hiệu bị nhiễu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Với m ký hiệu: H≤log m, bằng nhau khi pᵢ=1/m. Chọn B cho H=0, không phải cực đại.",
    "sources": [
      "entropy",
      "shannon"
    ],
    "topic": "Thông tin & entropy",
    "note": "PDF in sẵn “Đáp án B” tại câu 63, nhưng đó là lỗi. Đã sửa thành A theo bất đẳng thức entropy và trường hợp phân bố đều."
  },
  {
    "number": 64,
    "page": 9,
    "question": "Khi entropi lớn thì:",
    "options": [
      "Thông tin ít bất định",
      "Thông tin nhiều bất định",
      "Không có tin tức",
      "Tốc độ truyền thấp"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Entropy lớn biểu thị độ bất định trung bình lớn.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 65,
    "page": 9,
    "question": "Entropi của nguồn là:",
    "options": [
      "Độ bất định trung bình",
      "Lượng tin tối tHIEU",
      "Lượng tin bị nhiễu",
      "Tổng lượng tin"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Entropy đo độ bất định trung bình.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 66,
    "page": 10,
    "question": "Entropi có điều kiện H(X|Y) thể hiện:",
    "options": [
      "Độ bất định còn lại khi biết Y",
      "Tổng entropi",
      "Sai số ngẫu nhiên",
      "Xác suất trung bình"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "H(X|Y) đo phần bất định về X còn lại sau khi biết Y.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 67,
    "page": 10,
    "question": "Khi X và Y độc lập, H(X|Y) =",
    "options": [
      "0",
      "H(X)",
      "H(Y)",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Độc lập khiến biết Y không giảm bất định về X.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 68,
    "page": 10,
    "question": "Mối quan hệ cơ bản:",
    "options": [
      "H(X,Y)=H(X)−H(Y)",
      "H(X,Y) = H(X) + H(Y|X)",
      "H(X,Y) = H(Y) - H(X|Y)",
      "H(X,Y)=H(X∣Y)+H(Y∣X)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Quy tắc dây chuyền: H(X,Y)=H(X)+H(Y|X).",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 69,
    "page": 10,
    "question": "H(X|Y) còn được gọi là:",
    "options": [
      "Sai số trung bình",
      "Lượng tin tương hỗ",
      "Tín hiệu",
      "Entropi cực đại"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "H(X|Y) là entropy có điều kiện, hay độ nhập nhằng (equivocation). “Sai số trung bình” không phải tên chính xác; entropy khác xác suất lỗi. Không có phương án phù hợp.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 70,
    "page": 10,
    "question": "H(Y|X) được gọi là:",
    "options": [
      "Độ bất định đầu vào",
      "Độ bất định đầu ra khi đã biết đầu vào",
      "Tổng lượng tin",
      "Sai số hệ thống"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "H(Y|X): bất định đầu ra khi đã biết đầu vào.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 71,
    "page": 10,
    "question": "Lượng tin tương hỗ trung bình được tính:",
    "options": [
      "I(X,Y)=H(X)+H(Y)",
      "I(X,Y) = H(X) - H(X|Y)",
      "I(X,Y) = H(Y) + H(X|Y)",
      "I(X,Y) = H(X|Y) - H(Y)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "I(X;Y)=H(X)−H(X|Y).",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 72,
    "page": 10,
    "question": "Khi X và Y độc lập, lượng tin tương hỗ trung bình:",
    "options": [
      "Bằng 0",
      "Bằng H(X)",
      "Bằng H(Y)",
      "Bằng tổng hai entropi"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Độc lập: I(X;Y)=0.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 73,
    "page": 10,
    "question": "I(X,Y) càng lớn thì:",
    "options": [
      "Thông tin truyền càng ít",
      "Thông tin truyền càng nhiều",
      "H(X|Y) càng lớn",
      "Nhiễu càng lớn"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Với nguồn cố định, I lớn nghĩa là giảm nhiều bất định hơn.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 74,
    "page": 11,
    "question": "Quan hệ cơ bản:",
    "options": [
      "I(X,Y)=H(X,Y)−H(X)",
      "I(X,Y)=H(X)+H(Y)−H(X,Y)",
      "I(X,Y) = H(Y|X) - H(X)",
      "I(X,Y)=H(X,Y)+H(Y)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "I(X;Y)=H(X)+H(Y)−H(X,Y).",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 75,
    "page": 11,
    "question": "Khi H(X|Y) = 0 thì:",
    "options": [
      "I(X,Y) = H(X)",
      "I(X,Y) = 0",
      "I(X,Y) = H(Y)",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Thay H(X|Y)=0 vào I=H(X)−H(X|Y).",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 76,
    "page": 11,
    "question": "Khi lượng tin tương hỗ bằng 0:",
    "options": [
      "X và Y phụ thuộc thống kê",
      "X và Y độc lập thống kê",
      "Xác suất chuyển bằng 1",
      "Entropi bằng 0"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Với biến rời rạc, I(X;Y)=0 khi và chỉ khi độc lập.",
    "sources": [
      "mutual"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 77,
    "page": 11,
    "question": "Chọn câu sai:",
    "options": [
      "Tin luôn được biểu diễn dưới dạng số",
      "Tấm ảnh, bản nhạc, bức thư...không phải là các tin",
      "Tin là một ánh xạ liên tục đến người nhận",
      "Tin là dạng vật chất để biểu diễn hoặc thể hiện thông tin"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A",
      "B",
      "C"
    ],
    "explanation": "A sai vì tin có thể tương tự; B sai vì ảnh, nhạc, thư đều mang tin; C không phải định nghĩa tổng quát của tin. Đề không có một phương án sai duy nhất.",
    "sources": [
      "comm",
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 78,
    "page": 11,
    "question": "Để biến đổi một tín hiệu liên tục theo biên độ và theo thời gian thành tín hiệu số, chúng ta cần thực hiện quá trình nào sau đây:",
    "options": [
      "Rời rạc hóa theo trục thời gian và lượng tử hóa theo trục biên độ",
      "Mã hóa dữ liệu.",
      "Lượng tử hóa theo trục thời gian và rời rạc hóa theo trục biên độ",
      "Giải mã dữ liệu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Lấy mẫu theo thời gian và lượng tử theo biên độ.",
    "sources": [
      "comm"
    ],
    "topic": "Thông tin & entropy",
    "note": "Để lưu/truyền thành chuỗi bit còn cần mã hóa nhị phân các mức lượng tử; A mô tả hai bước rời rạc hóa."
  },
  {
    "number": 79,
    "page": 11,
    "question": "Khái niệm lượng tin được định nghĩa dựa trên:",
    "options": [
      "Năng lượng của tín hiệu mang tin",
      "Độ bất định của tin",
      "Ý nghĩa của tin",
      "Năng lượng của tín hiệu mang tin và ý nghĩa của tin"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Lượng tin dựa trên bất định, không dựa năng lượng hay ý nghĩa.",
    "sources": [
      "shannon"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 80,
    "page": 11,
    "question": "Chọn câu sai trong các câu sau:",
    "options": [
      "Độ bất định sẽ trở thành thông tin khi nó bị thủ tiêu",
      "Độ bất định chính là thông tin",
      "Lượng thông tin = độ bất định tiên nghiệm + độ bất định hậu nghiệm",
      "Lượng thông tin = độ bất định tiên nghiệm - độ bất định hậu nghiệm"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "C sai rõ ràng: lượng tin là phần giảm bất định, không phải tổng. B cũng diễn đạt nhập nhằng giữa bất định trước nhận tin và thông tin thu được. Nếu buộc chọn một theo ý đề, thường là C; cần giảng viên xác nhận.",
    "sources": [
      "shannon",
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 81,
    "page": 12,
    "question": "Tốc độ lập mã của mã chập được xác định bằng",
    "options": [
      "n/k",
      "k/n",
      "K/n",
      "m/k"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "k bit vào sinh n bit ra: tỷ lệ mã R=k/n.",
    "sources": [
      "conv"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 82,
    "page": 12,
    "question": "Trong mã chập, bộ mã hóa thường được mô tả bằng",
    "options": [
      "Ma trận kiểm tra",
      "Sơ đồ khối",
      "Sơ đồ thanh ghi dịch (shift register)",
      "Cây mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Thanh ghi dịch mô tả bộ nhớ của bộ mã chập.",
    "sources": [
      "conv"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 83,
    "page": 12,
    "question": "Mã chập khác với mã khối ở chỗ",
    "options": [
      "Có thể sửa lỗi tốt hơn",
      "Có bộ nhớ",
      "Không cần thức sinh",
      "Không có ma trận sinh"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Đầu ra mã chập phụ thuộc cả dữ liệu và trạng thái nhớ.",
    "sources": [
      "conv",
      "block"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 84,
    "page": 12,
    "question": "Mã chập được ký hiệu bởi bộ ba (n, k, K). Trong đó K là",
    "options": [
      "Số bit đầu ra",
      "Số bit đầu vào",
      "Độ dài ràng buộc",
      "Tỷ lệ mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "K là độ dài ràng buộc.",
    "sources": [
      "conv"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 85,
    "page": 12,
    "question": "Khi đầu vào là “000…0”, đầu ra của mã chập là",
    "options": [
      "Ngẫu nhiên",
      "000…0",
      "111…1",
      "Phụ thuộc vào thức"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Mã chập tuyến tính, trạng thái đầu bằng 0: đầu vào 0 cho đầu ra 0.",
    "sources": [
      "conv"
    ],
    "topic": "Mã chống lỗi",
    "note": "Giả định bộ mã chập tuyến tính khởi tạo toàn 0. Nếu bộ nhớ đầu khác 0, có thể xuất hiện đầu ra khác 0 lúc đầu."
  },
  {
    "number": 86,
    "page": 12,
    "question": "Một yêu cầu quan trọng để đảm bảo an toàn thông tin lâu dài trong hệ mã là:",
    "options": [
      "Thuật toán mã hóa phải thay đổi thường xuyên",
      "Khóa phải đủ dài và được giữ bí mật tuyệt đối",
      "Tốc độ mã hóa nhanh hơn tốc độ giải mã",
      "Thông điệp phải được gửi đi nhiều lần"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Khóa đủ mạnh và bí mật là yêu cầu cần thiết.",
    "sources": [
      "key"
    ],
    "topic": "Mật mã & an toàn",
    "note": "Khóa dài không đủ nếu thuật toán yếu, khóa dễ đoán hoặc bị lộ. Không dùng Caesar để bảo vệ dữ liệu thật."
  },
  {
    "number": 87,
    "page": 12,
    "question": "Mã Caesar là loại mã hóa thuộc loại nào?",
    "options": [
      "Mã hóa khóa đối xứng",
      "Mã hóa khóa công khai",
      "Mã khối hiện đại",
      "Mã dòng"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Caesar dùng chung khóa dịch để mã hóa và giải mã.",
    "sources": [
      "symmetric"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 88,
    "page": 12,
    "question": "Mã Caesar thực hiện phép dịch chuyển như thế nào?",
    "options": [
      "Dịch vị trí ký tự theo bảng chữ cái",
      "Đổi chỗ ngẫu nhiên ký tự",
      "Hoán vị nhị phân",
      "Dùng hàm băm"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Mỗi chữ được dịch k vị trí, có quay vòng.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 89,
    "page": 13,
    "question": "Nếu ký tự ‘A’ được mã hóa thành ‘D’ trong mã Caesar, khóa mã là bao nhiêu",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "A=0, D=3; k=3−0=3.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 90,
    "page": 13,
    "question": "Trong mã Caesar Với khóa k=3, mã hóa “HELLO” → ?",
    "options": [
      "IFMMP",
      "KHOOR",
      "JGNNQ",
      "MIPPS"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "H→K, E→H, L→O, L→O, O→R: KHOOR.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 91,
    "page": 13,
    "question": "Giải mã chuỗi “KHOOR” với khóa k=3 Sử dụng mã Caesar",
    "options": [
      "HELLO",
      "JGNNQ",
      "IFMMP",
      "GDKKN"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Dịch KHOOR lùi 3 vị trí được HELLO.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 92,
    "page": 13,
    "question": "Công thức tổng quát của mã Caesar là",
    "options": [
      "C=(P+k)mod 26",
      "C=(P−k)mod 26",
      "P=(C+k)mod 26",
      "P=(P+C)mod k"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Quy ước A=0,…,Z=25: C=(P+k) mod 26.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 93,
    "page": 13,
    "question": "Ký hiệu k trong mã Caesar thường biểu thị",
    "options": [
      "Số ký tự trong bản tin",
      "Số lần lặp lại",
      "Khóa dịch chuyển",
      "Giá trị ASCII"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "k là số vị trí dịch, tức khóa.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 94,
    "page": 13,
    "question": "Nhược điểm chính của mã Caesar là gì?",
    "options": [
      "Quá phức tạp",
      "Không có khóa",
      "Dễ bị phá bằng thử toàn bộ khóa",
      "Không thể giải mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Chỉ 26 khóa kể cả k=0; có thể vét cạn.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 95,
    "page": 13,
    "question": "Trong giải mã của mã caesar, công thức là",
    "options": [
      "P=(C−k)mod 26",
      "P=(C+k)mod 26",
      "C=(P+k)mod 26",
      "P=(P+k)mod 26"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Phép ngược của cộng k là trừ k modulo 26.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 96,
    "page": 13,
    "question": "Nếu “Z” được mã hóa với khóa k=2 sử dụng mã caesar kết quả mã hóa là",
    "options": [
      "B",
      "A",
      "C",
      "D"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Z=25; (25+2) mod 26=1=B.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 97,
    "page": 14,
    "question": "Khi mã hóa chữ “C” với khóa k=10 sử dụng mã caesar kết quả mã hóa là",
    "options": [
      "M",
      "L",
      "N",
      "O"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "C=2; (2+10) mod 26=12=M.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 98,
    "page": 14,
    "question": "Giải mã ký tự “Q” khi k=5 sử dụng mã caesar",
    "options": [
      "L",
      "M",
      "R",
      "K"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Q=16; (16−5) mod 26=11=L.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 99,
    "page": 14,
    "question": "Nếu bản rõ là “ABC” sử dụng mã caesar và bản mã là “DEF”, thì khóa là",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "A→D, B→E, C→F đều dịch 3.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 100,
    "page": 14,
    "question": "Giải mã ký tự “F” khi k=3 sử dụng mã Caesar.",
    "options": [
      "I",
      "C",
      "D",
      "G"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "F=5; (5−3) mod 26=2=C.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 101,
    "page": 14,
    "question": "Với khóa k=7 sử dụng mã caesar ký tự 'T 'được mã hóa thành",
    "options": [
      "A",
      "B",
      "U",
      "A"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A",
      "D"
    ],
    "explanation": "T=19; (19+7) mod 26=0=A. Hai lựa chọn A và D trùng nội dung “A”; chấp nhận cả hai.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 102,
    "page": 14,
    "question": "Nếu dùng mã Caesar cho chữ thường (a–z), thì phép toán mod dùng là",
    "options": [
      "mod 25",
      "mod 26",
      "mod 27",
      "mod 52"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Bảng a–z có 26 ký tự nên dùng modulo 26.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 103,
    "page": 14,
    "question": "Nếu mã Caesar sử dụng k=0",
    "options": [
      "Giống bản rõ",
      "Là chuỗi rỗng",
      "Mất thông tin",
      "Xáo trộn ngẫu nhiên"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "C=(P+0) mod 26=P.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 104,
    "page": 15,
    "question": "Mã Caesar không đảm bảo tính chất nào sau đây?",
    "options": [
      "Bảo mật",
      "Tính nghịch đảo",
      "Dễ thực hiện",
      "Dễ giải mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Caesar khả nghịch, dễ làm nhưng dễ phá khóa.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 105,
    "page": 15,
    "question": "Nếu chữ “A” mã hóa thành “N” (k=13), thì “N” mã hóa thành gì?",
    "options": [
      "A",
      "M",
      "Z",
      "O"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "N=13; (13+13) mod 26=0=A.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 106,
    "page": 15,
    "question": "Trong ma trận sinh chính tắc (systematic generator matrix) có dạng:",
    "options": [
      "G = [P | Iₖ]",
      "G = [Iₖ | P]",
      "G = [Iₙ | P]",
      "G = [Iₙ | P]"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A",
      "B"
    ],
    "explanation": "Cả [Iₖ|P] và [P|Iₖ] đều là dạng hệ thống, tùy thứ tự tọa độ. Theo quy ước các câu sau, thường dùng B.",
    "sources": [
      "gen"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 107,
    "page": 15,
    "question": "Với mã khối tuyến tính (7,4), số hàng của ma trận sinh bằng",
    "options": [
      "3",
      "4",
      "7",
      "11"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "G có k hàng; mã (7,4) cho 4 hàng.",
    "sources": [
      "gen"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 108,
    "page": 15,
    "question": "Ma trận sinh của mã (n,k) có vai trò:",
    "options": [
      "Dùng để giải mã tín hiệu",
      "Dùng để mã hóa từ thông tin thành từ mã",
      "Dùng để phát hiện lỗi",
      "Không có chức năng trong thực tế"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Mã hóa vector thông tin u thành c=uG.",
    "sources": [
      "linear"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 109,
    "page": 15,
    "question": "Cho mã (7,3) có ma trận sinh chính tắc dạng, số cột của ma trận P là",
    "options": [
      "3",
      "4",
      "7",
      "11"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "P có n−k=7−3=4 cột.",
    "sources": [
      "gen"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 110,
    "page": 15,
    "question": "Cho mã (7,4) có ma trận sinh chính tắc dạng G=[I4 |P] số cột của ma trận P là",
    "options": [
      "3",
      "4",
      "7",
      "11"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "P có 7−4=3 cột.",
    "sources": [
      "gen"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 111,
    "page": 15,
    "question": "Trong ma trận sinh chính tắc G=[Ik |P] kích thước của P là:",
    "options": [
      "k×k",
      "k×(n−k)",
      "(n−k)×k",
      "(n−k)×(n−k)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "G có k×n, Iₖ có k×k; P có k×(n−k).",
    "sources": [
      "gen"
    ],
    "topic": "Mã chống lỗi"
  },
  {
    "number": 112,
    "page": 16,
    "question": "Trong một hệ mật mã an toàn, điều kiện giữa khóa mã hóa (E) và khóa giải mã (D) phải:",
    "options": [
      "Giống hệt nhau",
      "Có thể suy ra trực tiếp từ nhau",
      "Có quan hệ toán học xác định nhưng khó suy ngược",
      "Không có liên hệ nào"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "Chưa nêu hệ đối xứng hay khóa công khai. Đối xứng có thể dùng cùng khóa (A); khóa công khai đòi hỏi khó suy khóa bí mật từ khóa công khai (gần C). Không có kết luận duy nhất.",
    "sources": [
      "symmetric",
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 113,
    "page": 16,
    "question": "Trong hệ mật mã, ký hiệu P biểu thị cho đại lượng nào?",
    "options": [
      "Bản mã",
      "Khóa",
      "Bản rõ",
      "Hàm mã hóa"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "P: plaintext, bản rõ.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 114,
    "page": 16,
    "question": "Trong hệ mật mã, C=EK(P) có nghĩa là",
    "options": [
      "Bản mã được giải mã bằng khóa K",
      "Bản rõ được mã hóa bằng khóa K",
      "Khóa được tạo ra từ bản rõ",
      "Bản rõ và bản mã giống nhau"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "E_K áp dụng lên P tạo bản mã C.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 115,
    "page": 16,
    "question": "Phép giải mã trong hệ mật mã được biểu diễn bằng công thức:",
    "options": [
      "C=EK(P)",
      "P=DK(C)",
      "P=EK(C)",
      "C=DK(P)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "D_K áp dụng lên C khôi phục P.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 116,
    "page": 16,
    "question": "Trong hệ mật mã đối xứng, điều nào sau đây là đúng?",
    "options": [
      "Khóa mã hóa và giải mã khác nhau",
      "Khóa mã hóa và giải mã giống nhau",
      "Không cần dùng khóa",
      "Khóa được công khai"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Hệ đối xứng dùng cùng khóa bí mật theo mô hình thông dụng.",
    "sources": [
      "symmetric"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 117,
    "page": 16,
    "question": "Ký hiệu E trong hệ mật mã có nghĩa là gì?",
    "options": [
      "Hàm mã hóa",
      "Hàm giải mã",
      "Bản rõ",
      "Bản mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "E là phép mã hóa (encryption).",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 118,
    "page": 16,
    "question": "Trong hệ mật mã, khóa K có vai trò gì?",
    "options": [
      "Xác định phép mã hóa và giải mã",
      "Là bản rõ cần truyền",
      "Là kết quả mã hóa",
      "Là thuật toán mã hóa"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Khóa chọn phép biến đổi trong họ thuật toán.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 119,
    "page": 17,
    "question": "Trong mô hình mã hóa tổng quát, đầu ra của hàm mã hóa là",
    "options": [
      "Khóa",
      "Bản rõ",
      "Bản mã",
      "Hàm giải mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Đầu ra mã hóa là ciphertext, bản mã.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 120,
    "page": 17,
    "question": "Trong mã hóa Caesar, nếu P=A và khóa K=3, thì C là gì (theo bảng chữ cái Anh)?",
    "options": [
      "C",
      "D",
      "F",
      "G"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "A=0; (0+3) mod 26=3=D.",
    "sources": [
      "caesar"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 121,
    "page": 17,
    "question": "Tính bí mật của hệ thống mã mật được HIEU là gì?",
    "options": [
      "Người nhận có thể đọc được bản rõ.",
      "Kẻ tấn công không thể tìm ra bản rõ từ bản mã nếu không có khóa.",
      "Tất cả mọi người đều biết khóa mã hóa.",
      "Hệ thống hoạt động nhanh và hiệu quả."
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "B là ý mô tả bảo mật trong các lựa chọn.",
    "sources": [
      "confidentiality"
    ],
    "topic": "Mật mã & an toàn",
    "note": "Mô tả B là mục tiêu bảo mật. Bảo mật tính toán phụ thuộc năng lực đối thủ, thuật toán và giả thiết; không đồng nghĩa bí mật hoàn hảo."
  },
  {
    "number": 122,
    "page": 17,
    "question": "Một hệ thống mã mật được coi là hoàn toàn bí mật (perfect secrecy) khi nào?",
    "options": [
      "Khi độ dài khóa bằng độ dài bản mã.",
      "Khi bản mã không chứa thông tin nào về bản rõ.",
      "Khi không ai có thể giải mã bằng khóa đúng.",
      "Khi bản rõ và bản mã giống nhau."
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Bí mật hoàn hảo: quan sát bản mã không cung cấp tin về bản rõ.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 123,
    "page": 17,
    "question": "Trong hệ mật mã có tính bí mật tuyệt đối, mối quan hệ giữa bản rõ PPP và bản mã CCC là",
    "options": [
      "P xác định hoàn toàn C",
      "C hoàn toàn độc lập với P",
      "P=C",
      "C chứa toàn bộ thông tin về P"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Bí mật hoàn hảo tương ứng bản rõ và bản mã độc lập.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 124,
    "page": 17,
    "question": "Hệ mã nào sau đây đạt tính bí mật tuyệt đối theo lý thuyết Shannon?",
    "options": [
      "Mã dịch Caesar",
      "Mã XOR với khóa ngắn lặp lại",
      "Mã one-time pad (OTP)",
      "Mã Affine"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "One-time pad đạt bí mật hoàn hảo với khóa ngẫu nhiên đều, độc lập, dài bằng bản tin và chỉ dùng một lần.",
    "sources": [
      "hac"
    ],
    "topic": "Mật mã & an toàn",
    "note": "OTP ở câu này là one-time pad, khác mã đăng nhập one-time password của website."
  },
  {
    "number": 125,
    "page": 17,
    "question": "Để đảm bảo tính bí mật trong thực tế, điều nào sau đây là quan trọng nhất?",
    "options": [
      "Giữ bí mật thuật toán mã hóa.",
      "Giữ bí mật khóa mã hóa.",
      "Tăng kích thước bản rõ.",
      "Sử dụng cùng một khóa cho mọi thông điệp."
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "An toàn phải dựa vào giữ bí mật khóa.",
    "sources": [
      "key"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 126,
    "page": 18,
    "question": "Yếu tố nào dưới đây ảnh hưởng trực tiếp nhất đến tính bí mật của hệ thống mã mật?",
    "options": [
      "Độ dài và độ phức tạp của khóa mã hóa",
      "Tốc độ mã hóa của hệ thống",
      "Số lượng người dùng trong mạng",
      "Dung lượng bộ nhớ máy tính"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Khóa dài và khó đoán chống tìm kiếm khóa hiệu quả hơn.",
    "sources": [
      "key"
    ],
    "topic": "Mật mã & an toàn",
    "note": "Còn phụ thuộc thuật toán, nguồn ngẫu nhiên, quản lý khóa và triển khai; độ dài đơn thuần không bảo đảm an toàn."
  },
  {
    "number": 127,
    "page": 18,
    "question": "Tính ngẫu nhiên của khóa ảnh hưởng đến tính bí mật như thế nào?",
    "options": [
      "Không ảnh hưởng",
      "Càng ngẫu nhiên thì càng khó đoán → bí mật cao hơn",
      "Ngẫu nhiên làm hệ khó giải mã hợp pháp",
      "Chỉ ảnh hưởng đến tốc độ, không ảnh hưởng bảo mật"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Khóa khó dự đoán làm giảm khả năng đoán trúng.",
    "sources": [
      "key"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 128,
    "page": 18,
    "question": "Trong hệ thống mã hóa, yếu tố quản lý và phân phối khóa ảnh hưởng đến tính bí mật vì:",
    "options": [
      "Khóa bị lộ trong quá trình truyền có thể khiến toàn bộ hệ thống bị tấn công",
      "Quản lý khóa chỉ cần thiết trong giải mã",
      "Phân phối khóa không liên quan đến an toàn",
      "Mỗi người dùng có thể tự tạo khóa riêng"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Lộ khóa có thể làm mất bí mật các dữ liệu liên quan.",
    "sources": [
      "key"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 129,
    "page": 18,
    "question": "Khi cùng một khóa được dùng để mã hóa nhiều thông điệp khác nhau, điều gì xảy ra với tính bí mật?",
    "options": [
      "Tăng vì tiết kiệm tài nguyên",
      "Không đổi",
      "Giảm vì dễ bị phân tích thống kê và suy ra khóa",
      "Không ảnh hưởng nếu thông điệp khác nhau"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "Phụ thuộc thuật toán và cách dùng. Tái dùng khóa one-time pad làm lộ quan hệ hai bản rõ; AES-GCM cho phép nhiều bản tin trong giới hạn với IV không trùng. C chỉ phù hợp ngữ cảnh mã cổ điển/OTP, không đúng cho mọi hệ.",
    "sources": [
      "hac",
      "gcm"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 130,
    "page": 18,
    "question": "Độ không chắc chắn của một nguồn tin thể hiện điều gì?",
    "options": [
      "Mức độ sai lệch của thông tin truyền đi",
      "Mức độ ngẫu nhiên, khó dự đoán của các ký hiệu phát ra từ nguồn",
      "Mức độ lặp lại của tín hiệu",
      "Tốc độ truyền tin"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Không chắc chắn thể hiện mức khó dự đoán ký hiệu.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 131,
    "page": 18,
    "question": "Trong lý thuyết thông tin, đại lượng nào dùng để đo độ không chắc chắn của nguồn tin?",
    "options": [
      "Entropy (H)",
      "Nhiễu (Noise)",
      "Công suất tín hiệu (S)",
      "Xác suất lỗi (Pe)"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "H là độ đo entropy của nguồn.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 132,
    "page": 18,
    "question": "Nếu một nguồn tin chỉ phát ra một ký hiệu duy nhất với xác suất 1, thì độ không chắc chắn của nó là:",
    "options": [
      "Cực đại",
      "Bằng 1 bit",
      "Bằng 0",
      "Không xác định"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "H=−1 log₂1=0 bit.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 133,
    "page": 19,
    "question": "Độ không chắc chắn đạt giá trị cực đại khi nào?",
    "options": [
      "Khi các xác suất không đều nhau",
      "Khi một ký hiệu có xác suất gần 1",
      "Khi tất cả các ký hiệu có xác suất bằng nhau",
      "Khi chỉ có một ký hiệu duy nhất"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Với bảng chữ cố định, phân bố đều cho H lớn nhất.",
    "sources": [
      "entropy"
    ],
    "topic": "Thông tin & entropy"
  },
  {
    "number": 134,
    "page": 19,
    "question": "Tính phân tách của một mã nhị phân được hiểu là:",
    "options": [
      "Mỗi ký hiệu nguồn ứng với một từ mã duy nhất",
      "Mỗi dãy mã nhận được chỉ có một cách giải mã duy nhất",
      "Mỗi mã có cùng độ dài",
      "Các từ mã đều có trọng số bằng nhau"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Tính phân tách là giải mã duy nhất cả dãy từ mã.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 135,
    "page": 19,
    "question": "Điều kiện để mã có thể giải mã duy nhất là:",
    "options": [
      "Không có từ mã nào là tiền tố của từ mã khác",
      "Các từ mã có cùng độ dài",
      "Các mã có cùng trọng số",
      "Có số lượng mã tối thiểu"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A",
      "B"
    ],
    "explanation": "A đủ vì mã tiền tố giải mã tức thời. B cũng đủ nếu các từ mã phân biệt và biết ranh giới đầu. Hai điều kiện đều đủ, không phải đều cần.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố",
    "note": "Mã giải mã duy nhất không nhất thiết là mã tiền tố. Ví dụ {0,01} giải mã duy nhất nhưng không phải mã tiền tố."
  },
  {
    "number": 136,
    "page": 19,
    "question": "Tính phân tách giúp đảm bảo điều gì trong quá trình truyền tin?",
    "options": [
      "Giảm xác suất lỗi do nhiễu",
      "Dễ giải mã chính xác, không nhầm lẫn",
      "Tăng tốc độ truyền",
      "Tiết kiệm băng thông"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Giải mã duy nhất tránh nhập nhằng khi ghép từ mã.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 137,
    "page": 19,
    "question": "Một mã được gọi là mã tiền tố (prefix code) khi:",
    "options": [
      "Mọi từ mã có cùng độ dài",
      "Không có từ mã nào là tiền tố của một từ mã khác",
      "Các từ mã bắt đầu bằng cùng một bit",
      "Các từ mã có cùng trọng số"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Không từ mã nào là tiền tố của từ mã khác.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 138,
    "page": 19,
    "question": "Tính tiền tố đảm bảo điều gì cho mã?",
    "options": [
      "Mã được giải mã duy nhất",
      "Mã có độ dài cố định",
      "Mã có thể phát hiện lỗi",
      "Mã có khoảng cách Hamming lớn"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Mã tiền tố luôn giải mã duy nhất.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 139,
    "page": 19,
    "question": "Trong các mã sau, mã nào là mã tiền tố?",
    "options": [
      "{0, 01, 011}",
      "{0, 10, 110}",
      "{1, 10, 100}",
      "{00, 0, 11}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "{0,10,110}: không phần tử nào mở đầu phần tử khác.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 140,
    "page": 19,
    "question": "Trong cây biểu diễn mã (prefix tree), điều kiện nào đảm bảo mã là tiền tố?",
    "options": [
      "Mỗi nút trong cây có nhiều hơn 2 nhánh",
      "Không có từ mã nào là nút cha của từ mã khác",
      "Mỗi từ mã là một nút trung gian",
      "Cây có chiều cao bằng nhau"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Các từ mã nằm ở lá; không từ mã nào là tổ tiên của từ mã khác.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 141,
    "page": 20,
    "question": "Mã nào không phải là mã tiền tố?",
    "options": [
      "{00, 010, 11}",
      "{0, 10, 110}",
      "{1, 01, 0101}",
      "{10, 11, 001}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "C"
    ],
    "explanation": "Trong C, 01 là tiền tố của 0101.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 142,
    "page": 20,
    "question": "Tập mã nào sau đây là mã tiền tố?",
    "options": [
      "{0, 01, 001}",
      "{0, 10, 11}",
      "{1, 11, 111}",
      "{00, 01, 001}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "{0,10,11} không có cặp tiền tố.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 143,
    "page": 20,
    "question": "Trong các tập mã sau, mã nào là mã tiền tố?",
    "options": [
      "{0, 10, 101}",
      "{0, 01, 011}",
      "{00, 000, 1}",
      "{1, 11, 1111}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [],
    "explanation": "Không có đáp án đúng: A có 10→101; B có 0→01; C có 00→000; D có 1→11. Cả bốn đều vi phạm tính tiền tố.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 144,
    "page": 20,
    "question": "Tập mã nào vi phạm tính tiền tố?",
    "options": [
      "{1, 10, 101, 1011}",
      "{0, 10, 11}",
      "{01, 10, 111}",
      "{10, 11, 000}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Trong A, 1 là tiền tố của 10, 101 và 1011.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 145,
    "page": 20,
    "question": "Mã nào là mã tiền tố?",
    "options": [
      "{0, 01, 0011}",
      "{10, 11, 1110}",
      "{0, 1, 10}",
      "{1, 01, 001}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "D"
    ],
    "explanation": "{1,01,001} không có cặp tiền tố.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 146,
    "page": 20,
    "question": "Tập mã nào sau đây là mã tiền tố hợp lệ?",
    "options": [
      "{0, 11, 101}",
      "{01, 010, 011}",
      "{1, 10, 100, 101}",
      "{00, 01, 001}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "{0,11,101} không có cặp tiền tố.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 147,
    "page": 20,
    "question": "Tập mã nào không phải mã tiền tố?",
    "options": [
      "{1, 11, 111}",
      "{10, 11, 001}",
      "{0, 10, 110}",
      "{00, 01, 11}"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "A"
    ],
    "explanation": "Trong A, 1 là tiền tố của 11 và 111.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 148,
    "page": 21,
    "question": "Mã có tính prefix (mã tiền tố) là gì?",
    "options": [
      "Là mã trong đó tất cả các từ mã có cùng độ dài",
      "Là mã trong đó không có từ mã nào là phần đầu (tiền tố) của từ mã khác",
      "Là mã trong đó các từ mã có thể trùng lặp một phần",
      "Là mã mà tất cả các từ mã đều bắt đầu bằng cùng một bit"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Tiền tố là phần đầu; cấm quan hệ đó giữa hai từ mã khác nhau.",
    "sources": [
      "prefix"
    ],
    "topic": "Mã tiền tố"
  },
  {
    "number": 149,
    "page": 21,
    "question": "Yêu cầu cơ bản quan trọng nhất của một hệ mã mật là gì?",
    "options": [
      "Tốc độ mã hóa cao",
      "Đảm bảo tính bí mật của thông tin",
      "Sử dụng khóa ngắn gọn",
      "Dễ cài đặt trên phần cứng"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Trong ngữ cảnh mã mật ở đây, mục tiêu là tính bí mật.",
    "sources": [
      "confidentiality"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 150,
    "page": 21,
    "question": "Trong một hệ mã mật, tính toàn vẹn (integrity) của thông tin được hiểu là:",
    "options": [
      "Chỉ người được phép mới đọc được thông tin",
      "Thông tin không bị thay đổi trong quá trình truyền hoặc lưu trữ",
      "Người gửi có thể chối bỏ việc đã gửi tin",
      "Hệ mã không thể bị giải mã"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Toàn vẹn bảo vệ dữ liệu trước thay đổi trái phép.",
    "sources": [
      "integrity"
    ],
    "topic": "Mật mã & an toàn"
  },
  {
    "number": 151,
    "page": 21,
    "question": "Tính xác thực (authentication) trong mã mật đảm bảo rằng:",
    "options": [
      "Thông điệp được truyền đúng đích",
      "Người nhận chắc chắn biết được ai là người gửi",
      "Dữ liệu được mã hóa bằng khóa công khai",
      "Thông tin được truyền an toàn"
    ],
    "labels": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answers": [
      "B"
    ],
    "explanation": "Xác thực nguồn giúp kiểm tra danh tính người gửi được tuyên bố.",
    "sources": [
      "authentication"
    ],
    "topic": "Mật mã & an toàn",
    "note": "Hiểu là kiểm tra nguồn gốc theo cơ chế xác thực và giả thiết an toàn; mã hóa đơn thuần không tự cung cấp xác thực."
  }
];
