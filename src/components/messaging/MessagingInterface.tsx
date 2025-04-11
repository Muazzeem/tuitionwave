
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import Conversation from "./Conversation";
import { Chat } from "@/types/message";

// Mock data for demonstration
const mockChats: Chat[] = [
  {
    id: "1",
    participants: ["user1", "user2"],
    unreadCount: 3,
    updatedAt: new Date(),
    name: "John Doe",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    participants: ["user1", "user3"],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 60000),
    name: "Jane Smith",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    participants: ["user1", "user4"],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 120000),
    name: "Robert Johnson",
    avatar: "/placeholder.svg",
  },
];

const MessagingInterface: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
    // Mark messages as read when selecting a chat
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    setChats(updatedChats);
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  useEffect(() => {
    // Set the first chat as active by default if none is selected
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);

  return (
    <div className="flex h-full">
      {/* Chat list sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Conversation area */}
      <div className="w-2/3 bg-gray-50">
        {activeChat ? (
          <Conversation
            chat={activeChat}
            onDeleteChat={() => handleDeleteChat(activeChat.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
