import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HubConnectionBuilder, HubConnection, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { Camera, Video, MoreVertical, Send, Smile, Loader2, CheckCheck, Search, Clock, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { deserialize, Deserializer } from 'v8';

// types/chat.ts
enum StatusChatEnum {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
}
interface MessageRequest {
  // Đổi tên các property để khớp với C#
  content: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  status: StatusChatEnum;
}
interface MessageResponse {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  status: StatusChatEnum;
  created_At: string;
}

interface ConversationWithDetails {
  id: string;
  userId: string;
  consultantId: string;
  created_At: string;
  user: {
    fullName: string;
    urlImage?: string;
  };
  messages: MessageResponse[];
  lastMessage?: string;
}

// ConsultantChat.tsx
const ConsultantChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldScroll, setShouldScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consultantId = localStorage.getItem('UserId');
  const [messageUpdate, setMessageUpdate] = useState(0);

  // const selectedConversation = conversations.find(c => c.id === selectedId);

  const isMessageFromUser = (message: MessageResponse) => {
    return message.senderId !== consultantId;
  };
  function deserialize(message: any): MessageResponse {
    return {
      id: message.Id,
      content: message.Content,
      conversationId: message.ConversationId,
      senderId: message.SenderId,
      receiverId: message.ReceiverId,
      status: message.Status,
      created_At: message.Created_At,
    };
  }
  const filteredConversations = conversations.filter(conv => 
    conv.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log('ConsultantChat mounted with consultantId:', consultantId);
    if (!consultantId) {
      setError('Missing consultant ID');
      return;
    }
    initializeHub();
  }, []);


  const initializeHub = async () => {
    try {

      console.log('Starting initializeHub with consultantId:', consultantId);
    
    // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = `https://localhost:7230/api/conversations/${consultantId}`;
      console.log('Making API call to:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Thêm credentials nếu cần thiết
      });
      
      console.log(response);
      // Log response status và headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      
      if (!response.ok) {
        const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      
      const conversationsData = await response.json();
      console.log('Received conversations:', conversationsData);
      setConversations(conversationsData);
      console.log("13oru32ir");
      setIsLoading(false);
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:7230/chatHub", {
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
          logger: {
            log: (logLevel, message) => console.log(`SignalR [${logLevel}]: ${message}`)
          }
        })
        .build();

      await newConnection.start();

      for (const conv of conversationsData) {
        await newConnection.invoke("JoinConversation", conv.id);
      }

      newConnection.on("ReceiveMessage", (message: MessageResponse) => {
        console.log("Received new message:", message);
        var currentMessage = deserialize(message)
        setConversations(prev => {
          console.log("Previous conversations:", prev);
          const newConversations = prev.map(conv => {
            if (conv.id === currentMessage.conversationId) {
              console.log("Updating conversation:", conv.id);
              // Kiểm tra xem tin nhắn đã tồn tại chưa
              const isDuplicate = conv.messages.some(msg => msg.id === currentMessage.id);
              
              if (!isDuplicate) {
                return {
                  ...conv,
                  messages: [...conv.messages, currentMessage],
                  lastMessage: currentMessage.content
                };
              }
              return conv; // Nếu là tin nhắn trùng lặp, giữ nguyên conversation - lap 2 lan nen 
            }
            return conv;
          });
          console.log("New conversations:", newConversations);
          return newConversations;
        });

        setSelectedConversation(prev => {
          if (prev && prev.id === currentMessage.conversationId) {
            console.log("Updating selectedConversation");
            // Kiểm tra tin nhắn trùng lặp
            const isDuplicate = prev.messages.some(msg => msg.id === currentMessage.id);
            
            if (!isDuplicate) {
              return {
                ...prev,
                messages: [...prev.messages, currentMessage],
                lastMessage: currentMessage.content
              };
            }
            return prev; // Nếu là tin nhắn trùng lặp, giữ nguyên state
          }
          return prev;
        });

        setMessageUpdate(prev => prev + 1);

        if (selectedId === currentMessage.conversationId && shouldScroll) {
          scrollToBottom();
        }
      });

      setConnection(newConnection);
    } catch (err) {
      console.error('Error in initializeHub:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to chat hub');
    } finally {
      console.log(conversations);
      setIsLoading(false);
    }
  };

  const loadConversationHistory = async (conversationId: string): Promise<void> => {
    try {
      const response = await fetch(`https://localhost:7230/api/conversations/history/${conversationId}`);
      const data = await response.json();
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const formattedMessages = data.messages.map((message: MessageResponse) => ({
            ...message,
            created_At: new Date(message.created_At).toISOString()
          }));
          setSelectedConversation({...conv, messages: formattedMessages});
          return { 
            ...conv,
            messages: formattedMessages,
            created_At: new Date(conv.created_At).toISOString()
          };
        }
        return conv;
      }));
       
    } catch (err) {
      setError('Failed to load conversation history');
    }
  };

  useEffect(() => {
    if (selectedId) {
      loadConversationHistory(selectedId);
      
    }
  }, [selectedId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connection || !selectedConversation) return;

    try {
      const message: MessageRequest = {
        content: newMessage,
        conversationId: selectedConversation.id,
        senderId: consultantId!,
        receiverId: selectedConversation.userId,
        status: StatusChatEnum.SENT,
      };
      console.log("Sending message:", message);

      // Gửi tin nhắn và đợi response
      const response = await connection.invoke("SendMessage", message);
      console.log("Server response:", response);

      // Nếu server trả về response là tin nhắn mới
      // if (response) {
      //   // Cập nhật conversations
      //   setConversations(prev => prev.map(conv => {
      //     if (conv.id === selectedConversation.id) {
      //       console.log("Updating conversation:", conv.id);
      //       return {
      //         ...conv,
      //         messages: [...conv.messages, response],
      //         lastMessage: response.content
      //       };
      //     }
      //     return conv;
      //   }));

      //   // Cập nhật selectedConversation
      //   setSelectedConversation(prev => {
      //     if (prev) {
      //       console.log("Updating selectedConversation");
      //       return {
      //         ...prev,
      //         messages: [...prev.messages, response],
      //         lastMessage: response.content
      //       };
      //     }
      //     return prev;
      //   });

      //   // Force re-render
      //   setMessageUpdate(prev => prev + 1);
      // }
      
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }
  };

  const scrollToBottom = useCallback(() => {
    if (!shouldScroll) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shouldScroll]);

  useEffect(() => {
    if (selectedConversation?.messages?.length) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages, scrollToBottom, messageUpdate]);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/api/consultant/avatar" 
                alt="Consultant" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Consultant Dashboard</h2>
              <p className="text-sm text-gray-500">ID: {consultantId}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all
                    ${selectedId === conv.id 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-gray-50'
                    }`}
                  onClick={() => setSelectedId(conv.id)}
                >
                  <div className="relative">
                    <img 
                      src={conv.user.urlImage || `/api/placeholder/48/48`} 
                      alt={conv.user.fullName} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900 truncate">{conv.user.fullName}</h4>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          { new Date(conv.created_At).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white shadow-sm border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={selectedConversation.user.urlImage || `/api/placeholder/48/48`}
                      alt={selectedConversation.user.fullName} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.user.fullName}</h3>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${isMessageFromUser(msg) ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      isMessageFromUser(msg)
                        ? 'bg-white text-gray-800 shadow-sm' 
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${isMessageFromUser(msg) ? 'text-gray-500' : 'text-green-100'}`}>
                        {new Date(msg.created_At).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {!isMessageFromUser(msg) && (
                        <CheckCheck className="w-4 h-4 text-green-100" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-6 py-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <button  title='Video'
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <User className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-4 max-w-md animate-slideIn">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ConsultantChat;