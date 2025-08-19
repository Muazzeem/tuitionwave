
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
  first_name?: string;
  last_name?: string;
  nid_document?: File;
}

export interface PackageData {
  id: number;
  name: string;
  price: string;
  period: string;
  package_expiry_date: string;
  created_at: string;
}

export interface ProfileData {
  is_tutor: boolean;
  is_student: boolean;
  has_document: any;
  has_nid: any;
  user_type: string;
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
  country: string;
  city: string;
  profile_picture: string;
  is_nid_verified: string;
  is_verified: string;
  package: PackageData;
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
type ViewType = 'categories' | 'subjects' | 'topics' | 'questions';
export interface NavigationState {
  view: ViewType;
  categoryUid?: string;
  categoryName?: string;
  subjectUid?: string;
  subjectName?: string;
  topicUid?: string;
  topicName?: string;
}

export interface AnswerResult {
  question_uid: string;
  question_text: string;
  selected_option_label: string;
  selected_option_text: string;
  correct_option_label: string;
  correct_option_text: string;
  is_correct: boolean;
  explanation: string;
}

export interface QuestionState {
  [questionUid: string]: {
    selectedOption?: string;
    isAnswered: boolean;
    result?: AnswerResult;
    showResult: boolean;
  };
}

export interface Division {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  division: {
    id: number;
    name: string;
  };
}

export interface Upazila {
  id: number;
  name: string;
  district: {
    id: number;
    name: string;
    division: {
      id: number;
      name: string;
    };
  };
}

export interface ProfileFormData {
  uid?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profile_picture?: string | null;
  gender: string;
  birthDate: Date | null;
  linkedinProfile: string;
  description: string;
  division_id?: number | null;
  preferred_district_id?: number | null;
  preferred_upazila_id?: number | null;
}
