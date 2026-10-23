import json,math,pathlib
out=[]
sources={1:('MIT · Entropy','https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf'),2:('MIT · Huffman codes','https://ocw.mit.edu/courses/18-200-principles-of-discrete-applied-mathematics-spring-2024/mit18_200_s24_lec19.pdf'),3:('IIT Bombay · Linear block codes','https://www.ee.iitb.ac.in/~sarva/courses/EE605/2015/slides/LinearBlockCodes.pdf'),4:('MIT · Communication systems, §4.5','https://ocw.mit.edu/courses/6-661-receivers-antennas-and-signals-spring-2003/bcfc709f4d26465b45c0b42615b82b2b_ch4new.pdf')}
def add(ch,q,correct,wrong,ex,hint,tier=6,calc=None):
 i=len(out);opts=list(wrong);pos=i%4;opts.insert(pos,str(correct));assert len(opts)==4 and len(set(opts))==4
 n=152+i;title,url=sources[ch]
 out.append(dict(subject='information',chapter=ch,number=n,id=f'information_{n}',key=f'information.{n}',question=q,options=opts,answer='ABCD'[pos],answers=['ABCD'[pos]],explanation=ex,hint=hint,review=False,tier=tier,topic=['Lượng tin & Entropy','Mã nguồn & Huffman','Kiểm soát lỗi & Hamming','Kênh truyền & Shannon'][ch-1],origin='practice',practiceNumber=i+1,sources=[dict(label=title,url=url)],calc=calc))
for p in [1/2,1/4,1/8,1/16]:
 ans=int(-math.log2(p));add(1,f'Sự kiện có xác suất p={p:g}. Lượng tin riêng I(x) bằng bao nhiêu bit?',f'{ans} bit',[f'{ans+1} bit',f'{ans+2} bit',f'{ans+3} bit'],f'I(x)=−log₂p=−log₂({p:g})={ans} bit.','Viết xác suất thành lũy thừa của 2 rồi lấy đối số.',calc=dict(type='self',p=p,value=ans))
for probs in [[.5,.5],[.5,.25,.25],[.25]*4,[1,0]]:
 h=-sum(p*math.log2(p) for p in probs if p);add(1,'Nguồn rời rạc có phân bố p=('+', '.join(map(str,probs))+'). Entropy H(X) bằng bao nhiêu?',f'{h:g} bit/ký hiệu',[f'{h+1:g} bit/ký hiệu',f'{h+2:g} bit/ký hiệu',f'{h+3:g} bit/ký hiệu'],f'H=−Σpᵢlog₂pᵢ={h:g} bit/ký hiệu; quy ước 0log₂0=0.','Tính lượng tin của từng ký hiệu rồi lấy trung bình theo xác suất.',calc=dict(type='entropy',p=probs,value=h))
