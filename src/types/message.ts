
export interface MessageAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  timestamp: string;
  is_read: boolean;
  attachment?: string | MessageAttachment;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  receiver?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
}

export interface ChatUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
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
