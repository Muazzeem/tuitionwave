import { ReactNode } from "react";

export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  address: string;
}

export interface Institute {
  id: number;
  name: string;
}

export interface Department {
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

export interface Area {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  subject: string;
}

export interface ActiveDay {
  id: number;
  day: string;
}

export interface SalaryRange {
  min_amount: number;
  max_amount: number;
  display_range: string;
}

export interface City {
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

export interface Tutor {
  upazila: any;
  linkedin_profile: string;
  expected_salary: any;
  districts: any;
  upazilas: any;
  division: any;
  review_count: number;
  avg_rating: number;
  full_name: string;
  preferred_city: string;
  tuition_type: string;
  bio: ReactNode;
  average_rating: number;
  user: any;
  uid: string;
  profile_picture_url: string | null;
  city: City;
  address: string;
  gender_display: string;
  birth_date: string | null;
  description: string;
  nid_document: string | null;
  degree: {
    id: number;
    name: string;
  };
  institute: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  current_status_display: string;
  cv_document: string | null;
  preferred_districts: District[];
  preferred_areas: Area[];
  subjects: Subject[];
  active_days: ActiveDay[];
  days_per_week: number;
  teaching_type_display: string;
  expected_hourly_charge: SalaryRange;
  created_at: string;
  rating?: number;
  total_reviews?: number;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  teaching_type?: string;
  collage_name?: string;
  id?: number;
  preferred_time?: string;
}

export interface TutorListResponse {
  results: Tutor[];
  count: number;
}

export interface ProfileFormData {
  full_name: string;
  address: string;
  gender: string;
  birthDate: Date | undefined;
  linkedinProfile: string;
  profilePicture: File | null;
  education: EducationData[];
  degree: string;
  institute: string;
  department: string;
  currentStatus: string;
  cvDocument: File | null;
  tuitionDetails: {
    teachingRate: number;
    teachingType: string;
    subjects: string[];
  };
}

export interface EducationData {
  degree: string;
  institution: string;
  year: string;
}

export interface TuitionFormData {
  daysPerWeek: string;
  teachingType: string;
  minSalary: string;
  maxSalary: string;
  minHourlyCharge: string;
  maxHourlyCharge: string;
  subjects: string[];
  activeDays: string[];
  preferredDistricts: string[];
  preferredAreas: string[];
  selectedDivision?: string;
  selectedDistrict?: string;
  selectedUpazila?: string;
  selectedArea?: string;
}

export interface TuitionInfoResponse {
  days_per_week: number;
  teaching_type_display: string;
  expected_salary: {
      min_amount: number;
      max_amount: number;
  } | null;
  expected_hourly_charge: {
      min_amount: number;
      max_amount: number;
  } | null;
  subjects: { id: number; subject: string }[];
  active_days: { id: number; day: string }[];
  preferred_districts: { id: number; name: string }[];
  preferred_areas: { id: number; name: string }[];
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