add(1,'Nguồn gồm 8 ký hiệu. Entropy cực đại bằng bao nhiêu?', '3 bit/ký hiệu',['8 bit/ký hiệu','4 bit/ký hiệu','1 bit/ký hiệu'],'H_max=log₂m=log₂8=3 bit/ký hiệu, đạt khi pᵢ=1/8.','Phân bố đều đạt entropy lớn nhất trên bảng chữ cố định.')
add(1,'Hai ký hiệu độc lập có p(x)=1/4 và p(y)=1/8. Lượng tin của cặp (x,y)?','5 bit',['2 bit','3 bit','6 bit'],'p(x,y)=p(x)p(y)=1/32; I(x,y)=−log₂(1/32)=5 bit.','Độc lập cho phép nhân hai xác suất.',7)
add(1,'Đã biết I(x)=6 bit. Xác suất p(x) là bao nhiêu?','1/64',['1/6','1/32','1/128'],'I=−log₂p ⇒ p=2^(−I)=2⁻⁶=1/64.','Đảo công thức bằng hàm mũ cơ số 2.',7)
add(1,'Nguồn không nhớ có entropy 1,5 bit/ký hiệu, phát 2000 ký hiệu/s. Tốc độ thông tin?','3000 bit/s',['1500 bit/s','2000 bit/s','4000 bit/s'],'R=rH=2000×1,5=3000 bit/s.','Nhân số ký hiệu mỗi giây với lượng tin trung bình mỗi ký hiệu.',7)
add(2,'Mã {0,10,11} có p=(0,5;0,25;0,25). Độ dài trung bình L̄?','1,5 bit/ký hiệu',['1 bit/ký hiệu','2 bit/ký hiệu','2,5 bit/ký hiệu'],'L̄=Σpᵢlᵢ=0,5×1+0,25×2+0,25×2=1,5 bit/ký hiệu.','Đếm độ dài mỗi từ mã rồi lấy trung bình có trọng số.',calc=dict(type='length',p=[.5,.25,.25],lengths=[1,2,2],value=1.5))
add(2,'Nguồn có H=1,5 bit/ký hiệu và L̄=2 bit/ký hiệu. Hiệu suất mã nhị phân η?','75%',['50%','80%','100%'],'η=H/L̄=1,5/2=0,75=75%.','Chia lượng tin hữu ích cho số bit trung bình phải gửi.')
add(2,'Với η=80%, độ dư tương đối r=1−η bằng?','20%',['10%','40%','80%'],'r=1−η=1−0,8=0,2=20%.','Đổi phần trăm sang tỷ lệ trước khi lấy phần bù.')
add(2,'Mã nào là mã tiền tố?','{0,10,110,111}',['{0,01,11}','{1,10,00}','{00,001,1}'],'Kiểm tra mọi cặp: không từ nào trong {0,10,110,111} là phần đầu của từ khác; tổng Kraft=1/2+1/4+1/8+1/8=1.','So sánh từng cặp, đặc biệt từ ngắn nhất.',7)
add(2,'Độ dài mã nhị phân (1,2,2) cho tổng Kraft bằng?','1',['0,5','1,5','2'],'K=Σ2^(−lᵢ)=2⁻¹+2⁻²+2⁻²=1.','Mỗi độ dài đóng góp 2 mũ âm độ dài.',7)
add(2,'Có thể tồn tại mã tiền tố nhị phân với độ dài (1,1,2) không?','Không, vì tổng Kraft > 1',['Có, vì đủ 3 ký hiệu','Có, mọi bộ độ dài đều được','Không, vì độ dài không bằng nhau'],'K=1/2+1/2+1/4=1,25>1, vi phạm bất đẳng thức Kraft.','Tính tổng Kraft và so với 1.',7)
add(2,'Huffman với p=(0,4;0,3;0,2;0,1) phải ghép cặp đầu tiên nào?','0,1 và 0,2',['0,4 và 0,3','0,3 và 0,2','0,4 và 0,1'],'Chọn hai xác suất nhỏ nhất: 0,1+0,2=0,3.','Thuật toán tham lam bắt đầu từ hai trọng số nhỏ nhất.')
add(2,'Huffman với p=(0,5;0,25;0,125;0,125) có L̄ tối ưu?','1,75 bit/ký hiệu',['1,5 bit/ký hiệu','2 bit/ký hiệu','2,5 bit/ký hiệu'],'Ghép 0,125+0,125=0,25; tiếp 0,25+0,25=0,5; rồi 0,5+0,5=1. Độ dài (1,2,3,3): L̄=0,5+0,5+0,375+0,375=1,75.', 'Ghép hai nút nhẹ nhất cho đến gốc, rồi đếm độ sâu lá.',8,dict(type='huffman',p=[.5,.25,.125,.125],value=1.75))
add(2,'Huffman cho bốn ký hiệu đồng xác suất có độ dài trung bình?','2 bit/ký hiệu',['1 bit/ký hiệu','3 bit/ký hiệu','4 bit/ký hiệu'],'Ghép 0,25+0,25 hai lần rồi ghép 0,5+0,5. Bốn lá sâu 2 nên L̄=4×0,25×2=2.','Các trọng số đều nhau tạo cây cân bằng.',7,dict(type='huffman',p=[.25]*4,value=2))
add(2,'Nguồn có H=1,75 và mã Huffman L̄=1,75 bit/ký hiệu. Hiệu suất?','100%',['75%','87,5%','50%'],'η=H/L̄=1,75/1,75=1=100%.','Dùng tỷ số entropy trên độ dài mã trung bình.')
add(2,'Mã cố định cho 5 ký hiệu phân biệt cần ít nhất bao nhiêu bit/ký hiệu?','3 bit',['2 bit','4 bit','5 bit'],'l=⌈log₂5⌉=3; 2²<5≤2³.','Tìm l nhỏ nhất sao cho 2^l đủ chứa mọi ký hiệu.',7)
add(2,'Mã tiền tố có L̄=1,5 bit/ký hiệu. Mã hóa 1000 ký hiệu có độ dài kỳ vọng?','1500 bit',['1000 bit','2000 bit','3000 bit'],'E[L_tổng]=N L̄=1000×1,5=1500 bit.','Đây là độ dài kỳ vọng, không nhất thiết mỗi bản tin dài đúng như vậy.',7)
add(3,'Khoảng cách Hamming giữa 101101 và 100011?','3',['2','4','5'],'101101 XOR 100011=001110; có 3 bit 1 nên d_H=3.','XOR hai chuỗi rồi đếm số bit 1.',calc=dict(type='distance',a='101101',b='100011',value=3))
add(3,'Trọng số Hamming của 1101010?','4',['2','3','5'],'w_H(1101010)=1+1+0+1+0+1+0=4.','Trọng số là số bit 1, không phải chiều dài chuỗi.')
for d in [3,4,5]:
 add(3,f'Mã có d_min={d}. Bảo đảm phát hiện tối đa bao nhiêu lỗi bit?',str(d-1),[str(d),str(d+1),str(d+2)],f'e_detect=d_min−1={d}−1={d-1}.','Một từ mã khác gần nhất cách d_min vị trí.',6,dict(type='detect',d=d,value=d-1))
