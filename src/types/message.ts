
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachment?: string | {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  messageType: 'text' | 'image' | 'file';
  replyTo?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastSeen: Date;
  isOnline: boolean;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
}
