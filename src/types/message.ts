
export interface Message {
  id: string;
  text?: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  attachment?: string | {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  isRead?: boolean;
  delivered?: boolean;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}
