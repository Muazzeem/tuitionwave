
export type MessageType = 'text' | 'image' | 'file' | 'audio';

export interface WebSocketMessage {
  type: string;
  message: string;
  sender_id?: string;
  sender_email?: string;
  sent_at?: string;
  conversation_id?: string;
  user_id?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  type: MessageType;
  isRead: boolean;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  audioDuration?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  name?: string;
  avatar?: string;
}
