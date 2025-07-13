
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { Friend } from '@/types/friends';

interface ChatHeaderProps {
  friend: Friend;
  onBack: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ friend, onBack, showBackButton = true }) => {
  return (
    <div className="px-4 py-3 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between shadow-sm relative">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src="" alt={friend.friend.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {friend.friend.full_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Online status */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground truncate">
              {friend.friend.full_name}
            </h2>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {friend.friend.email}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-muted transition-colors"
          title="Voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-muted transition-colors"
          title="Video call"
        >
          <img 
            width="20" 
            height="20" 
            src="https://img.icons8.com/color/48/google-meet--v1.png" 
            alt="Google Meet"
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-muted transition-colors"
          title="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20 pointer-events-none" />
    </div>
  );
};

export default ChatHeader;
