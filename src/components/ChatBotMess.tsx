import React, { useState } from "react";

interface ChatSession {
  id: number;
  messages: { sender: string; text: string }[];
}

const ChatBot: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 1,
      messages: [
        { sender: "bot", text: "Chào mừng bạn đến với UNI VISION BOT!" },
        { sender: "user", text: "Cảm ơn! Hãy cho tôi biết về ngành y tế." },
        { sender: "bot", text: "Ngành y tế bao gồm các ngành: Y khoa, Điều dưỡng, Dược, Răng hàm mặt,...." },
      ],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const createNewChat = () => {
    const newChatId = chats.length + 1;
    setChats([...chats, { id: newChatId, messages: [] }]);
    setActiveChatId(newChatId);
  };

  const sendMessage = () => {
    if (input.trim() && activeChat) {
      const updatedChats = chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, { sender: "user", text: input }] }
          : chat
      );
      setChats(updatedChats);
      setInput("");
    }
  };

  const showChatHistory = (id: number) => {
    setActiveChatId(id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-green-600 text-white flex flex-col p-2 overflow-hidden transition-all duration-300`}
      >
        <div className="flex items-center mb-6">
          <button
            className="text-3xl border p-0.5 rounded-md bg-white text-green-600 w-11"
            onClick={toggleSidebar}
          >
            &#9776;
          </button>
          {isSidebarOpen && <h1 className="text-2xl ml-4 font-bold">UNI VISION BOT</h1>}
        </div>
        {isSidebarOpen && (
          <>
            <button
              className="py-3 px-4 mb-4 bg-white text-green-600 rounded-md hover:bg-green-500 hover:text-white"
              onClick={createNewChat}
            >
              Tạo mới
            </button>
            <div>
              <h2 className="text-xl mb-2 font-bold">Lịch sử</h2>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`py-3 px-4 mb-2 text-left w-full rounded-md ${
                    chat.id === activeChatId ? "bg-green-500 text-white" : "bg-white text-green-600"
                  } hover:bg-green-500 hover:text-white`}
                  onClick={() => showChatHistory(chat.id)}
                >
                  Lịch sử chat {chat.id}
                </button>
              ))}
            </div>
            <div className="mt-auto flex items-center p-3 bg-green-700 rounded-md">
              <img src="https://via.placeholder.com/40" alt="User" className="rounded-full" />
              <div className="ml-3">
                <p>Xin chào,</p>
                <p className="font-bold">Quang Vinh</p>
              </div>
              <button className="ml-auto text-white">▼</button>
            </div>
          </>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="text-2xl font-bold">UNI VISION BOT</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {activeChat?.messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                  🤖
                </div>
              )}
              <div
                className={`max-w-md p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-green-500 text-white"
                    : "bg-white text-black border"
                }`}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center ml-3">
                  👤
                </div>
              )}
            </div>
          ))}
          {activeChat?.messages.length === 0 && (
            <p className="text-gray-500 text-center">Bắt đầu một cuộc trò chuyện mới...</p>
          )}
        </div>
        <div className="p-4 bg-white border-t flex items-center">
          <input
            type="text"
            className="flex-1 border rounded-md p-2 mr-4"
            placeholder="Nhập tin nhắn ở đây..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
