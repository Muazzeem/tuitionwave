export interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  attachment: string | null;
  timestamp: string;
  is_read: boolean;
  sender_name?: string;
  receiver_name?: string;
  sender_profile_picture?: string;
  receiver_profile_picture?: string;
}
