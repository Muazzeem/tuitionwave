
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatList from './ChatList';
import Conversation from './Conversation';
import { useAuth } from '@/contexts/AuthContext';

interface Chat {
  uid: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  unreadCount?: number;
}

interface MessagingInterfaceProps {
  onClose: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ onClose }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { userProfile } = useAuth();

  // Mock data for demonstration
  const [chats] = useState<Chat[]>([
    {
      uid: '1',
      name: 'John Smith',
      lastMessage: 'Hello, I am interested in your tutoring services',
      timestamp: '10:30 AM',
      unreadCount: 2
    },
    {
      uid: '2',
      name: 'Sarah Johnson',
      lastMessage: 'Thank you for the session today',
      timestamp: 'Yesterday',
      unreadCount: 0
    },
    {
      uid: '3',
      name: 'Mike Wilson',
      lastMessage: 'Can we schedule for tomorrow?',
      timestamp: 'Monday',
      unreadCount: 1
    }
  ]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (isMobile && selectedChat) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {selectedChat.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Conversation 
              chat={selectedChat} 
              currentUserId={userProfile?.uid || ''}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[600px] flex overflow-hidden">
        {/* Chat List */}
        <div className={`${isMobile && selectedChat ? 'hidden' : 'w-full md:w-1/3'} border-r dark:border-gray-700`}>
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat} 
            onChatSelect={handleChatSelect} 
          />
        </div>

        {/* Conversation */}
        {!isMobile && (
          <div className="flex-1">
            {selectedChat ? (
              <>
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {selectedChat.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedChat.name}</h3>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Conversation 
                  chat={selectedChat} 
                  currentUserId={userProfile?.uid || ''}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
