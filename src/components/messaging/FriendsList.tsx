
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Friend } from '@/types/friends';
import { format } from 'date-fns';
import { Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FriendsListProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFriendSelect: (friend: Friend) => void;
  isLoading: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  selectedFriend,
  searchQuery,
  onSearchChange,
  onFriendSelect,
  isLoading
}) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const filteredFriends = friends.filter(friend =>
    friend.friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : filteredFriends.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations found</div>
        ) : (
          filteredFriends.map((friend) => {
            const isActive = selectedFriend?.friend.uid === friend.friend.uid;
            const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
            const lastMessageText = friend.last_message?.text || 'Start a conversation';
            const lastMessageTime = friend.last_message_time ? formatTime(friend.last_message_time) : '';

            return (
              <div
                key={friend.friend.uid}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => onFriendSelect(friend)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={displayName} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {displayName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {lastMessageTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessageText}
                    </p>
                    {friend.unread_messages_count > 0 && (
                      <Badge variant="default" className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {friend.unread_messages_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FriendsList;
