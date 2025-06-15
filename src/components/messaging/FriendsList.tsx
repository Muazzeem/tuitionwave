
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Friend } from '@/types/friends';
import { format, isToday, isYesterday } from 'date-fns';
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
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort friends by last message time (most recent first)
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
    const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="w-80 bg-white border-r flex flex-col h-full dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        ) : sortedFriends.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No conversations found</p>
            <p className="text-gray-400 text-sm mt-1">Start a new conversation to get started</p>
          </div>
        ) : (
          <div className="py-2">
            {sortedFriends.map((friend) => {
              const isActive = selectedFriend?.friend.id === friend.friend.id;
              const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
              const lastMessageText = friend.last_message?.text || 'Start a conversation';
              const lastMessageTime = friend.last_message_time ? formatMessageTime(friend.last_message_time) : '';
              const isFromMe = friend.last_message?.is_from_me || false;

              return (
                <div
                  key={friend.friend.id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-blue-50 border-r-3 border-blue-500 dark:bg-gray-900' : ''
                  }`}
                  onClick={() => onFriendSelect(friend)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                      <AvatarImage src="" alt={displayName} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                  </div>

                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium truncate ${isActive ? 'text-blue-700 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                        {displayName}
                      </h3>
                      {lastMessageTime && (
                        <span className={`text-xs flex-shrink-0 ml-2 ${
                          friend.unread_messages_count > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}>
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${
                        friend.unread_messages_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {isFromMe && lastMessageText !== 'Start a conversation' && (
                          <span className="text-gray-400 mr-1">You: </span>
                        )}
                        {lastMessageText}
                      </p>
                      {friend.unread_messages_count > 0 && (
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                          {friend.unread_messages_count > 99 ? '99+' : friend.unread_messages_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
