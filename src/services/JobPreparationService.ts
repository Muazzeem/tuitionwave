
import axios from 'axios';
import { CategoriesResponse, SubjectsResponse, TopicsResponse, QuestionsResponse } from '@/types/jobPreparation';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class JobPreparationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
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

  async getQuestions(topicUid: string, page: number = 1): Promise<QuestionsResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/topics/${topicUid}/questions/`, {
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
}

export default new JobPreparationService();
