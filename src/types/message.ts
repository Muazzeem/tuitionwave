
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
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  receiver?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
}

export interface ChatRoom {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  receiver: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
