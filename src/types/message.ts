
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  attachment?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  last_message?: Message;
  unread_count?: number;
  is_online?: boolean;
  last_seen?: string;
}

export interface MessageThread {
  friend: Friend;
  messages: Message[];
}
