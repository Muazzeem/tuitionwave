
import DashboardHeader from "@/components/DashboardHeader";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import React from "react";

const MessagePage: React.FC = () => {
  return (
    <div className="flex-1 h-100">
      <DashboardHeader userName="John" />
      <MessagingInterface />
    </div>
  );
};

export default MessagePage;
