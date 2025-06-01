import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import { Message, Chat } from '@/types/message';
import { getAccessToken } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { WebSocketService } from '@/services/WebSocketService';

interface ConversationProps {
  chat: Chat;
  onBack: () => void;
}

const Conversation: React.FC<ConversationProps> = ({ chat, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuth();
  const wsService = WebSocketService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chat.conversation_id) {
      fetchMessages();
      connectToWebSocket();
    }

    return () => {
      wsService.disconnect();
    };
  }, [chat.conversation_id]);

  const connectToWebSocket = () => {
    if (chat.conversation_id) {
      wsService.connect(chat.conversation_id, (message: Message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  };

  const fetchMessages = async () => {
    if (!chat.conversation_id) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/conversations/${chat.conversation_id}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userProfile?.id) return;

    const messageData = {
      type: 'chat_message',
      message: newMessage.trim(),
      user_id: userProfile.id.toString()
    };

    wsService.sendMessage(messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.sent_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const isToday = (date: string) => {
    return date === new Date().toDateString();
  };

  const isYesterday = (date: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date === yesterday.toDateString();
  };

  const formatDate = (date: string) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return new Date(date).toLocaleDateString();
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white dark:bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-3"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {chat.friend.full_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {chat.friend.email}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-500">Loading messages...</div>
        )}
        
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                {formatDate(date)}
              </span>
            </div>
            
            {dateMessages.map((message, index) => {
              const isOwnMessage = message.sender_id === userProfile?.id?.toString();
              const showAvatar = index === 0 || dateMessages[index - 1].sender_id !== message.sender_id;
              
              return (
                <div
                  key={`${message.id || index}-${message.sent_at}`}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    {showAvatar && !isOwnMessage && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
                        {chat.friend.full_name}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.sent_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
