
export interface Message {
  id?: number;
  message: string;
  sender_id: string;
  sender_email?: string;
  sent_at: string;
  conversation_id?: string;
  senderId?: string; // Keep for backward compatibility
}

export interface Chat {
  id: number;
  friend: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  last_message: string | null;
  last_message_time: string | null;
  friendship_created: string;
  conversation_id: number | null;
  unread_messages_count: number;
}

export interface Conversation {
  id: number;
  participants: Array<{
    id: number;
    email: string;
    full_name: string;
  }>;
  created_at: string;
}
