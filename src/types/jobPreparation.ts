
export interface Category {
  uid: string;
  category_no: number;
  category_name: string;
}

export interface Subject {
  uid: string;
  subject_title: string;
  category: Category;
  total_questions: number;
}

export interface Topic {
  uid: string;
  topic_name: string;
  subtopics_count: number;
  subject: Subject;
  total_questions: number;
}

export interface Subtopic {
  uid: string;
  subtopic_name: string;
  topic: Topic;
  total_questions: number;
}

export interface QuestionOption {
  uid: string;
  option_label: string;
  option_text: string;
  order: number;
  is_correct?: boolean;
}

export interface Question {
  image: string;
  uid: string;
  question_number: number;
  question_text: string;
  marks: number;
  negative_marks: number;
  time_limit_seconds: number;
  explanation?: string;
  topic?: Topic;
  options: QuestionOption[];
  correct_option?: QuestionOption;
}

export interface ExamQuestion {
  image: any;
  uid: string;
  order: number;
  topic_name: string;
  subject_title: string;
  question_uid: string;
  question_number: number;
  question_text: string;
  marks: number;
  negative_marks: number;
  time_limit_seconds: number;
  options: QuestionOption[];
}

export interface ExamData {
  uid: string;
  exam_type: string;
  status: string;
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  started_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  obtained_marks: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  cut_marks: number;
  subjects_info: { uid: string; title: string; }[];
  topics_info: { uid: string; name: string; }[];
  exam_questions: ExamQuestion[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CategoriesResponse extends PaginatedResponse<Category> {}
export interface SubjectsResponse extends PaginatedResponse<Subject> {}
export interface TopicsResponse extends PaginatedResponse<Topic> {}
export interface SubtopicsResponse extends PaginatedResponse<Subtopic> {}
export interface QuestionsResponse extends PaginatedResponse<Question> {}


export interface ExamResults {
  result_status: string;
  uid: string;
  exam_type: string;
  status: string;
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  started_at: string;
  completed_at: string;
  expires_at: string;
  obtained_marks: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  cut_marks: number;
  subjects_info: { uid: string; title: string; }[];
  topics_info: { uid: string; name: string; }[];
  questions: {
    image: string;
    uid: string;
    order: number;
    topic_name: string;
    subject_title: string;
    question_uid: string;
    question_number: number;
    question_text: string;
    marks: number;
    negative_marks: number;
    time_limit_seconds: number;
    options: {
      uid: string;
      text: string;
      label: string;
      order: number;
      is_correct: boolean;
    }[];
    selected_option?: {
      uid: string;
      text: string;
      label: string;
    };
    is_correct?: boolean;
    explanation?: string;
  }[];
}