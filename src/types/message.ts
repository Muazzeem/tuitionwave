
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  timestamp: string;
  is_read: boolean;
  attachment?: string;
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

export interface MessageAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
}