for d in [3,4,5]:
 t=(d-1)//2;add(3,f'Mã có d_min={d}. Bảo đảm sửa tối đa bao nhiêu lỗi bit?',str(t),[str(t+1),str(t+2),str(t+3)],f't=⌊(d_min−1)/2⌋=⌊({d}−1)/2⌋={t}.','Các quả cầu giải mã quanh từ mã phải không chồng lên nhau.',7,dict(type='correct',d=d,value=t))
add(3,'Muốn bảo đảm sửa 2 lỗi bit, d_min ít nhất bằng?','5',['3','4','6'],'d_min≥2t+1=2×2+1=5.','Đảo điều kiện sửa lỗi t=⌊(d_min−1)/2⌋.',7)
add(3,'Thêm một bit parity chẵn vào cuối dữ liệu 1011. Bit thêm là?','1',['0','10','11'],'Dữ liệu có 3 bit 1; chọn p=1 để tổng 3+1=4 chẵn.','Đếm bit 1 của dữ liệu trước khi thêm parity.')
add(3,'Mã Hamming (7,4) có bao nhiêu bit kiểm tra?','3',['2','4','7'],'r=n−k=7−4=3; 2³=8≥4+3+1.','n gồm k bit dữ liệu và r bit kiểm tra.',7)
add(3,'Mã lặp {000,111} có d_min và khả năng sửa lỗi như thế nào?','d_min=3, sửa 1 lỗi',['d_min=2, sửa 1 lỗi','d_min=3, sửa 2 lỗi','d_min=1, sửa 0 lỗi'],'d_H(000,111)=3; t=⌊(3−1)/2⌋=1.','Tính khoảng cách của hai từ mã rồi áp dụng công thức.',7)
for db in [0,10,20]:
 v=10**(db/10);add(4,f'SNR={db} dB tương ứng tỷ số công suất S/N tuyến tính nào?',f'{v:g}',[f'{v+1:g}',f'{v+10:g}',f'{v+100:g}'],f'S/N=10^(SNR_dB/10)=10^({db}/10)={v:g}.','Với tỷ số công suất dùng 10 log₁₀, không phải 20 log₁₀.',6,dict(type='snr',db=db,value=v))
for bw,snr in [(1000,3),(2000,15),(3000,7),(4000,15)]:
 v=bw*math.log2(1+snr);add(4,f'Kênh AWGN băng thông B={bw} Hz, S/N={snr} (tuyến tính). Dung lượng Shannon?',f'{v:g} bit/s',[f'{v/2:g} bit/s',f'{v*2:g} bit/s',f'{v*3:g} bit/s'],f'C=B log₂(1+S/N)={bw} log₂({1+snr})={v:g} bit/s.','Cộng 1 vào S/N rồi lấy log₂ trước khi nhân B.',7,dict(type='capacity',b=bw,snr=snr,value=v))
add(4,'Kênh AWGN B=1000 Hz, SNR=10log₁₀3 dB. Dung lượng?','2000 bit/s',['1000 bit/s','3000 bit/s','4000 bit/s'],'S/N=10^((10log₁₀3)/10)=3. C=1000 log₂4=2000 bit/s.','Đổi dB về tỷ số tuyến tính trước.',8)
add(4,'Băng thông tăng gấp đôi, giữ tỷ số S/N cố định. Dung lượng AWGN thay đổi thế nào?','Tăng gấp đôi',['Không đổi','Tăng gấp bốn','Giảm một nửa'],'C′=(2B)log₂(1+S/N)=2C. Điều kiện giữ S/N cố định là cần thiết.','Chỉ thay B, không thay tỷ số công suất.',7)
add(4,'Kênh AWGN B=1000 Hz muốn C=3000 bit/s. S/N tối thiểu theo công thức dung lượng?','7',['3','8','15'],'S/N=2^(C/B)−1=2³−1=7. Đây là điều kiện giới hạn dung lượng; truyền tin tin cậy tiệm cận cần tốc độ dưới C.','Giải phương trình logarit theo S/N.',8,dict(type='inverse',b=1000,c=3000,value=7))
add(4,'Kênh AWGN có S/N=7, cần C=6000 bit/s. B tối thiểu theo công thức dung lượng?','2000 Hz',['1000 Hz','3000 Hz','6000 Hz'],'B=C/log₂(1+S/N)=6000/log₂8=2000 Hz.','Chia dung lượng cho hiệu suất phổ.',8)
add(4,'Kênh AWGN B=3000 Hz, S/N=0. Dung lượng theo Shannon?','0 bit/s',['3000 bit/s','6000 bit/s','9000 bit/s'],'C=3000 log₂(1+0)=3000×0=0 bit/s.','Không có công suất tín hiệu thì không truyền thông tin theo mô hình này.')
assert len(out)==48,len(out)
(pathlib.Path(__file__).resolve().parents[1]/'dist/info-questions.js').write_text("'use strict';\n// 48 independently worked practice questions, supplementary to the original 151.\nconst INFO_PRACTICE="+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
