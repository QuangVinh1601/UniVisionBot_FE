import React, { useState, useEffect } from 'react';
import { Search, Video, Phone, MoreVertical, Send, Smile } from 'lucide-react';


interface Message {
  id: number;
  content: string;
  sender: 'user' | 'consultant';
  time: string;
}

interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
  time: string;
  avatar: string;
  messages: Message[];
}

const ConsultantChat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      user: 'Hữu Hoà',
      lastMessage: 'Chào em, chị có thể giúp gì cho mình nhỉ?',
      time: '5s',
      avatar: '/api/placeholder/40/40',
      messages: [
        {
          id: 1,
          content: 'Xin chào chị',
          sender: 'user',
          time: '3:35 PM'
        },
        {
          id: 2,
          content: 'Chào em, chị có thể giúp gì cho mình nhỉ?',
          sender: 'consultant',
          time: '3:36 PM'
        }
      ]
    },
    {
      id: 2,
      user: 'Đoàn Đại',
      lastMessage: 'Chào em, không biết mình có thắc mắc gì hả?',
      time: '5m',
      avatar: '/api/placeholder/40/40',
      messages: [
        {
          id: 1,
          content: 'Em chào chị ạ',
          sender: 'user',
          time: '3:30 PM'
        },
        {
          id: 2,
          content: 'Chào em, không biết mình có thắc mắc gì hả?',
          sender: 'consultant',
          time: '3:31 PM'
        }
      ]
    },
    {
      id: 3,
      user: 'Hồ Giang',
      lastMessage: 'Chào em, mình đang có thắc mắc gì cần chị giải đáp không nhỉ?',
      time: '1h',
      avatar: '/api/placeholder/40/40',
      messages: [
        {
          id: 1,
          content: 'Xin chào chị',
          sender: 'user',
          time: '3:37 PM'
        },
        {
          id: 2,
          content: 'Chào em, mình đang có thắc mắc gì cần chị giải đáp không nhỉ?',
          sender: 'consultant',
          time: '3:38 PM'
        }
      ]
    }
  ]);

  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Hàm chuẩn hóa chuỗi tiếng Việt (bỏ dấu)
  const removeVietnameseTones = (str: string): string => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  };

  // Set initial current conversation and filtered conversations
  useEffect(() => {
    setCurrentConversation(conversations[0]);
    setFilteredConversations(conversations);
  }, [conversations]);

  // Handle search functionality - now with Vietnamese name support
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const normalizedSearchQuery = removeVietnameseTones(searchQuery.toLowerCase());
    
    const filtered = conversations.filter(conversation => {
      const normalizedName = removeVietnameseTones(conversation.user.toLowerCase());
      return normalizedName.includes(normalizedSearchQuery);
    });
    
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleConversationClick = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: currentConversation!.messages.length + 1,
      content: newMessage,
      sender: 'consultant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversation!.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          time: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setCurrentConversation(updatedConversations.find(c => c.id === currentConversation!.id)!);
    setNewMessage('');
  };


  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white flex flex-col">
          <div className="p-4 flex items-center gap-3">
            <img src="/api/placeholder/48/48" alt="Profile" className="rounded-full" />
            <div>
              <h3 className="font-medium">Nguyễn Hữu Quang Vinh</h3>
            </div>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                    currentConversation?.id === conversation.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex gap-3">
                    <img src={conversation.avatar} alt={conversation.user} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <h4 className="font-medium">{conversation.user}</h4>
                      <p className="text-sm text-gray-600">{conversation.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">{conversation.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {currentConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={currentConversation.avatar} alt={currentConversation.user} className="w-10 h-10 rounded-full" />
                <h3 className="font-medium">{currentConversation.user}</h3>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-green-500 cursor-pointer" />
                <Video className="h-6 w-6 text-green-500 cursor-pointer" />
                <MoreVertical className="h-6 w-6 text-gray-500 cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {currentConversation.messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'consultant' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {message.sender === 'user' && (
                    <img src={currentConversation.avatar} alt="User" className="w-8 h-8 rounded-full mr-2" />
                  )}
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'consultant' 
                      ? 'bg-gray-200' 
                      : 'bg-white border'
                  }`}>
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                  </div>
                  {message.sender === 'consultant' && (
                    <img src="/api/placeholder/32/32" alt="Consultant" className="w-8 h-8 rounded-full ml-2" />
                  )}
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
                <Send 
                  className="h-6 w-6 text-green-500 cursor-pointer" 
                  onClick={handleSendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantChat;