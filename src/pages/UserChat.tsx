import React, { useState, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { sendMessage, addPendingConversation, addMessage } from '../api/authApi'; // Import the sendMessage and new APIs
import AdBanner from '../components/AdBanner'; // Import AdBanner component

interface Message {
    id: number;
    content: string;
    sender: 'user' | 'consultant';
    senderId: string; // Add senderId property
    receiverId: string; // Add receiverId property
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
    const email = location.state?.email || ''; // Corrected variable name

    const role = localStorage.getItem('role'); // Get role from localStorage
    const userId = localStorage.getItem('UserId') || ''; // Get userId from localStorage and provide a default value
    const fullName = localStorage.getItem('fullName'); // Get fullName from localStorage
    console.log(role)
    console.log(userId)
    console.log(fullName)
    const handleResponse = (response: string): string => {
        // Remove lines containing links and citation patterns from the response
        let formattedResponse = response.split('\n').filter(line => !/https?:\/\/[^\s]+/.test(line) && !/\[\[\d+\]\]\([^\)]+\)/.test(line)).join('\n');
        // Format the response with line breaks
        formattedResponse = formattedResponse.replace(/\\n/g, '\n');
        return formattedResponse;
    };


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
                senderId: userId, // Add senderId for user
                receiverId: '675461fbf87f485f45b118a6', // Add receiverId for consultant
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
            {
                id: 2,
                content: handleResponse(responseMessage),
                sender: 'consultant',
                senderId: '675461fbf87f485f45b118a6', // Add senderId for consultant
                receiverId: userId, // Add receiverId for user
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }
        ],
    });
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const newMsg: Message = {
            id: conversation.messages.length + 1,
            content: newMessage,
            sender: 'user',
            senderId: userId, // Add senderId for user
            receiverId: '675461fbf87f485f45b118a6', // Add receiverId for consultant
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
        setIsLoading(true); // Set loading state to true

        try {
            // Call the sendMessage API with chatId and chatCode
            const response = await sendMessage(newMessage, chatId, chatCode);
            console.log('Message sent to consultant:', response.response);

            // Format the consultant's response
            const formattedResponse = handleResponse(response.response);

            // Add the consultant's response to the conversation
            const consultantResponse: Message = {
                id: updatedConversation.messages.length + 1,
                content: formattedResponse,
                sender: 'consultant',
                senderId: '675461fbf87f485f45b118a6', // Add senderId for consultant
                receiverId: userId, // Add receiverId for user
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setConversation(prevConversation => ({
                ...prevConversation,
                lastMessage: formattedResponse,
                time: 'Just now',
                messages: [...prevConversation.messages, consultantResponse],
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setIsLoading(false); // Set loading state to false
        }
    };

    const handleSwitchToAssistant = async () => {
        try {
            // Call the addPendingConversation API
            const pendingConversation = await addPendingConversation('pending', userId, fullName);
            // console.log('Pending conversation added:', pendingConversation);
            console.log('Pending conversation added:', pendingConversation.conversation_Id);

            // Call the addMessage API for each message in the conversation
            for (const message of conversation.messages) {
                // console.log('Pending conversation added:', pendingConversation.conversation_id);
                const addedMessage = await addMessage(pendingConversation.conversation_Id, message.content, message.senderId, message.receiverId);
                console.log('Message added:', addedMessage);
            }

            // Logic to switch to the assistant
            console.log('Switching to assistant...');
            navigate('/'); // Navigate to home page
        } catch (error) {
            console.error('Error switching to assistant:', error);
            alert('Có lỗi xảy ra khi chuyển sang trợ lý. Vui lòng thử lại.');
        }
    };

    return (
        <div className="h-screen flex flex-col max-h-screen overflow-hidden">
            <div className="flex-1 flex flex-col">
                <div className="flex flex-1">
                    <AdBanner position="left" />
                    {/* Add AdBanner on the left */}
                    <div className="flex flex-col flex-1">
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white flex items-center justify-between mt-14" >
                            <div className="flex items-center gap-3">
                                <img src={conversation.avatar} alt={conversation.consultant} className="w-10 h-10 rounded-full" />
                                <h3 className="font-medium">{conversation.consultant}</h3>
                                <button
                                    onClick={handleSwitchToAssistant}
                                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-lg"
                                >
                                    Switch
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 max-h-[78vh] overflow-y-scroll">
                            {conversation.messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'consultant' ? 'justify-start' : 'justify-end'} mb-4`}>
                                    {message.sender === 'consultant' && <img src={conversation.avatar} alt="Consultant" className="w-8 h-8 rounded-full mr-2" />}
                                    <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'consultant' ? 'bg-gray-200' : 'bg-white border'}`}>
                                        <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                                        <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                                    </div>
                                    {message.sender === 'user' && <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full ml-2" />}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <img src={conversation.avatar} alt="Consultant" className="w-8 h-8 rounded-full mr-2" />
                                    <div className="max-w-[70%] p-3 rounded-lg bg-gray-200">
                                        <p>Loading...</p>
                                    </div>
                                </div>
                            )}
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
                    <AdBanner position="right" /> {/* Add AdBanner on the right */}
                </div>
            </div>
        </div>
    );
};

export default UserChat;