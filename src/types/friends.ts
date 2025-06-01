
export interface FriendUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Friend {
  friend: FriendUser;
  last_message: string | null;
  last_message_time: string | null;
  friendship_created: string;
  conversation_id: number | null;
  unread_messages_count: number;
}

export interface FriendsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Friend[];
}
