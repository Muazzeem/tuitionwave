
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

export interface QuestionOption {
  uid: string;
  option_label: string;
  option_text: string;
  order: number;
}

export interface Question {
  uid: string;
  question_number: number;
  question_text: string;
  marks: number;
  negative_marks: number;
  time_limit_seconds: number;
  options: QuestionOption[];
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
export interface QuestionsResponse extends PaginatedResponse<Question> {}
