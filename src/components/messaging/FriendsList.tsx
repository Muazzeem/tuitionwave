
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Friend } from '@/types/friends';
import { format, isToday, isYesterday } from 'date-fns';
import { Search, Settings, MessageCircle, Users } from 'lucide-react';

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
    <Card className="w-full md:w-80 lg:w-96 h-full bg-background border-r flex flex-col shadow-sm dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Messages</h1>
              <p className="text-xs text-muted-foreground">{friends.length} conversations</p>
            </div>
          </div>
        </div>
        
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background border-input focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all duration-200"
          />
        </div> */}
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto dark:bg-gray-900">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">Loading conversations...</p>
          </div>
        ) : sortedFriends.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No conversations found</p>
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedFriends.map((friend) => {
              const isActive = selectedFriend?.friend.id === friend.friend.id;
              const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
              const lastMessageText = friend.last_message?.text || 'Start a conversation';
              const lastMessageTime = friend.last_message_time ? formatMessageTime(friend.last_message_time) : '';
              const isFromMe = friend.last_message?.is_from_me || false;
              const hasUnread = friend.unread_messages_count > 0;

              return (
                <div
                  key={friend.friend.id}
                  className={`group flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50 relative ${
                    isActive ? 'bg-primary/5 border-r-2 border-primary' : ''
                  }`}
                  onClick={() => onFriendSelect(friend)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}

                  <div className="relative flex-shrink-0">
                    <Avatar className={`h-12 w-12 ring-2 transition-all duration-200 ${
                      isActive ? 'ring-primary/20' : 'ring-border group-hover:ring-primary/10'
                    }`}>
                      <AvatarImage src="" alt={displayName} />
                      <AvatarFallback className={`text-sm font-medium transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                  </div>

                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium truncate transition-colors ${
                        isActive ? 'text-primary' : hasUnread ? 'text-foreground' : 'text-foreground/90'
                      }`}>
                        {displayName}
                      </h3>
                      {lastMessageTime && (
                        <span className={`text-xs flex-shrink-0 ml-2 transition-colors ${
                          hasUnread ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}>
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate transition-colors ${
                          hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
                        }`}>
                          {isFromMe && lastMessageText !== 'Start a conversation' && (
                            <span className="text-muted-foreground mr-1">You: </span>
                          )}
                          {lastMessageText}
                        </p>
                      </div>
                      {hasUnread && (
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 animate-pulse">
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
    </Card>
  );
};

export default FriendsList;
