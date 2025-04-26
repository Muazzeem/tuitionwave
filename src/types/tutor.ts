
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  address: string;
}

export interface Tutor {
  uid: string;
  user: User;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  teaching_rate: number | null;
  teaching_type: string;
  collage_name: string;
  address: string;
}

export interface TutorListResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Tutor[];
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
