import React from 'react';
import ChatWindow from './ChatWindow';
import gg_bot from '../images/gg_bot.png';

const ChatBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleBotClick = () => {
    // Logic riêng cho chức năng của bot
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center">
      {/* Bong bóng tin nhắn */}
      <div className="relative bg-white border border-green-500 p-3 rounded-lg shadow-lg mb-2">
        <p className="text-sm text-gray-800">
          Sử dụng UniVisionBot để
          <br />
          giải đáp mọi thắc mắc về
          <br />
          tuyển sinh ngành nghề
        </p>
        {/* Mũi tên của bong bóng */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
      </div>

      {/* Hình ảnh bot */}
      <img src={gg_bot} alt="Chatbot" className={`w-10 h-10 cursor-pointer ${isChatOpen ? 'mb-2' : ''}`} onClick={handleBotClick} />

      {/* Dòng chữ dưới bot (chỉ hiển thị khi chat đóng) */}
      {!isChatOpen && (
        <div className="bg-green-500 text-white p-2 font-bold flex items-center cursor-pointer" onClick={toggleChat}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          Chat tư vấn - giải đáp thắc mắc
        </div>
      )}

      {/* Khung chat (chỉ hiển thị khi chat mở) */}
      {isChatOpen && <ChatWindow toggleChat={toggleChat} />}
    </div>
  );
};

export default ChatBot;
