import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    // Store token and user info
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('username', response.username);

    return response;
  }

  async register(userData: RegisterRequest): Promise<User> {
    return await apiService.post<User>(API_ENDPOINTS.REGISTER, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}

export default new AuthService();

