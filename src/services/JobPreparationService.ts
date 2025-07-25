
import axios from 'axios';
import { CategoriesResponse, SubjectsResponse, TopicsResponse, SubtopicsResponse, QuestionsResponse, ExamData } from '@/types/jobPreparation';
import { getAccessToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class JobPreparationService {
  private getAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getCategories(page: number = 1): Promise<CategoriesResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/categories/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getSubjects(categoryUid: string, page: number = 1): Promise<SubjectsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/categories/${categoryUid}/subjects/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getTopics(subjectUid: string, page: number = 1): Promise<TopicsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/subjects/${subjectUid}/topics/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getSubtopics(topicUid: string, page: number = 1): Promise<SubtopicsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/topics/${topicUid}/subtopics/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getQuestions(topicUid: string, page: number = 1): Promise<QuestionsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/topics/${topicUid}/questions/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getQuestionsBySubtopic(subtopicUid: string, page: number = 1): Promise<QuestionsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/subtopics/${subtopicUid}/questions/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getQuestionsReadingMode(topicUid: string, page: number = 1): Promise<QuestionsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/topics/${topicUid}/questions/reading-mode/`, {
      params: { page },
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getExamData(examUid: string): Promise<ExamData> {
    const response = await axios.get(`${API_BASE_URL}/api/exams/${examUid}/`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async submitExamAnswer(examUid: string, questionUid: string, selectedOptionUid: string): Promise<any> {
    const response = await axios.post(
      `${API_BASE_URL}/api/exams/${examUid}/submit-answer/`,
      {
        question: questionUid,
        selected_option: selectedOptionUid,
      },
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  async submitExam(examUid: string): Promise<any> {
    const response = await axios.post(
      `${API_BASE_URL}/api/exams/${examUid}/submit/`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }
}

export default new JobPreparationService();
