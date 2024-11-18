import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HubConnectionBuilder, HubConnection, HttpTransportType } from '@microsoft/signalr';
import { Camera, Video, MoreVertical, Send, Smile } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// types/chat.ts
enum StatusChatEnum {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
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
  Id: string;
  Content: string;
  ConversationId: string;
  SenderId: string;
  ReceiverId: string;
  Status: StatusChatEnum;
  Created_At: string;
}

interface ConversationWithDetails {
  id: string;
  userId: string;
  consultantId: string;
  createdAt: Date;
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

  // const selectedConversation = conversations.find(c => c.id === selectedId);

  const isMessageFromUser = (message: MessageResponse) => {
    return message.SenderId !== consultantId;
  };

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
        setConversations(prev => prev.map(conv => {
          if (conv.id === message.ConversationId) {
            return {
              ...conv,
              messages: [...(conv.messages || []), message],
              lastMessage: message.Content
            };
          }
          return conv;
        }));

        if (selectedId === message.ConversationId && shouldScroll) {
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
          setSelectedConversation({...conv, messages: data.messages});
          return { ...conv, messages: data.messages };
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
        Content: newMessage,
        ConversationId: selectedConversation.id,
        SenderId: consultantId!, // Add non-null assertion since we know consultantId exists here
        ReceiverId: selectedConversation.userId,
        Status: StatusChatEnum.SENT,
        Created_At: new Date().toISOString()
      };

      await connection.invoke("SendMessage", message);
      setNewMessage('');
    } catch (err) {
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
  }, [selectedConversation?.messages, scrollToBottom]);
  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar */}
      <div className="w-96 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img 
              src="/api/consultant/avatar" 
              alt="Consultant" 
              className="w-10 h-10 rounded-full"
            />
            <h2 className="font-semibold">Consultant Dashboard</h2>
            <p>ID của Admin: {consultantId}</p> 
          </div>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full p-2 pl-8 bg-gray-100 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-2 top-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedId === conv.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => {
                    // loadConversationHistory(conv.id)
                    setSelectedId(conv.id); 
                  }}
                >
                  <img 
                    src={conv.user.urlImage || `/api/placeholder/48/48`} 
                    alt={conv.user.fullName} 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-semibold truncate">{conv.user.fullName}</h4>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                         {conv.messages?.length > 0 ? new Date(conv.messages[conv.messages.length - 1].Created_At).toLocaleTimeString() : 'Unknown time'}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
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

      {/* Chat area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={selectedConversation.user.urlImage || `/api/placeholder/48/48`}
                alt={selectedConversation.user.fullName} 
                className="w-12 h-12 rounded-full"
              />
              <h3 className="font-semibold">{selectedConversation.user.fullName}</h3>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {selectedConversation.messages.map(msg => (
                <div 
                  key={msg.Id} 
                  className={`flex ${isMessageFromUser(msg) ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`rounded-lg p-3 max-w-[70%] ${
                      isMessageFromUser(msg) 
                        ? 'bg-white text-gray-900' 
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p>{msg.Content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-75">
                        {new Date(msg.Created_At).toLocaleTimeString()}
                      </span>
                      <span className="text-xs opacity-75">
                        {msg.Status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-3 bg-gray-100 rounded-lg focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="p-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-3 font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
export default ConsultantChat;