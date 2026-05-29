import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../types';

class UserService {
  async getAllUsers(): Promise<User[]> {
    return await apiService.get<User[]>(API_ENDPOINTS.USERS);
  }

  async getUserById(id: number): Promise<User> {
    return await apiService.get<User>(API_ENDPOINTS.USER_BY_ID(id));
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return await apiService.put<User>(API_ENDPOINTS.USER_BY_ID(id), userData);
  }

  async deleteUser(id: number): Promise<void> {
    return await apiService.delete(API_ENDPOINTS.USER_BY_ID(id));
  }
}

export default new UserService();

