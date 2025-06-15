
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Friend } from '@/types/friends';

interface ChatHeaderProps {
  friend: Friend;
  onBack: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ friend, onBack, showBackButton = true }) => {
  return (
    <div className="px-4 py-3 border-b bg-white flex items-center justify-between shadow-sm dark:bg-gray-800">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={friend.friend.full_name} />
          <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
            {friend.friend.full_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {friend.friend.full_name}
          </h2>
          {/* <p className="text-sm text-green-500">Online</p> */}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="p-2">
          <img width="30" height="30" src="https://img.icons8.com/color/48/google-meet--v1.png" alt="google-meet--v1"/>
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
