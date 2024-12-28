import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage } from '../../api/authApi';
interface CareerSurveyProps {
  isFormFilled: () => boolean;
}

const CareerSurvey: React.FC<CareerSurveyProps> = ({ isFormFilled }) => {
  const questionGroups = [
    {
      type: 'Realistic (Người thực tế)',
      description: 'Những người thiên về kỹ thuật, vận động và thích làm việc với đồ vật',
      questions: [
        '1. Tôi có tính tự lập',
        '2. Tôi suy nghĩ thực tế',
        '3. Tôi là người thích nghi với môi trường mới',
        '4. Tôi có thể vận hành, điều khiển các máy móc thiết bị',
        '5. Tôi làm các công việc thủ công như gấp giấy, đan, mộc',
        '6. Tôi thích tiếp xúc với thiên nhiên, động vật, cây cỏ',
        '7. Tôi thích những công việc sử dụng tay chân hơn là trí óc',
        '8. Tôi thích những công việc thấy ngay kết quả',
        '9. Tôi làm việc ngoài trời hơn là trong phòng học, văn phòng'
      ]
    },
    {
      type: 'Investigative (Người nghiên cứu)',
      description: 'Những người thích phân tích, tìm tòi và giải quyết vấn đề',
      questions: [
        '1. Tôi có tìm hiểu khám phá nhiều vấn đề mới',
        '2. Tôi có khả năng phân tích vấn đề',
        '3. Tôi biết suy nghĩ một cách mạch lạc, chặt chẽ',
        '4. Tôi thích thực hiện các thí nghiệm hay nghiên cứu',
        '5. Tôi có khả năng tổng hợp, khái quát, suy đoán những vấn đề',
        '6. Tôi thích những hoạt động điều tra, phân loại, kiểm tra, đánh giá',
        '7. Tôi tự tổ chức công việc mình phái làm',
        '8. Tôi thích suy nghĩ về những vấn đề phức tạp, làm những công việc phức tạp',
        '9. Tôi có khả năng giải quyết các vấn đề'
      ]
    },
    {
      type: 'Artistic (Người nghệ thuật)',
      description: 'Những người có tính sáng tạo và thích thể hiện bản thân',
      questions: [
        '1. Tôi là người dễ xúc động',
        '2. Tôi có óc tưởng tượng phong phú',
        '3. Tôi thích sự tự do, không theo những quy định , quy tắc',
        '4. Tôi có khả năng thuyết trình, diễn xuất',
        '5. Tôi có thể chụp hình hoặc vẽ tranh, trang trí, điêu khắc',
        '6. Tôi có năng khiếu âm nhạc',
        '7. Tôi có khả năng viết, trình bày những ý tưởng của mình',
        '8. Tôi thích làm những công việc mới, những công việc đòi hỏi sự sáng tạo',
        '9. Tôi thoải mái bộc lộ những ý thích'
      ]
    },
    {
      type: 'Social (Người xã hội)',
      description: 'Những người thích làm việc với người khác và giúp đỡ người khác',
      questions: [
        '1. Tôi là người thân thiện, hay giúp đỡ người khác',
        '2. Tôi thích gặp gỡ, làm việc với con người',
        '3. Tôi là người lịch sự, tử tế',
        '4. Tôi thích khuyên bảo, huấn luyện hay giảng giái cho người khác',
        '5. Tôi là người biệt lắng nghe',
        '6. Tôi thích các hoạt động chăm sóc sức khỏe của bản thân và người khác',
        '7. Tôi thích các hoạt động vì mục tiêu chung của công đồng, xã hội',
        '8. Tôi mong muốn mình có thể đóng góp để xã hội tốt đẹp hơn',
        '9. Tôi có khả năng hòa giải, giải quyết những sự viêc mâu thuẫn'
      ]
    },
    {
      type: 'Enterprising (Người quản lý)',
      description: 'Những người có tính lãnh đạo và thích thuyết phục người khác',
      questions: [
        '1. Tôi là người có tính phiêu lưu, mạo hiểm',
        '2. Tôi có tính quyết đoán',
        '3. Tôi là người năng động',
        '4. Tôi có khả năng diễn đạt, tranh luận, và thuyết phục người khác',
        '5. Tôi thích các việc quản lý, đánh giá',
        '6. Tôi thường đặt ra các mục tiêu, kế hoạch trong cuộc sống',
        '7. Tôi thích gây ảnh hưởng đến người khác',
        '8. Tôi là người thích cạnh tranh, và muốn mình giỏi hơn người khác',
        '9. Tôi muốn người khác phải kính trọng, nể phục tôi'
      ]
    },
    {
      type: 'Conventional (Người quy củ)',
      description: 'Những người thích làm việc với dữ liệu và chi tiết',
      questions: [
        '1. Tôi là người có đầu óc sắp xếp, tổ chức',
        '2. Tôi có tính cẩn thận',
        '3. Tôi là người chu đáo, chính xác và đáng tin cậy',
        '4. Tôi thích công việc tính toán sổ sách, ghi chép số liệu',
        '5. Tôi thích các công việc lưu trữ, phân loại, cập nhật thông tin',
        '6. Tôi thường đặt ra những mục tiêu, kế hoạch trong cuộc sống',
        '7. Tôi thích dự kiến các khoản thu chi',
        '8. Tôi thích lập thời khóa biểu, sắp xếp lịch làm việc',
        '9. Tôi thích làm việc với các con số, làm việc theo hướng dẫn, quy trình'
      ]
    }
  ];

  const [responses, setResponses] = useState(Array(54).fill(0));
  const [mathInput, setMathInput] = useState('');
  const [incompleteGroups, setIncompleteGroups] = useState<number[]>([]);

  const handleResponseChange = (index: number, value: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleMathInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMathInput(event.target.value);
  };

  const calculateScores = () => {
    const scores = Array(6).fill(0);
    for (let i = 0; i < responses.length; i++) {
      const groupIndex = Math.floor(i / 9);
      scores[groupIndex] += responses[i];
    }
    return scores;
  };

  const isGroupComplete = (groupIndex: number): boolean => {
    const startIndex = groupIndex * 9;
    const endIndex = startIndex + 9;
    return responses.slice(startIndex, endIndex).some(value => value > 0);
  };

  const validateGroups = (): boolean => {
    const incomplete: number[] = [];
    for (let i = 0; i < 6; i++) {
      if (!isGroupComplete(i)) {
        incomplete.push(i);
      }
    }
    setIncompleteGroups(incomplete);
    return incomplete.length === 0;
  };

  const navigate = useNavigate();

  const Result = (scores: number[]) => {
    const characters = ['R', 'I', 'A', 'S', 'E', 'C'];
    const scoreWithChar = scores.map((score, index) => ({ score, char: characters[index] }));
    scoreWithChar.sort((a, b) => b.score - a.score);
    const topTwoChars = scoreWithChar.slice(0, 2).map(item => item.char);
    const resultString = `Là người thuộc nhóm ${topTwoChars[0]} và ${topTwoChars[1]}, tôi nên học ngành nào?`;
    return resultString;
  };

  const handleSubmit = async () => {
    // Check if user is logged in by looking for token or userId in localStorage
    const isLoggedIn = localStorage.getItem('token') || localStorage.getItem('UserId');

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để xem kết quả của bạn.');
      return;
    }

    if (!isFormFilled()) {
      alert('Vui lòng điền vào tất cả các trường bắt buộc trong mẫu.');
      return;
    }

    if (!validateGroups()) {
      alert('Vui lòng chọn ít nhất một câu trả lời cho mỗi nhóm tính cách.');
      return;
    }

    if (mathInput !== '4') {
      alert('Kết quả phép toán không đúng. Vui lòng nhập lại.');
      return;
    }

    const resultString = Result(calculateScores());
    // console.log('Kết quả:', resultString);
    navigate('/UserChat', { state: { resultString } });

  };

  const handleCancel = () => {
    window.location.href = '/career-guidance-test';
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Khảo sát nghề nghiệp - Phương pháp Holland</h1>
      {questionGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`mb-8 p-4 rounded-lg ${incompleteGroups.includes(groupIndex)
            ? 'border-2 border-red-500 bg-red-50'
            : isGroupComplete(groupIndex)
              ? 'border-2 border-green-500 bg-green-50'
              : 'border-2 border-gray-200'
            }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">{group.type}</h2>
            {incompleteGroups.includes(groupIndex) && (
              <span className="text-red-500 text-sm">
                Vui lòng chọn ít nhất một câu trả lời
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{group.description}</p>
          {group.questions.map((question, index) => (
            <div key={index} className="flex items-center mb-4 bg-blue-100 p-4 rounded">
              <label className="mr-5 text-lg w-1/2">{question}</label>
              <div className="flex space-x-4 w-1/2">
                {[0, 1, 2, 3, 4].map((value) => (
                  <label key={value} className="flex items-center justify-center w-1/5">
                    <input
                      type="radio"
                      name={`question-${groupIndex * 9 + index}`}
                      value={value}
                      checked={responses[groupIndex * 9 + index] === value}
                      onChange={() => handleResponseChange(groupIndex * 9 + index, value)}
                      className="mr-1"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        <label className="text-lg text-red-500">Nhập vào kết quả của phép toán này:</label>
        <div className="flex items-center">
          <span className="mr-2">6 - 2 =</span>
          <input type="text" value={mathInput} onChange={handleMathInputChange} className="border border-gray-400 p-2" />
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 ml-2">
            XEM KẾT QUẢ
          </button>
          <button onClick={handleCancel} className="bg-red-500 text-white py-2 px-4 ml-2">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerSurvey;
