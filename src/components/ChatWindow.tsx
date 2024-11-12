import React, { useState } from "react";
import profile_consultant from "../images/profile_consultant.png";
import profile_user from "../images/profile_user.png";

const emojiList = ["😊", "😂", "😍", "😭", "😒", "😎", "😢", "😅", "😜", "😉", "😇", "😏", "😖", "🥰", "🤔"];

const ChatWindow: React.FC<{ toggleChat: () => void }> = ({ toggleChat }) => {
    const [showEmojis, setShowEmojis] = useState(false);
    const [message, setMessage] = useState("");

    const toggleEmojiPicker = () => {
        setShowEmojis(!showEmojis);
    };

    const addEmoji = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setShowEmojis(false); // Tự động ẩn sau khi chọn biểu tượng cảm xúc
    };

    return (
        <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center bg-green-500 p-1 text-white">
                <img src={profile_consultant} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                    <span className="block text-black">Nguyễn Hữu Quang Vinh</span>
                    <span className="text-sm">Tư vấn viên</span>
                </div>
                <button onClick={toggleChat} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 bg-gray-100 min-h-[250px] flex justify-end items-center">
                <div className="flex items-center bg-gray-200 p-2 rounded-2xl max-w-[70%]">
                    <span className="mr-2">Em cần hỗ trợ</span>
                    <img src={profile_user} alt="User" className="w-8 h-8 rounded-full" />
                </div>
            </div>

            {/* Chat Input */}
            <div className="relative flex items-center p-1 border-t">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                />
                <button onClick={toggleEmojiPicker} className="ml-2 text-2xl text-gray-500">
                    😊
                </button>
                <button className="ml-2 text-2xl text-blue-500">➤</button>

                {/* Emoji Picker */}
                {showEmojis && (
                    <div className="absolute bottom-12 left-0 bg-white shadow-lg border rounded-lg p-2 grid grid-cols-6 gap-2">
                        {emojiList.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => addEmoji(emoji)}
                                className="text-2xl hover:bg-gray-200 rounded-full p-1"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
