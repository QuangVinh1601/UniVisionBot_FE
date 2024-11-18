import gg_bot from '../images/gg_bot.png'; // Đảm bảo đường dẫn ảnh đúng
import React, { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

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
  Content: string;
  ConversationId: string;
  SenderId: string;
  ReceiverId: string;
  Status: StatusChatEnum;
  Created_At: string;  // Đổi thành string thay vì Date
}
interface MessageResponse {
  // Đổi tên các property để khớp với C#
  Id: string
  Content: string;
  ConversationId: string;
  SenderId: string;
  ReceiverId: string;
  Status: StatusChatEnum;
  Created_At: string;  // Đổi thành string thay vì Date
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

const Chatbot: React.FC<ChatbotProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [consultant, setConsultant] = useState<ConsultantResponse | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = userId;
  const consultantId = "672214299c167656b2dc0d5e";

  const cleanup = () => {
    if (connection) {
      connection.stop();
    }
    setConnection(null);

    setError(null);
    setIsReconnecting(false);
  };

  const toggleChat = () => {
    if (isOpen) {
      cleanup();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null); // Reset error state
      initializeChat();
    }
    
    return () => {
      if (!isOpen) {
        cleanup();
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
      const historyResponse = await fetch(`https://localhost:7230/api/conversations/current/${currentUserId}`);
      if (!historyResponse.ok) {
        throw new Error(`Failed to fetch history: ${historyResponse.statusText}`);
      }
      
      const conversationData: ConversationResponse = await historyResponse.json();
      setConversation(conversationData);
      if (!messages.length) {
        setMessages(conversationData.messages || []);
      }
  
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
    
   
      await newConnection.invoke("JoinConversation", conversationId);
  
      newConnection.on("ReceiveMessage", (message: MessageResponse) => {
        setMessages(prev => [...prev, message]);
        console.log('Received message:', message);
        scrollToBottom();
      });
  
      setConnection(newConnection);
    } catch (err) {
      console.error('Chat initialization error:', err);
      setError(`Failed to connect to chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
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
        Content: newMessage.trim(),
        ConversationId: conversation.id || '',
        SenderId: currentUserId,
        ReceiverId: consultantId,
        Status: StatusChatEnum.SENT,
        Created_At: new Date().toISOString(),
      };
  
      console.log('Sending message:', message);
      await connection.invoke("SendMessage", message);
  
      // Xóa dòng dưới, chỉ cập nhật state qua sự kiện ReceiveMessage
      // setMessages(prev => [...prev, message]);
  
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center">
      {/* Bong bóng tin nhắn */}
      <div className="relative bg-white border border-green-500 p-3 rounded-lg shadow-lg mb-2">
        <p className="text-sm text-gray-800">
          Sử dụng UniVisionBot để 
          <br />giải đáp mọi thắc mắc về
          <br />tuyển sinh ngành nghề
        </p>
        {/* Mũi tên của bong bóng */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
      </div>

      {/* Hình ảnh bot */}
      <img src={gg_bot} alt="Chatbot" className={`w-10 h-10 cursor-pointer ${isOpen ? 'mb-2' : ''}`} onClick={toggleChat} />
      <button 
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close Chat' : 'Chat with Consultant'}
      </button>
      {!isOpen && (
        <div className="bg-green-500 text-white p-2 font-bold flex items-center cursor-pointer" onClick={toggleChat}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Chat tư vấn - giải đáp thắc mắc
        </div>
      )}

      {isOpen && (
        <div className="bg-white border border-green-500 rounded-lg shadow-lg mt-2 w-64 h-80 overflow-hidden flex flex-col">
          <div className="bg-green-500 text-white p-2 font-bold flex justify-between items-center">
          <span>UniVisionBot</span>
          <button onClick={toggleChat} className="text-white">&times;</button>
          </div>

          <div className="flex-grow p-2 overflow-y-auto">
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <>
{messages.map((message, index) => (
  <div 
    key={message.Id || `msg-${index}`} // Prefer unique message ID if available
    className={`message ${message.SenderId === currentUserId ? 'sent' : 'received'}`}
  >
    {message.Content}
  </div>
))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading || !!error}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading || !!error}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>  
          </form>
          {error && (
            <div className="p-3 bg-red-100 border-t border-red-200 text-red-700 text-sm">
              {error}
              <button 
                onClick={() => setError(null)}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
