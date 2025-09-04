import DashboardHeader from "@/components/DashboardHeader";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import React from "react";

const MessagePage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background w-full flex-1 overflow-auto bg-gray-900">
        <DashboardHeader userName="John" />
        <div className="flex-1 overflow-hidden">
          <MessagingInterface />
        </div>
      </div>
  );
};

export default MessagePage;
