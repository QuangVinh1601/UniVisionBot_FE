import gg_bot from '../images/gg_bot.png'; // Đảm bảo đường dẫn ảnh đúng
import React, { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { X } from 'lucide-react';

interface ChatbotProps {
  userId?: string;
}
enum StatusChatEnum {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
}
interface UserResponse {
  id: string;
  fullName: string;
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
  // Đổi tên các property để khớp với C#
  id: string
  content: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  status: StatusChatEnum;
  created_At: string;  // Đổi thành string thay vì Date
}

interface ConversationResponse {
  id?: string;
  userId: string;
  consultantId: string;
  createdAt: Date;
  user?: UserResponse;
  messages?: MessageResponse[];
  lastMessage?: string;
}
interface ConsultantResponse {
  id: string;
}

const Chatbot: React.FC<ChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [consultant, setConsultant] = useState<ConsultantResponse | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('UserId');
  const consultantId = "675461fbf87f485f45b118a6";
  const [notifyNewMessage, setNotifyNewMessage] = useState(false);
  let audio = new Audio('/Messenger Notification Sound Effect.mp3')

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
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  const cleanup = () => {
    if (connection) {
      connection.stop();
    }
    setConnection(null);

    setError(null);
    // setIsReconnecting(false);
  };
  useEffect(() => {
    console.log('Chat window state:', { isOpen });
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setNotifyNewMessage(false);
    
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null); // Reset error state
      
        setTimeout(() => {
          scrollToBottom();
        }, 100); // Thêm một chút delay để đảm bảo messages đã được render
      

      initializeChat();
    }
    
    return () => {
      if (!isOpen) {
        // cleanup();
      }
    };
  }, [isOpen]);
 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // First check system status
      const diagnosticResponse = await fetch('https://localhost:7230/api/diagnostics/chat-status');
      if (!diagnosticResponse.ok) {
        throw new Error('System status check failed');
      }
  
      // Create or get conversation
      const response = await fetch('https://localhost:7230/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserId: currentUserId,
          consultantId: consultantId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`);
      }
      
      const conversationId = await response.text();
  
      // Get conversation history
      const historyResponse = await fetch(`https://localhost:7230/api/conversations/current/${currentUserId}/${consultantId}`);
      if (!historyResponse.ok) {
        throw new Error(`Failed to fetch history: ${historyResponse.statusText}`);
      }
      
      const conversationData: ConversationResponse = await historyResponse.json();
      setConversation(conversationData);
      setMessages(conversationData.messages || []);
      
  
      // Setup SignalR with enhanced error handling
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:7230/chatHub", {
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
          logger: {
            log: (logLevel, message) => console.log(`SignalR [${logLevel}]: ${message}`)
          }
        })
        .build();
  
      // Add connection state logging
      newConnection.onclose((error) => {
        console.error('SignalR Connection closed:', error);
        setError('Connection lost. Attempting to reconnect...');
      });
  
      newConnection.onreconnecting((error) => {
        console.warn('SignalR Reconnecting:', error);
        setIsReconnecting(true);
      });
  
      newConnection.onreconnected((connectionId) => {
        console.log('SignalR Reconnected:', connectionId);
        setIsReconnecting(false);
      });
  
      await newConnection.start();
      console.log('SignalR Connected:', newConnection.connectionId);
    
      await newConnection.invoke("JoinConversation", conversationId);
  
      newConnection.on("ReceiveMessage", (message: MessageResponse) => {
        var currentMessage = deserialize(message)

        if(currentMessage.receiverId != '675461fbf87f485f45b118a6') {
          audio.play();
        }
        
        setMessages(prev => 
          {
            var isDuplicate = prev.some(m => m.id == currentMessage.id)
            if(!isDuplicate){
              const currentIsOpen = isOpenRef.current;
              const shouldNotify = !currentIsOpen && currentMessage.senderId !== currentUserId;
              console.log('Should notify:', shouldNotify, 'isOpen:', currentIsOpen);
              if(shouldNotify){
                setNotifyNewMessage(true);
              }
              return [...prev, currentMessage]
            }
            return prev;
          });
        console.log('Received message:', currentMessage);
        scrollToBottom();
      });

      
  
      setConnection(newConnection);
    } catch (err) {
      console.error('Chat initialization error:', err);
      setError(`Failed to connect to chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      scrollToBottom();

      setIsLoading(false);
    }
  };

  
    const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newMessage.trim() || !connection || !conversation || !currentUserId) {
      console.log('Validation failed - returning early');
      return;
    }
  
    try {
      const message: MessageRequest = {
        content: newMessage,
        conversationId: conversation.id || '',
        senderId: currentUserId,
        receiverId: consultantId,
        status: StatusChatEnum.SENT,
      };
  
      console.log('Sending message:', message);
      await connection.invoke("SendMessage", message);
  
      if(!conversation.messages || conversation.messages.length === 0){ 
        console.log("New conversation detected, sending notification...");
        try {
          await connection.invoke("NotifyNewConversation", conversation.id);
          console.log("Notification sent for conversation:", conversation.id);
        } catch (error) {
          console.error("Failed to send new conversation notification:", error);
    }
    }
  setNewMessage('');
}
   catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center">
{!isOpen && (
  <div 
    className="bg-green-500 text-white p-2 font-bold flex items-center cursor-pointer hover:bg-green-600 transition-colors rounded-lg shadow-md" 
    onClick={toggleChat}
  >
    <span>Chat tư vấn - giải đáp thắc mắc</span>
    {notifyNewMessage && (
      <span className="ml-2 text-xs bg-white text-green-500 px-2 py-0.5 rounded-full animate-pulse">
        Tin nhắn mới!
      </span>
    )}
  </div>
)}

{isOpen && (
  <div className="bg-white border border-green-500 rounded-lg shadow-lg mt-2 w-96 h-[500px] overflow-hidden flex flex-col">
    {/* Header */}
    <div className="bg-green-500 text-white p-4 font-bold flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white p-1">
          <img src={gg_bot} alt="Bot" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <span className="text-lg">Tư vấn viên</span>
          <div className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-300 rounded-full"></span>
            Online
          </div>
        </div>
      </div>
      <button title='toggleChat' onClick={toggleChat} className="hover:bg-green-600 p-2 rounded-full transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Messages Area */}
    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div 
              key={message.id || `msg-${index}`}
              className={`mb-4 ${message.senderId === currentUserId ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUserId 
                  ? 'bg-green-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 shadow-md rounded-bl-none'
              }`}>
                <p className="break-words">{message.content}</p>
                <div className="text-xs mt-1 opacity-75">
                  {new Date(message.created_At).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>

    {/* Input Area */}
    <form onSubmit={sendMessage} className="border-t bg-white p-4">
      <div className="flex gap-2 items-center">
        <div className="flex-grow relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            disabled={isLoading || !!error}
            className="w-full p-3 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button title='message'
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <button
          type="submit" title='submit'
          disabled={!newMessage.trim() || isLoading || !!error}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>

    {/* Error Message */}
    {error && (
      <div className="absolute bottom-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={() => setError(null)} title='setError'
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>
    )}
  </div>
)}</div>
)};
export default Chatbot;
