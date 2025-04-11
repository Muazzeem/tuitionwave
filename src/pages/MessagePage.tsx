
import React from "react";
import Sidebar from "@/components/Sidebar";
import MessagingInterface from "@/components/messaging/MessagingInterface";

const MessagePage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <MessagingInterface />
      </div>
    </div>
  );
};

export default MessagePage;
