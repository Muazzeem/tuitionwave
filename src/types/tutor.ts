
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  address: string;
}

export interface Tutor {
  id: number;
  user: User;
  teaching_rate: number;
  teaching_type: string;
}

export interface TutorListResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Tutor[];
}
