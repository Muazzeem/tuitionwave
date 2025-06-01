
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatList from "./ChatList";
import Conversation from "./Conversation";
import { Chat } from "@/types/message";
import { Friend } from "@/types/friends";
import FriendsService from "@/services/FriendsService";
import { useUserProfile } from "@/contexts/UserProfileContext";

const MessagingInterface: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [allFriends, setAllFriends] = useState<Friend[]>([]);
  const { profile } = useUserProfile();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['friends', currentPage],
    queryFn: () => FriendsService.getFriends(currentPage),
  });

  // Accumulate friends from all pages
  useEffect(() => {
    if (data?.results) {
      if (currentPage === 1) {
        setAllFriends(data.results);
      } else {
        setAllFriends(prev => [...prev, ...data.results]);
      }
    }
  }, [data, currentPage]);

  // Convert Friend to Chat for the Conversation component
  const activeChat = useMemo<Chat | null>(() => {
    if (!activeFriend || !profile?.uid) return null;
    
    const displayName = activeFriend.friend.full_name || activeFriend.friend.email.split("@")[0];
    
    return {
      id: `${profile.uid}-${activeFriend.friend.id}`,
      participants: [activeFriend.friend.id.toString()],
      unreadCount: activeFriend.unread_messages_count,
      updatedAt: activeFriend.last_message_time ? new Date(activeFriend.last_message_time) : new Date(),
      name: displayName,
      avatar: "/placeholder.svg",
      conversationId: activeFriend.conversation_id,
    };
  }, [activeFriend, profile]);

  const handleFriendSelect = (friend: Friend) => {
    setActiveFriend(friend);
  };

  const handleDeleteChat = (friendId: string) => {
    if (activeFriend?.friend.id.toString() === friendId) {
      setActiveFriend(null);
    }
    // In a real implementation, we would call an API to delete the chat
    console.log("Delete chat for friend:", friendId);
  };

  const loadMoreFriends = () => {
    if (data?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    // Set the first friend as active by default if none is selected
    if (allFriends.length > 0 && !activeFriend) {
      setActiveFriend(allFriends[0]);
    }
  }, [allFriends, activeFriend]);

  return (
    <div className="flex h-full">
      {/* Chat list sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ChatList
          friends={allFriends}
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
