export interface User {
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

export interface Tutor {
  uid: string;
  profile_picture_url: string | null;
  city: string | null;
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
  expected_salary: SalaryRange;
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
}

export interface TutorListResponse {
  results: Tutor[];
  count: number;
}

export interface ProfileFormData {
  fullName: string;
  address: string;
  gender: string;
  birthDate: Date | undefined;
  linkedinProfile: string;
  profilePicture: File | null;
  education: EducationData[];
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
