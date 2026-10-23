'use strict';
// 48 independently worked practice questions, supplementary to the original 151.
const INFO_PRACTICE=[
  {
    "subject": "information",
    "chapter": 1,
    "number": 152,
    "id": "information_152",
    "key": "information.152",
    "question": "Sự kiện có xác suất p=0.5. Lượng tin riêng I(x) bằng bao nhiêu bit?",
    "options": [
      "1 bit",
      "2 bit",
      "3 bit",
      "4 bit"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "I(x)=−log₂p=−log₂(0.5)=1 bit.",
    "hint": "Viết xác suất thành lũy thừa của 2 rồi lấy đối số.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 1,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "self",
      "p": 0.5,
      "value": 1
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 153,
    "id": "information_153",
    "key": "information.153",
    "question": "Sự kiện có xác suất p=0.25. Lượng tin riêng I(x) bằng bao nhiêu bit?",
    "options": [
      "3 bit",
      "2 bit",
      "4 bit",
      "5 bit"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "I(x)=−log₂p=−log₂(0.25)=2 bit.",
    "hint": "Viết xác suất thành lũy thừa của 2 rồi lấy đối số.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 2,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "self",
      "p": 0.25,
      "value": 2
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 154,
    "id": "information_154",
    "key": "information.154",
    "question": "Sự kiện có xác suất p=0.125. Lượng tin riêng I(x) bằng bao nhiêu bit?",
    "options": [
      "4 bit",
      "5 bit",
      "3 bit",
      "6 bit"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "I(x)=−log₂p=−log₂(0.125)=3 bit.",
    "hint": "Viết xác suất thành lũy thừa của 2 rồi lấy đối số.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 3,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "self",
      "p": 0.125,
      "value": 3
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 155,
    "id": "information_155",
    "key": "information.155",
    "question": "Sự kiện có xác suất p=0.0625. Lượng tin riêng I(x) bằng bao nhiêu bit?",
    "options": [
      "5 bit",
      "6 bit",
      "7 bit",
      "4 bit"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "I(x)=−log₂p=−log₂(0.0625)=4 bit.",
    "hint": "Viết xác suất thành lũy thừa của 2 rồi lấy đối số.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 4,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "self",
      "p": 0.0625,
      "value": 4
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 156,
    "id": "information_156",
    "key": "information.156",
    "question": "Nguồn rời rạc có phân bố p=(0.5, 0.5). Entropy H(X) bằng bao nhiêu?",
    "options": [
      "1 bit/ký hiệu",
      "2 bit/ký hiệu",
      "3 bit/ký hiệu",
      "4 bit/ký hiệu"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "H=−Σpᵢlog₂pᵢ=1 bit/ký hiệu; quy ước 0log₂0=0.",
    "hint": "Tính lượng tin của từng ký hiệu rồi lấy trung bình theo xác suất.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 5,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "entropy",
      "p": [
        0.5,
        0.5
      ],
      "value": 1.0
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 157,
    "id": "information_157",
    "key": "information.157",
    "question": "Nguồn rời rạc có phân bố p=(0.5, 0.25, 0.25). Entropy H(X) bằng bao nhiêu?",
    "options": [
      "2.5 bit/ký hiệu",
      "1.5 bit/ký hiệu",
      "3.5 bit/ký hiệu",
      "4.5 bit/ký hiệu"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "H=−Σpᵢlog₂pᵢ=1.5 bit/ký hiệu; quy ước 0log₂0=0.",
    "hint": "Tính lượng tin của từng ký hiệu rồi lấy trung bình theo xác suất.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 6,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "entropy",
      "p": [
        0.5,
        0.25,
        0.25
      ],
      "value": 1.5
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 158,
    "id": "information_158",
    "key": "information.158",
    "question": "Nguồn rời rạc có phân bố p=(0.25, 0.25, 0.25, 0.25). Entropy H(X) bằng bao nhiêu?",
    "options": [
      "3 bit/ký hiệu",
      "4 bit/ký hiệu",
      "2 bit/ký hiệu",
      "5 bit/ký hiệu"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "H=−Σpᵢlog₂pᵢ=2 bit/ký hiệu; quy ước 0log₂0=0.",
    "hint": "Tính lượng tin của từng ký hiệu rồi lấy trung bình theo xác suất.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 7,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "entropy",
      "p": [
        0.25,
        0.25,
        0.25,
        0.25
      ],
      "value": 2.0
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 159,
    "id": "information_159",
    "key": "information.159",
    "question": "Nguồn rời rạc có phân bố p=(1, 0). Entropy H(X) bằng bao nhiêu?",
    "options": [
      "1 bit/ký hiệu",
      "2 bit/ký hiệu",
      "3 bit/ký hiệu",
      "-0 bit/ký hiệu"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "H=−Σpᵢlog₂pᵢ=-0 bit/ký hiệu; quy ước 0log₂0=0.",
    "hint": "Tính lượng tin của từng ký hiệu rồi lấy trung bình theo xác suất.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 8,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": {
      "type": "entropy",
      "p": [
        1,
        0
      ],
      "value": -0.0
    }
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 160,
    "id": "information_160",
    "key": "information.160",
    "question": "Nguồn gồm 8 ký hiệu. Entropy cực đại bằng bao nhiêu?",
    "options": [
      "3 bit/ký hiệu",
      "8 bit/ký hiệu",
      "4 bit/ký hiệu",
      "1 bit/ký hiệu"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "H_max=log₂m=log₂8=3 bit/ký hiệu, đạt khi pᵢ=1/8.",
    "hint": "Phân bố đều đạt entropy lớn nhất trên bảng chữ cố định.",
    "review": false,
    "tier": 6,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 9,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 161,
    "id": "information_161",
    "key": "information.161",
    "question": "Hai ký hiệu độc lập có p(x)=1/4 và p(y)=1/8. Lượng tin của cặp (x,y)?",
    "options": [
      "2 bit",
      "5 bit",
      "3 bit",
      "6 bit"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "p(x,y)=p(x)p(y)=1/32; I(x,y)=−log₂(1/32)=5 bit.",
    "hint": "Độc lập cho phép nhân hai xác suất.",
    "review": false,
    "tier": 7,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 10,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 162,
    "id": "information_162",
    "key": "information.162",
    "question": "Đã biết I(x)=6 bit. Xác suất p(x) là bao nhiêu?",
    "options": [
      "1/6",
      "1/32",
      "1/64",
      "1/128"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "I=−log₂p ⇒ p=2^(−I)=2⁻⁶=1/64.",
    "hint": "Đảo công thức bằng hàm mũ cơ số 2.",
    "review": false,
    "tier": 7,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 11,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 1,
    "number": 163,
    "id": "information_163",
    "key": "information.163",
    "question": "Nguồn không nhớ có entropy 1,5 bit/ký hiệu, phát 2000 ký hiệu/s. Tốc độ thông tin?",
    "options": [
      "1500 bit/s",
      "2000 bit/s",
      "4000 bit/s",
      "3000 bit/s"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "R=rH=2000×1,5=3000 bit/s.",
    "hint": "Nhân số ký hiệu mỗi giây với lượng tin trung bình mỗi ký hiệu.",
    "review": false,
    "tier": 7,
    "topic": "Lượng tin & Entropy",
    "origin": "practice",
    "practiceNumber": 12,
    "sources": [
      {
        "label": "MIT · Entropy",
        "url": "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 164,
    "id": "information_164",
    "key": "information.164",
    "question": "Mã {0,10,11} có p=(0,5;0,25;0,25). Độ dài trung bình L̄?",
    "options": [
      "1,5 bit/ký hiệu",
      "1 bit/ký hiệu",
      "2 bit/ký hiệu",
      "2,5 bit/ký hiệu"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "L̄=Σpᵢlᵢ=0,5×1+0,25×2+0,25×2=1,5 bit/ký hiệu.",
    "hint": "Đếm độ dài mỗi từ mã rồi lấy trung bình có trọng số.",
    "review": false,
    "tier": 6,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 13,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": {
      "type": "length",
      "p": [
        0.5,
        0.25,
        0.25
      ],
      "lengths": [
        1,
        2,
        2
      ],
      "value": 1.5
    }
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 165,
    "id": "information_165",
    "key": "information.165",
    "question": "Nguồn có H=1,5 bit/ký hiệu và L̄=2 bit/ký hiệu. Hiệu suất mã nhị phân η?",
    "options": [
      "50%",
      "75%",
      "80%",
      "100%"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "η=H/L̄=1,5/2=0,75=75%.",
    "hint": "Chia lượng tin hữu ích cho số bit trung bình phải gửi.",
    "review": false,
    "tier": 6,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 14,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 166,
    "id": "information_166",
    "key": "information.166",
    "question": "Với η=80%, độ dư tương đối r=1−η bằng?",
    "options": [
      "10%",
      "40%",
      "20%",
      "80%"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "r=1−η=1−0,8=0,2=20%.",
    "hint": "Đổi phần trăm sang tỷ lệ trước khi lấy phần bù.",
    "review": false,
    "tier": 6,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 15,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 167,
    "id": "information_167",
    "key": "information.167",
    "question": "Mã nào là mã tiền tố?",
    "options": [
      "{0,01,11}",
      "{1,10,00}",
      "{00,001,1}",
      "{0,10,110,111}"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "Kiểm tra mọi cặp: không từ nào trong {0,10,110,111} là phần đầu của từ khác; tổng Kraft=1/2+1/4+1/8+1/8=1.",
    "hint": "So sánh từng cặp, đặc biệt từ ngắn nhất.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 16,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 168,
    "id": "information_168",
    "key": "information.168",
    "question": "Độ dài mã nhị phân (1,2,2) cho tổng Kraft bằng?",
    "options": [
      "1",
      "0,5",
      "1,5",
      "2"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "K=Σ2^(−lᵢ)=2⁻¹+2⁻²+2⁻²=1.",
    "hint": "Mỗi độ dài đóng góp 2 mũ âm độ dài.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 17,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 169,
    "id": "information_169",
    "key": "information.169",
    "question": "Có thể tồn tại mã tiền tố nhị phân với độ dài (1,1,2) không?",
    "options": [
      "Có, vì đủ 3 ký hiệu",
      "Không, vì tổng Kraft > 1",
      "Có, mọi bộ độ dài đều được",
      "Không, vì độ dài không bằng nhau"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "K=1/2+1/2+1/4=1,25>1, vi phạm bất đẳng thức Kraft.",
    "hint": "Tính tổng Kraft và so với 1.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 18,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 170,
    "id": "information_170",
    "key": "information.170",
    "question": "Huffman với p=(0,4;0,3;0,2;0,1) phải ghép cặp đầu tiên nào?",
    "options": [
      "0,4 và 0,3",
      "0,3 và 0,2",
      "0,1 và 0,2",
      "0,4 và 0,1"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "Chọn hai xác suất nhỏ nhất: 0,1+0,2=0,3.",
    "hint": "Thuật toán tham lam bắt đầu từ hai trọng số nhỏ nhất.",
    "review": false,
    "tier": 6,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 19,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 171,
    "id": "information_171",
    "key": "information.171",
    "question": "Huffman với p=(0,5;0,25;0,125;0,125) có L̄ tối ưu?",
    "options": [
      "1,5 bit/ký hiệu",
      "2 bit/ký hiệu",
      "2,5 bit/ký hiệu",
      "1,75 bit/ký hiệu"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "Ghép 0,125+0,125=0,25; tiếp 0,25+0,25=0,5; rồi 0,5+0,5=1. Độ dài (1,2,3,3): L̄=0,5+0,5+0,375+0,375=1,75.",
    "hint": "Ghép hai nút nhẹ nhất cho đến gốc, rồi đếm độ sâu lá.",
    "review": false,
    "tier": 8,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 20,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": {
      "type": "huffman",
      "p": [
        0.5,
        0.25,
        0.125,
        0.125
      ],
      "value": 1.75
    }
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 172,
    "id": "information_172",
    "key": "information.172",
    "question": "Huffman cho bốn ký hiệu đồng xác suất có độ dài trung bình?",
    "options": [
      "2 bit/ký hiệu",
      "1 bit/ký hiệu",
      "3 bit/ký hiệu",
      "4 bit/ký hiệu"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "Ghép 0,25+0,25 hai lần rồi ghép 0,5+0,5. Bốn lá sâu 2 nên L̄=4×0,25×2=2.",
    "hint": "Các trọng số đều nhau tạo cây cân bằng.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 21,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": {
      "type": "huffman",
      "p": [
        0.25,
        0.25,
        0.25,
        0.25
      ],
      "value": 2
    }
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 173,
    "id": "information_173",
    "key": "information.173",
    "question": "Nguồn có H=1,75 và mã Huffman L̄=1,75 bit/ký hiệu. Hiệu suất?",
    "options": [
      "75%",
      "100%",
      "87,5%",
      "50%"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "η=H/L̄=1,75/1,75=1=100%.",
    "hint": "Dùng tỷ số entropy trên độ dài mã trung bình.",
    "review": false,
    "tier": 6,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 22,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 174,
    "id": "information_174",
    "key": "information.174",
    "question": "Mã cố định cho 5 ký hiệu phân biệt cần ít nhất bao nhiêu bit/ký hiệu?",
    "options": [
      "2 bit",
      "4 bit",
      "3 bit",
      "5 bit"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "l=⌈log₂5⌉=3; 2²<5≤2³.",
    "hint": "Tìm l nhỏ nhất sao cho 2^l đủ chứa mọi ký hiệu.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 23,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 2,
    "number": 175,
    "id": "information_175",
    "key": "information.175",
    "question": "Mã tiền tố có L̄=1,5 bit/ký hiệu. Mã hóa 1000 ký hiệu có độ dài kỳ vọng?",
    "options": [
      "1000 bit",
      "2000 bit",
      "3000 bit",
      "1500 bit"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "E[L_tổng]=N L̄=1000×1,5=1500 bit.",
    "hint": "Đây là độ dài kỳ vọng, không nhất thiết mỗi bản tin dài đúng như vậy.",
    "review": false,
    "tier": 7,
    "topic": "Mã nguồn & Huffman",
    "origin": "practice",
    "practiceNumber": 24,
    "sources": [
      {
        "label": "MIT · Huffman codes",
        "url": "https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 176,
    "id": "information_176",
    "key": "information.176",
    "question": "Khoảng cách Hamming giữa 101101 và 100011?",
    "options": [
      "3",
      "2",
      "4",
      "5"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "101101 XOR 100011=001110; có 3 bit 1 nên d_H=3.",
    "hint": "XOR hai chuỗi rồi đếm số bit 1.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 25,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "distance",
      "a": "101101",
      "b": "100011",
      "value": 3
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 177,
    "id": "information_177",
    "key": "information.177",
    "question": "Trọng số Hamming của 1101010?",
    "options": [
      "2",
      "4",
      "3",
      "5"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "w_H(1101010)=1+1+0+1+0+1+0=4.",
    "hint": "Trọng số là số bit 1, không phải chiều dài chuỗi.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 26,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 178,
    "id": "information_178",
    "key": "information.178",
    "question": "Mã có d_min=3. Bảo đảm phát hiện tối đa bao nhiêu lỗi bit?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "e_detect=d_min−1=3−1=2.",
    "hint": "Một từ mã khác gần nhất cách d_min vị trí.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 27,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "detect",
      "d": 3,
      "value": 2
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 179,
    "id": "information_179",
    "key": "information.179",
    "question": "Mã có d_min=4. Bảo đảm phát hiện tối đa bao nhiêu lỗi bit?",
    "options": [
      "4",
      "5",
      "6",
      "3"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "e_detect=d_min−1=4−1=3.",
    "hint": "Một từ mã khác gần nhất cách d_min vị trí.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 28,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "detect",
      "d": 4,
      "value": 3
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 180,
    "id": "information_180",
    "key": "information.180",
    "question": "Mã có d_min=5. Bảo đảm phát hiện tối đa bao nhiêu lỗi bit?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "e_detect=d_min−1=5−1=4.",
    "hint": "Một từ mã khác gần nhất cách d_min vị trí.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 29,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "detect",
      "d": 5,
      "value": 4
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 181,
    "id": "information_181",
    "key": "information.181",
    "question": "Mã có d_min=3. Bảo đảm sửa tối đa bao nhiêu lỗi bit?",
    "options": [
      "2",
      "1",
      "3",
      "4"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "t=⌊(d_min−1)/2⌋=⌊(3−1)/2⌋=1.",
    "hint": "Các quả cầu giải mã quanh từ mã phải không chồng lên nhau.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 30,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "correct",
      "d": 3,
      "value": 1
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 182,
    "id": "information_182",
    "key": "information.182",
    "question": "Mã có d_min=4. Bảo đảm sửa tối đa bao nhiêu lỗi bit?",
    "options": [
      "2",
      "3",
      "1",
      "4"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "t=⌊(d_min−1)/2⌋=⌊(4−1)/2⌋=1.",
    "hint": "Các quả cầu giải mã quanh từ mã phải không chồng lên nhau.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 31,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "correct",
      "d": 4,
      "value": 1
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 183,
    "id": "information_183",
    "key": "information.183",
    "question": "Mã có d_min=5. Bảo đảm sửa tối đa bao nhiêu lỗi bit?",
    "options": [
      "3",
      "4",
      "5",
      "2"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "t=⌊(d_min−1)/2⌋=⌊(5−1)/2⌋=2.",
    "hint": "Các quả cầu giải mã quanh từ mã phải không chồng lên nhau.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 32,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": {
      "type": "correct",
      "d": 5,
      "value": 2
    }
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 184,
    "id": "information_184",
    "key": "information.184",
    "question": "Muốn bảo đảm sửa 2 lỗi bit, d_min ít nhất bằng?",
    "options": [
      "5",
      "3",
      "4",
      "6"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "d_min≥2t+1=2×2+1=5.",
    "hint": "Đảo điều kiện sửa lỗi t=⌊(d_min−1)/2⌋.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 33,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 185,
    "id": "information_185",
    "key": "information.185",
    "question": "Thêm một bit parity chẵn vào cuối dữ liệu 1011. Bit thêm là?",
    "options": [
      "0",
      "1",
      "10",
      "11"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "Dữ liệu có 3 bit 1; chọn p=1 để tổng 3+1=4 chẵn.",
    "hint": "Đếm bit 1 của dữ liệu trước khi thêm parity.",
    "review": false,
    "tier": 6,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 34,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 186,
    "id": "information_186",
    "key": "information.186",
    "question": "Mã Hamming (7,4) có bao nhiêu bit kiểm tra?",
    "options": [
      "2",
      "4",
      "3",
      "7"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "r=n−k=7−4=3; 2³=8≥4+3+1.",
    "hint": "n gồm k bit dữ liệu và r bit kiểm tra.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 35,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 3,
    "number": 187,
    "id": "information_187",
    "key": "information.187",
    "question": "Mã lặp {000,111} có d_min và khả năng sửa lỗi như thế nào?",
    "options": [
      "d_min=2, sửa 1 lỗi",
      "d_min=3, sửa 2 lỗi",
      "d_min=1, sửa 0 lỗi",
      "d_min=3, sửa 1 lỗi"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "d_H(000,111)=3; t=⌊(3−1)/2⌋=1.",
    "hint": "Tính khoảng cách của hai từ mã rồi áp dụng công thức.",
    "review": false,
    "tier": 7,
    "topic": "Kiểm soát lỗi & Hamming",
    "origin": "practice",
    "practiceNumber": 36,
    "sources": [
      {
        "label": "IIT Bombay · Linear block codes",
        "url": "https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 188,
    "id": "information_188",
    "key": "information.188",
    "question": "SNR=0 dB tương ứng tỷ số công suất S/N tuyến tính nào?",
    "options": [
      "1",
      "2",
      "11",
      "101"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "S/N=10^(SNR_dB/10)=10^(0/10)=1.",
    "hint": "Với tỷ số công suất dùng 10 log₁₀, không phải 20 log₁₀.",
    "review": false,
    "tier": 6,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 37,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "snr",
      "db": 0,
      "value": 1.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 189,
    "id": "information_189",
    "key": "information.189",
    "question": "SNR=10 dB tương ứng tỷ số công suất S/N tuyến tính nào?",
    "options": [
      "11",
      "10",
      "20",
      "110"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "S/N=10^(SNR_dB/10)=10^(10/10)=10.",
    "hint": "Với tỷ số công suất dùng 10 log₁₀, không phải 20 log₁₀.",
    "review": false,
    "tier": 6,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 38,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "snr",
      "db": 10,
      "value": 10.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 190,
    "id": "information_190",
    "key": "information.190",
    "question": "SNR=20 dB tương ứng tỷ số công suất S/N tuyến tính nào?",
    "options": [
      "101",
      "110",
      "100",
      "200"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "S/N=10^(SNR_dB/10)=10^(20/10)=100.",
    "hint": "Với tỷ số công suất dùng 10 log₁₀, không phải 20 log₁₀.",
    "review": false,
    "tier": 6,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 39,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "snr",
      "db": 20,
      "value": 100.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 191,
    "id": "information_191",
    "key": "information.191",
    "question": "Kênh AWGN băng thông B=1000 Hz, S/N=3 (tuyến tính). Dung lượng Shannon?",
    "options": [
      "1000 bit/s",
      "4000 bit/s",
      "6000 bit/s",
      "2000 bit/s"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "C=B log₂(1+S/N)=1000 log₂(4)=2000 bit/s.",
    "hint": "Cộng 1 vào S/N rồi lấy log₂ trước khi nhân B.",
    "review": false,
    "tier": 7,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 40,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "capacity",
      "b": 1000,
      "snr": 3,
      "value": 2000.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 192,
    "id": "information_192",
    "key": "information.192",
    "question": "Kênh AWGN băng thông B=2000 Hz, S/N=15 (tuyến tính). Dung lượng Shannon?",
    "options": [
      "8000 bit/s",
      "4000 bit/s",
      "16000 bit/s",
      "24000 bit/s"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "C=B log₂(1+S/N)=2000 log₂(16)=8000 bit/s.",
    "hint": "Cộng 1 vào S/N rồi lấy log₂ trước khi nhân B.",
    "review": false,
    "tier": 7,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 41,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "capacity",
      "b": 2000,
      "snr": 15,
      "value": 8000.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 193,
    "id": "information_193",
    "key": "information.193",
    "question": "Kênh AWGN băng thông B=3000 Hz, S/N=7 (tuyến tính). Dung lượng Shannon?",
    "options": [
      "4500 bit/s",
      "9000 bit/s",
      "18000 bit/s",
      "27000 bit/s"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "C=B log₂(1+S/N)=3000 log₂(8)=9000 bit/s.",
    "hint": "Cộng 1 vào S/N rồi lấy log₂ trước khi nhân B.",
    "review": false,
    "tier": 7,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 42,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "capacity",
      "b": 3000,
      "snr": 7,
      "value": 9000.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 194,
    "id": "information_194",
    "key": "information.194",
    "question": "Kênh AWGN băng thông B=4000 Hz, S/N=15 (tuyến tính). Dung lượng Shannon?",
    "options": [
      "8000 bit/s",
      "32000 bit/s",
      "16000 bit/s",
      "48000 bit/s"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "C=B log₂(1+S/N)=4000 log₂(16)=16000 bit/s.",
    "hint": "Cộng 1 vào S/N rồi lấy log₂ trước khi nhân B.",
    "review": false,
    "tier": 7,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 43,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "capacity",
      "b": 4000,
      "snr": 15,
      "value": 16000.0
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 195,
    "id": "information_195",
    "key": "information.195",
    "question": "Kênh AWGN B=1000 Hz, SNR=10log₁₀3 dB. Dung lượng?",
    "options": [
      "1000 bit/s",
      "3000 bit/s",
      "4000 bit/s",
      "2000 bit/s"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "S/N=10^((10log₁₀3)/10)=3. C=1000 log₂4=2000 bit/s.",
    "hint": "Đổi dB về tỷ số tuyến tính trước.",
    "review": false,
    "tier": 8,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 44,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 196,
    "id": "information_196",
    "key": "information.196",
    "question": "Băng thông tăng gấp đôi, giữ tỷ số S/N cố định. Dung lượng AWGN thay đổi thế nào?",
    "options": [
      "Tăng gấp đôi",
      "Không đổi",
      "Tăng gấp bốn",
      "Giảm một nửa"
    ],
    "answer": "A",
    "answers": [
      "A"
    ],
    "explanation": "C′=(2B)log₂(1+S/N)=2C. Điều kiện giữ S/N cố định là cần thiết.",
    "hint": "Chỉ thay B, không thay tỷ số công suất.",
    "review": false,
    "tier": 7,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 45,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 197,
    "id": "information_197",
    "key": "information.197",
    "question": "Kênh AWGN B=1000 Hz muốn C=3000 bit/s. S/N tối thiểu theo công thức dung lượng?",
    "options": [
      "3",
      "7",
      "8",
      "15"
    ],
    "answer": "B",
    "answers": [
      "B"
    ],
    "explanation": "S/N=2^(C/B)−1=2³−1=7. Đây là điều kiện giới hạn dung lượng; truyền tin tin cậy tiệm cận cần tốc độ dưới C.",
    "hint": "Giải phương trình logarit theo S/N.",
    "review": false,
    "tier": 8,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 46,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": {
      "type": "inverse",
      "b": 1000,
      "c": 3000,
      "value": 7
    }
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 198,
    "id": "information_198",
    "key": "information.198",
    "question": "Kênh AWGN có S/N=7, cần C=6000 bit/s. B tối thiểu theo công thức dung lượng?",
    "options": [
      "1000 Hz",
      "3000 Hz",
      "2000 Hz",
      "6000 Hz"
    ],
    "answer": "C",
    "answers": [
      "C"
    ],
    "explanation": "B=C/log₂(1+S/N)=6000/log₂8=2000 Hz.",
    "hint": "Chia dung lượng cho hiệu suất phổ.",
    "review": false,
    "tier": 8,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 47,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": null
  },
  {
    "subject": "information",
    "chapter": 4,
    "number": 199,
    "id": "information_199",
    "key": "information.199",
    "question": "Kênh AWGN B=3000 Hz, S/N=0. Dung lượng theo Shannon?",
    "options": [
      "3000 bit/s",
      "6000 bit/s",
      "9000 bit/s",
      "0 bit/s"
    ],
    "answer": "D",
    "answers": [
      "D"
    ],
    "explanation": "C=3000 log₂(1+0)=3000×0=0 bit/s.",
    "hint": "Không có công suất tín hiệu thì không truyền thông tin theo mô hình này.",
    "review": false,
    "tier": 6,
    "topic": "Kênh truyền & Shannon",
    "origin": "practice",
    "practiceNumber": 48,
    "sources": [
      {
        "label": "MIT · Communication systems, §4.5",
        "url": "https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf"
      }
    ],
    "calc": null
  }
];
