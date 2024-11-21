import React, { useState, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { sendMessage } from '../api/authApi'; // Import the sendMessage API

interface Message {
    id: number;
    content: string;
    sender: 'user' | 'consultant';
    time: string;
}

interface Conversation {
    id: number;
    consultant: string;
    lastMessage: string;
    time: string;
    avatar: string;
    messages: Message[];
}

const UserChat = () => {
    const location = useLocation();
    const responseMessage = location.state?.responseMessage || '';
    const chatId = location.state?.chatId || '';
    const chatCode = location.state?.chatCode || '';
    const resultString = location.state?.resultString || '';

    console.log('Chat ID:', chatId);
    console.log('Chat Code:', chatCode);
    console.log('Result String:', resultString);
    console.log('Response Message:', responseMessage);

    const [conversation, setConversation] = useState<Conversation>({
        id: 1,
        consultant: 'Hữu Hoà',
        lastMessage: 'Chào em, chị có thể giúp gì cho mình nhỉ?',
        time: '5s',
        avatar: '/api/placeholder/40/40',
        messages: [
            {
                id: 1,
                content: resultString,
                sender: 'user',
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
            {
                id: 2,
                content: responseMessage,
                sender: 'consultant',
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }
        ],
    });
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const newMsg: Message = {
            id: conversation.messages.length + 1,
            content: newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        const updatedConversation = {
            ...conversation,
            lastMessage: newMessage,
            time: 'Just now',
            messages: [...conversation.messages, newMsg],
        };

        setConversation(updatedConversation);
        setNewMessage('');

        try {
            // Call the sendMessage API with chatId and chatCode
            const response = await sendMessage(newMessage, chatId, chatCode);
            console.log('Message sent to consultant:', response.response);

            // Add the consultant's response to the conversation
            const consultantResponse: Message = {
                id: updatedConversation.messages.length + 1,
                content: response.response,
                sender: 'consultant',
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setConversation(prevConversation => ({
                ...prevConversation,
                lastMessage: response.response,
                time: 'Just now',
                messages: [...prevConversation.messages, consultantResponse],
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={conversation.avatar} alt={conversation.consultant} className="w-10 h-10 rounded-full" />
                        <h3 className="font-medium">{conversation.consultant}</h3>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {conversation.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'consultant' ? 'justify-start' : 'justify-end'} mb-4`}>
                            {message.sender === 'consultant' && <img src={conversation.avatar} alt="Consultant" className="w-8 h-8 rounded-full mr-2" />}
                            <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'consultant' ? 'bg-gray-200' : 'bg-white border'}`}>
                                <p>{message.content}</p>
                                <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                            </div>
                            {message.sender === 'user' && <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full ml-2" />}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-3">
                        <Smile className="h-6 w-6 text-gray-400 cursor-pointer" />
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 p-2 border rounded-lg"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Send className="h-6 w-6 text-green-500 cursor-pointer" onClick={handleSendMessage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserChat;