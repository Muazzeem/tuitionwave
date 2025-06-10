
export interface FriendUser {
  uid: any;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface LastMessage {
  text: string;
  sender_id: number;
  is_from_me: boolean;
  sent_at: string;
}

export interface Friend {
  friend: FriendUser;
  last_message: LastMessage | null;
  last_message_time: string | null;
  friendship_created: string;
  unread_messages_count: number;
  // Add missing properties to make it compatible with Chat
  id: number;
  uid: string;
  conversation_id: number | null;
}

export interface FriendsApiResponse {
  accepted_friends: Friend[];
}
