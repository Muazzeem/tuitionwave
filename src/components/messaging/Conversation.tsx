import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Chat, Message } from '@/types/message';
import WebSocketService from '@/services/WebSocketService';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface ConversationProps {
  chat: Chat;
  onDeleteChat: () => void;
}

const Conversation: React.FC<ConversationProps> = ({ chat, onDeleteChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chat.conversationId || !profile?.uid) return;

    // Connect to WebSocket
    WebSocketService.connect(
      chat.conversationId,
      (message) => {
        setMessages(prev => [...prev, message]);
      },
      () => setIsConnected(true),
      () => setIsConnected(false)
    );

    return () => {
      WebSocketService.disconnect();
    };
  }, [chat.conversationId, profile?.uid]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !profile?.uid || !isConnected) return;

    const messageData = {
      type: 'chat_message',
      message: newMessage,
      user_id: profile.uid
    };

    WebSocketService.sendMessage(messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwnMessage = message.sender_id === profile?.uid;
    const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1].sender_id !== message.sender_id);

    return (
      <div
        key={`${message.sent_at}-${index}`}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isOwnMessage && showAvatar && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        {!isOwnMessage && !showAvatar && <div className="w-10 mr-2" />}

        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm">{message.message}</p>
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{chat.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? 'Online' : 'Connecting...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onDeleteChat} className="text-red-500">
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender_id === profile?.uid;
              const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1].sender_id !== message.sender_id);
              
              return (
                <div
                  key={`${message.sent_at}-${index}`}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {!isOwnMessage && showAvatar && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  {!isOwnMessage && !showAvatar && <div className="w-10 mr-2" />}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
