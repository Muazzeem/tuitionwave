
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatList from "./ChatList";
import Conversation from "./Conversation";
import { Chat } from "@/types/message";
import { Friend } from "@/types/friends";
import FriendsService from "@/services/FriendsService";

const MessagingInterface: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  
  const { data, isLoading, fetchNextPage, hasNextPage } = useQuery({
    queryKey: ['friends', currentPage],
    queryFn: () => FriendsService.getFriends(currentPage),
    keepPreviousData: true,
  });

  const friends = useMemo(() => {
    if (!data?.results?.[0]) return [];
    return data.results[0].accepted_friends || [];
  }, [data]);

  const pendingRequests = useMemo(() => {
    if (!data?.results?.[0]) return [];
    return data.results[0].pending_requests || [];
  }, [data]);

  const sentRequests = useMemo(() => {
    if (!data?.results?.[0]) return [];
    return data.results[0].sent_requests || [];
  }, [data]);

  // Convert Friend to Chat for the Conversation component
  const activeChat = useMemo<Chat | null>(() => {
    if (!activeFriend) return null;
    
    return {
      id: activeFriend.uid,
      participants: [activeFriend.uid],
      unreadCount: activeFriend.unread_count,
      updatedAt: activeFriend.last_message_time ? new Date(activeFriend.last_message_time) : new Date(),
      name: activeFriend.first_name && activeFriend.last_name 
        ? `${activeFriend.first_name} ${activeFriend.last_name}` 
        : activeFriend.email.split("@")[0],
      avatar: activeFriend.profile_picture || "/placeholder.svg",
    };
  }, [activeFriend]);

  const handleFriendSelect = (friend: Friend) => {
    setActiveFriend(friend);
  };

  const handleDeleteChat = (friendId: string) => {
    if (activeFriend?.uid === friendId) {
      setActiveFriend(null);
    }
    // In a real implementation, we would call an API to delete the chat
    console.log("Delete chat for friend:", friendId);
  };

  const loadMoreFriends = () => {
    setCurrentPage(prev => prev + 1);
  };

  useEffect(() => {
    // Set the first friend as active by default if none is selected
    if (friends.length > 0 && !activeFriend) {
      setActiveFriend(friends[0]);
    }
  }, [friends, activeFriend]);

  return (
    <div className="flex h-full">
      {/* Chat list sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ChatList
          friends={friends}
          pendingRequests={pendingRequests}
          sentRequests={sentRequests}
          activeFriend={activeFriend}
          onFriendSelect={handleFriendSelect}
          onDeleteChat={handleDeleteChat}
          onLoadMore={loadMoreFriends}
          hasMoreFriends={!!data?.next}
          isLoading={isLoading}
        />
      </div>

      {/* Conversation area */}
      <div className="w-2/3 bg-gray-50 dark:bg-gray-900">
        {activeChat ? (
          <Conversation
            chat={activeChat}
            onDeleteChat={() => handleDeleteChat(activeChat.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
