
import { Contract } from "./contract";

export interface RequestRowProps {
    request: Contract;
    showConfirmationDialog: (options: {
      title: string;
      description?: string;
      onConfirm: () => void;
      variant?: string;
    }) => void;
  }

export interface RegistrationData {
  email: string;
  phone: string;
  password1: string;
  password2: string;
  user_type: 'TEACHER' | 'GUARDIAN';
  first_name?: string;
  last_name?: string;
  nid_document?: File;
}

export interface ProfileData {
  user_type: string;
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
  country: string;
  city: string;
  profile_picture?: string;
}


// Define types
export interface Student {
  uid: string;
  first_name: string;
  last_name: string;
}

export interface FeedbackItem {
  uid: string;
  contract: string;
  student: Student;
  avg_ratting: number;
  comment: string;
  created_at: string;
}

export interface FeedbackResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: FeedbackItem[];
}

export interface ReviewItemProps {
  name: string;
  comment: string;
  rating: number;
  date: string;
}
