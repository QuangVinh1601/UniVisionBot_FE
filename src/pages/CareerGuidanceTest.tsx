import React, { useState } from 'react';
import image_careers from '../images/image_careers.png';

const CareerGuidanceTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'userInfo' | 'questions'>('intro');
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    email: '', 
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    city: false,
    email: false,
    phone: false
  });

  const handleStartTest = () => {
    setCurrentStep('userInfo');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      name: formData.name === '',
      city: formData.city === '',
      email: formData.email === '',
      phone: formData.phone === ''
    };
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(error => error);
    if (!hasErrors) {
      setCurrentStep('questions');
    }
  };

  const renderQuestions = () => {
    return (
      <div className="bg-white p-6 rounded-lg w-full mx-auto shadow-md border border-gray-300">
        <h2 className="bg-green-500 text-white font-bold py-5 px-10 rounded w-full text-xl text-center mb-5">Xin chào {formData.name} !</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Môn học mà bạn yêu thích là gì ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="favoriteSubject"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Khối ngành nào bạn chọn để dự thi ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="selectedMajor"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Điểm thi đại học của bạn ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="universityEntryScore"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lĩnh vực nào mà bạn ưa thích ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="favoriteField"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Vai trò của lĩnh vực mà bạn ưa thích ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="roleInField"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hãy cho chúng tôi biết nhiều hơn về sở thích của bạn ? <span className="text-red-500">*</span></label>
            <textarea
              name="hobbies"
              className="border rounded w-full px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Những kỹ năng mà bạn đang có ? <span className="text-red-500">*</span></label>
            <textarea
              name="skills"
              className="border rounded w-full px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngân sách mà bạn có thể trả cho 1 năm học ở trường đại học ? <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="universityBudget"
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Gửi câu trả lời
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {currentStep === 'intro' && (
        <>
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
            <button onClick={handleStartTest} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Bắt đầu làm bài trắc nghiệm hướng nghiệp
            </button>
          </div>
        </>
      )}

      {currentStep === 'userInfo' && (
        <div className="bg-white p-6 rounded-lg w-full mx-auto shadow-md border border-gray-300 ">
          <h2 className="bg-green-500 text-white font-bold py-5 px-10 rounded w-full text-xl text-center mb-5">Hãy cho chúng tôi biết về thông tin của bạn</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tên của bạn <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                className={`border rounded w-full px-3 py-2 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="Tên của bạn"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">*Trường không được để trống</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Thành phố bạn đang sinh sống <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="city" 
                className={`border rounded w-full px-3 py-2 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.city} 
                onChange={handleInputChange}
                placeholder="Thành phố bạn đang sinh sống"
              />
              {formErrors.city && <p className="text-red-500 text-xs mt-1">*Trường không được để trống</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email" 
                className={`border rounded w-full px-3 py-2 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email} 
                onChange={handleInputChange}
                placeholder="Email"
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">*Trường không được để trống</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="phone" 
                className={`border rounded w-full px-3 py-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.phone} 
                onChange={handleInputChange}
                placeholder="Số điện thoại"
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">*Trường không được để trống</p>}
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-green-500 text-white font-medium py-2 px-8 rounded w-full hover:bg-green-600">
                Tiếp tục
              </button>
            </div>
          </form>
        </div>
      )}

      {currentStep === 'questions' && renderQuestions()}
    </div>
  );
};

export default CareerGuidanceTest;