
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatList from './ChatList';
import Conversation from './Conversation';
import { useAuth } from '@/contexts/AuthContext';
import { Friend } from '@/types/friends';
import FriendsService from '@/services/FriendsService';

interface MessagingInterfaceProps {
  onClose?: () => void;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ onClose }) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const response = await FriendsService.getFriends();
        setFriends(response.accepted_friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleBackToList = () => {
    setSelectedFriend(null);
  };

  const handleDeleteChat = (friendId: string) => {
    // Implement delete chat functionality
    console.log('Delete chat for friend:', friendId);
  };

  const handleLoadMore = () => {
    // Implement load more functionality if needed
    console.log('Load more friends');
  };

  if (isMobile && selectedFriend) {
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
                  {selectedFriend.friend.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{selectedFriend.friend.full_name}</h3>
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
              chat={selectedFriend} 
              currentUserId={userProfile?.id?.toString() || ''}
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
        <div className={`${isMobile && selectedFriend ? 'hidden' : 'w-full md:w-1/3'} border-r dark:border-gray-700`}>
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
          <ChatList 
            friends={friends}
            activeFriend={selectedFriend}
            onFriendSelect={handleFriendSelect}
            onDeleteChat={handleDeleteChat}
            onLoadMore={handleLoadMore}
            hasMoreFriends={false}
            isLoading={isLoading}
          />
        </div>

        {/* Conversation */}
        {!isMobile && (
          <div className="flex-1">
            {selectedFriend ? (
              <>
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {selectedFriend.friend.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedFriend.friend.full_name}</h3>
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
                  chat={selectedFriend} 
                  currentUserId={userProfile?.id?.toString() || ''}
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
