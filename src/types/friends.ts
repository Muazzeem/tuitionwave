
export interface Friend {
  uid: string;
  profile_picture: string | null;
  first_name: string;
  last_name: string;
  email: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  is_online: boolean;
}

export interface FriendsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Friend[];
}
