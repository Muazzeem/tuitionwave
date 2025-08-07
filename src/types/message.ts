
export interface Message {
  id: number;
  text: string;
  attachment?: string | null;
  sent_at: string;
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  is_read: boolean;
}

export interface Friend {
  id: number;
  name: string;
  email: string;
  profile_picture?: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_online: boolean;
}

export interface MessageRequest {
  text: string;
  receiver_email: string;
  attachment?: File | null;
}
