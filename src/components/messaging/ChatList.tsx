
import React, { useState, useEffect, useCallback } from "react";
import { Friend } from "@/types/friends";
import { MoreHorizontal, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ChatListProps {
  friends: Friend[];
  activeFriend: Friend | null;
  onFriendSelect: (friend: Friend) => void;
  onDeleteChat: (friendId: string) => void;
  onLoadMore: () => void;
  hasMoreFriends: boolean;
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  friends = [], // Add default empty array to prevent undefined
  activeFriend,
  onFriendSelect,
  onDeleteChat,
  onLoadMore,
  hasMoreFriends,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Add safety check to ensure friends is an array before filtering
  const filteredFriends = (friends || []).filter((friend) =>
    friend.friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Infinity scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMoreFriends && !isLoading) {
      onLoadMore();
    }
  }, [hasMoreFriends, isLoading, onLoadMore]);

  const renderFriendItem = (friend: Friend, isActive: boolean) => {
    const displayName = friend.friend.full_name || friend.friend.email.split("@")[0];
    const lastMessageText = friend.last_message?.text || "Start a conversation";
    
    return (
      <div
        key={friend.friend.id}
        className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30"
            : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => onFriendSelect(friend)}
      >
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src="" alt={displayName} />
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {friend.last_message_time ? format(new Date(friend.last_message_time), "HH:mm") : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {lastMessageText}
            </p>
            {friend.unread_messages_count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                {friend.unread_messages_count}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(friend.friend.id.toString());
              }}
            >
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-3 dark:text-white">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 w-full"
            placeholder="Search friends"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <ScrollArea className="flex-1" onScrollCapture={handleScroll}>
        <div className="p-2">
          {filteredFriends.length > 0 ? (
            <>
              {filteredFriends.map((friend) => 
                renderFriendItem(friend, activeFriend?.friend.id === friend.friend.id)
              )}
              {isLoading && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Loading more friends...
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? "No friends found" : "No friends yet"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
