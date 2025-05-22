
import React, { useState } from "react";
import { Chat } from "@/types/message";
import { Friend } from "@/types/friends";
import { MoreHorizontal, Search, Bell, Mail } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ChatListProps {
  friends: Friend[];
  pendingRequests: Friend[];
  sentRequests: Friend[];
  activeFriend: Friend | null;
  onFriendSelect: (friend: Friend) => void;
  onDeleteChat: (chatId: string) => void;
  onLoadMore: () => void;
  hasMoreFriends: boolean;
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  friends,
  pendingRequests,
  sentRequests,
  activeFriend,
  onFriendSelect,
  onDeleteChat,
  onLoadMore,
  hasMoreFriends,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  const filteredFriends = friends.filter((friend) =>
    `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderFriendItem = (friend: Friend, isActive: boolean) => {
    const displayName = friend.first_name && friend.last_name ? 
      `${friend.first_name} ${friend.last_name}` : 
      friend.email.split("@")[0];
    
    return (
      <div
        key={friend.uid}
        className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30"
            : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => onFriendSelect(friend)}
      >
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src={friend.profile_picture || ""} alt={displayName} />
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
              {friend.last_message || "Start a conversation"}
            </p>
            {friend.unread_count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                {friend.unread_count}
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
                onDeleteChat(friend.uid);
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="friends" className="flex-1">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending ({pendingRequests.length + sentRequests.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="friends" className="flex-1 mt-0">
          <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
            <div className="p-2">
              {filteredFriends.length > 0 ? (
                <>
                  {filteredFriends.map((friend) => 
                    renderFriendItem(friend, activeFriend?.uid === friend.uid)
                  )}
                  {hasMoreFriends && (
                    <div className="p-2 text-center">
                      <Button 
                        variant="outline" 
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Loading..." : "Load More"}
                      </Button>
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
        </TabsContent>

        <TabsContent value="pending" className="flex-1 mt-0">
          <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
            {pendingRequests.length > 0 && (
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Incoming Requests</h3>
                {pendingRequests.map((friend) => (
                  <div key={friend.uid} className="flex items-center p-3 mb-1 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={friend.profile_picture || ""} alt={friend.first_name} />
                      <AvatarFallback>
                        {friend.first_name?.slice(0, 2).toUpperCase() || friend.email.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">
                        {friend.first_name ? `${friend.first_name} ${friend.last_name}` : friend.email}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="default" className="text-xs py-1 h-7">Accept</Button>
                        <Button size="sm" variant="outline" className="text-xs py-1 h-7">Decline</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sentRequests.length > 0 && (
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Sent Requests</h3>
                {sentRequests.map((friend) => (
                  <div key={friend.uid} className="flex items-center p-3 mb-1 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={friend.profile_picture || ""} alt={friend.first_name} />
                      <AvatarFallback>
                        {friend.first_name?.slice(0, 2).toUpperCase() || friend.email.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">
                        {friend.first_name ? `${friend.first_name} ${friend.last_name}` : friend.email}
                      </h3>
                      <p className="text-xs text-gray-500">Request sent</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs py-1 h-7">Cancel</Button>
                  </div>
                ))}
              </div>
            )}

            {pendingRequests.length === 0 && sentRequests.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No pending requests
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatList;
