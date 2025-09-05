import { ReactNode } from 'react';

export interface Guardian {
  profile_picture: string;
  uid: number;
  username: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface ContractTutor {
  full_name: ReactNode;
  uid: string;
  institute: {
    id: number;
    name: string;
  };
  division: string | null;
  city: string | null;
  address: string;
  profile_picture: string;
  subjects: {
    id: number;
    subject: string;
  }[];
  active_days: {
    id: number;
    day: string;
  }[];
}

export interface Contract {
  created_at: any;
  student_upazila: any;
  student_address: string | number;
  version_bangla_english: string | number;
  active_days: any;
  family_members: string | number;
  student_gender: string | null;
  student_department: string | number;
  student_institution: string;
  student_class: string | number;
  tuition_type: string;
  uid: string;
  guardian: Guardian;
  full_name: string;
  tutor: ContractTutor;
  subjects: {
    id: number;
    subject: string;
  }[];
  student_area: {
    id: number;
    name: string;
  };
  contract_duration: number;
  proposed_salary: string;
  status_display: string;
}

export interface ContractResponse {
  uid: string;
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Contract[];
}
