import React, { useState } from 'react';
import CareerSurvey from './CareerSurvey';
import image_careers from '../../images/image_careers.png';

const CareerGuidanceTest: React.FC = () => {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const handleStartTest = () => {
    console.log('Starting the career guidance test...');
    setIsTestStarted(true);
  };

  // Validation function to check if all fields are filled
  const isFormFilled = (): boolean => name !== '' && className !== '' && schoolName !== '';

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {!isTestStarted && (
        <>
          <h1 className="text-2xl font-bold mb-4">Bài trắc nghiệm hướng nghiệp dựa trên cơ sở khoa học, được sử dụng trên khắp thế giới</h1>
          <p className="mb-4">
            Bạn đang được tiếp cận bài trắc nghiệm được xây dựng dựa trên cơ sở khoa học và được các tổ chức giáo dục trên khắp thế giới sử dụng cho hoạt động hướng nghiệp. Bài
            trắc nghiệm này có thuật ngữ tiếng Anh là "Holland Codes", hãy google thuật ngữ trên nếu bạn muốn hiểu sâu hơn phương pháp khoa học được áp dụng.
            <br />
            Holland Codes là bài trắc nghiệm thiên hướng nghề nghiệp được sử dụng nhiều nhất và phổ biến nhất hiện nay
            <br />
            Bất cứ ai đi tìm định hướng nghề nghiệp tương lai cho bản thân đều không thể bỏ qua bài trắc nghiệm này.
          </p>
          <div className="flex mb-4">
            <div className="w-1/2 pr-4">
              <img src={image_careers} alt="Career Guidance" className="w-full" />
            </div>
            <div className="w-1/2 pl-4">
              <h2 className="text-2xl font-bold mb-4">Đang hoang mang chưa biết theo ngành nghề gì?</h2>
              <p className="mb-4">
                Nhiều bạn đang hoang mang vì chưa biết chọn ngành nghề gì cho bản thân, không biết nên tìm hiểu gì và bắt đầu từ đâu. May thay đã có công cụ trắc nghiệm hướng
                nghiệp, bạn chỉ cần trả lời các câu hỏi vào bảng câu hỏi.
                <br />
                Sau khi trả lời các câu hỏi, bạn sẽ nhận được ngay lập tức kết quả giúp bạn khám phá ra kiểu người nổi trội của bạn, và từ đó gợi ý các thông tin ngành nghề - nghề
                nghiệp bạn nên ưu tiên tìm hiểu.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={handleStartTest} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Bắt đầu làm bài trắc nghiệm hướng nghiệp
            </button>
          </div>
        </>
      )}
      {isTestStarted && (
        <>
          <div className="bg-green-400 p-4 text-center">
            <h1 className="text-3xl font-bold">Làm bài TRẮC NGHIỆM HƯỚNG NGHIỆP</h1>
            <p className="mb-4">Bài trắc nghiệm hướng nghiệp - John Holland</p>
          </div>
          <div className="p-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Đăng nhập nhanh với Google</button>
          </div>
          <div className="p-4">
            <p className="mb-2 text-red-500">* trường bắt buộc phải điền</p>
            <div className="flex items-center mb-2">
              <label className="mr-2 whitespace-nowrap w-1/3">
                Nhập tên của bạn <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="Nhập tên của bạn" className="border border-green-400 p-2 w-2/3" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-2 whitespace-nowrap w-1/3">
                Bạn đang học lớp nào <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Bạn đang học lớp nào"
                className="border border-green-400 p-2 w-2/3"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-2 whitespace-nowrap w-1/3">
                Bạn đang học ở trường nào <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Bạn đang học ở trường nào"
                className="border border-green-400 p-2 w-2/3"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-2 whitespace-nowrap w-1/3">Email của bạn (nếu có)</label>
              <input type="email" placeholder="Email của bạn (nếu có)" className="border border-green-400 p-2 w-2/3" />
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-2 whitespace-nowrap w-1/3">Số Điện thoại (nếu có)</label>
              <input type="tel" placeholder="Số Điện thoại (nếu có)" className="border border-green-400 p-2 w-2/3" />
            </div>
          </div>
          <p className="text-red-500 font-bold bg-gray-200 p-4">
            Các ý liệt kê trong mỗi bảng hướng đến các tố chất và năng lực của bạn. Với mỗi ý sẽ có nhiều mức độ phù hợp với bạn, tương ứng với mức độ phù hợp, sẽ được quy định một
            điểm số tương ứng. Điểm số tương ứng này do bạn đánh giá và tự điền vào bảng theo thang đo sau.
            <br />
            <br />
            1. Bạn thấy ý đó chưa bao giờ đúng với bạn - cho 0 điểm <br />
            2. Chỉ thấy ý đó chỉ đúng trong một vài trường hợp - cho 1 điểm <br />
            3. Bạn thấy ý đó chỉ một nửa là đúng với bạn - cho 2 điểm <br />
            4. Bạn thấy ý đó gần như là đúng với bạn trong hầu hết mọi trường hợp - cho 3 điểm <br />
            5. Bạn thấy ý đó là hoàn toàn đúng với bạn, không thể nào khác đi được - cho 4 điểm
          </p>
          <CareerSurvey isFormFilled={isFormFilled} />
        </>
      )}
    </div>
  );
};
export default CareerGuidanceTest;
