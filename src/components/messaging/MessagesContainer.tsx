
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { format } from 'date-fns';
import EmptyState from './EmptyState';

interface Message {
  id: number;
  text: string;
  attachment?: string | null;
  sent_at: string;
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  is_read: boolean;
}

interface MessagesContainerProps {
  messages: Message[];
  userEmail: string;
  isLoading?: boolean;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  messages, 
  userEmail, 
  isLoading = false 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const shouldShowAvatar = (message: Message, index: number) => {
    if (message.sender_email === userEmail) return false;
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return prevMessage.sender_email !== message.sender_email;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 dark:bg-gray-800"
    >
      {isLoading && (
        <div className="text-center mb-4">
          <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm inline-block">
            Loading messages...
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="text-center mb-6">
          <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm inline-block">
            {formatMessageTime(messages[0]?.sent_at)}
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.sender_email === userEmail}
          showAvatar={shouldShowAvatar(message, index)}
        />
      ))}

      <div ref={messagesEndRef} />

      {(messages.length === 0 &&
        <EmptyState />
      )}
    </div>
  );
};

export default MessagesContainer;
