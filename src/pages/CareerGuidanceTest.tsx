import React from 'react';
import image_careers from '../images/image_careers.png'; 

const CareerGuidanceTest: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bài trắc nghiệm hướng nghiệp dựa trên cơ sở khoa học, được sử dụng trên khắp thế giới</h1>
      <p className="mb-4">
        Bạn đang được tiếp cận bài trắc nghiệm được xây dựng dựa trên cơ sở khoa học và được các tổ chức giáo dục trên khắp thế giới sử dụng cho hoạt động hướng nghiệp. Bài trắc nghiệm này có thuật ngữ tiếng Anh là "Holland Codes", hãy google thuật ngữ trên nếu bạn muốn hiểu sâu hơn phương pháp khoa học được áp dụng.
        <br />Holland Codes là bài trắc nghiệm thiên hướng nghề nghiệp được sử dụng nhiều nhất và phổ biến nhất hiện nay
        <br />Bất cứ ai đi tìm định hướng nghề nghiệp tương lai cho bản thân đều không thể bỏ qua bài trắc nghiệm này.
      </p>
      <div className="flex mb-4">
        <div className="w-1/2 pr-4">
          <img src={image_careers} alt="Career Guidance" className="w-full" />
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Đang hoang mang chưa biết theo ngành nghề gì?</h2>
          <p className="mb-4">
            Nhiều bạn đang hoang mang vì chưa biết chọn ngành nghề gì cho bản thân, không biết nên tìm hiểu gì và bắt đầu từ đâu. May thay đã có công cụ trắc nghiệm hướng nghiệp, bạn chỉ cần trả lời các câu hỏi vào bảng câu hỏi.
            <br />Sau khi trả lời các câu hỏi, bạn sẽ nhận được ngay lập tức kết quả giúp bạn khám phá ra kiểu người nổi trội của bạn, và từ đó gợi ý các thông tin ngành nghề - nghề nghiệp bạn nên ưu tiên tìm hiểu.
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Bắt đầu làm bài trắc nghiệm hướng nghiệp
        </button>
      </div>
    </div>
  );
};

export default CareerGuidanceTest;