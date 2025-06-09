
import React from "react";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import DashboardHeader from "@/components/DashboardHeader";

const MessagePage: React.FC = () => {
  return (
    <div className="flex-1 h-100">
      {/* <DashboardHeader userName="John" /> */}
      <MessagingInterface />
    </div>
  );
};

export default MessagePage;
