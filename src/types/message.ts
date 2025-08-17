
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachment?: string | { url: string; name: string; size: number; type: string; };
  timestamp: string;
  is_read: boolean;
  sender_name?: string;
  sender_avatar?: string;
  receiver_name?: string;
  receiver_avatar?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface ChatState {
  selectedFriend: Friend | null;
  messages: Message[];
  friends: Friend[];
  loading: boolean;
  error: string | null;
}
