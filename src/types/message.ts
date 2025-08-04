
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachment?: string;
  type?: 'text' | 'image' | 'file';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
}
