
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'link';
  attachment?: string | {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  isRead: boolean;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  replyTo?: string;
  editedAt?: string;
  metadata?: {
    linkPreview?: {
      title: string;
      description: string;
      image?: string;
      url: string;
    };
  };
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    isOwn: boolean;
  };
}

export interface ChatState {
  messages: Message[];
  friends: Friend[];
  selectedFriendId: string | null;
  isLoading: boolean;
  error: string | null;
}
