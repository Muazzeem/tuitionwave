
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
}

export interface MessageRequest {
  receiver_id: string;
  content: string;
  attachment?: string;
}
