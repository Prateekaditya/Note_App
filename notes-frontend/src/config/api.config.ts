// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,

  // Note endpoints
  NOTES: '/notes/notes',
  NOTE_BY_ID: (id: number) => `/notes/notes/${id}`,
  NOTES_BY_USER: (userId: number) => `/notes/notes/user/${userId}`,
  PINNED_NOTES: (userId: number) => `/notes/notes/user/${userId}/pinned`,
  TOGGLE_PIN: (id: number) => `/notes/notes/${id}/pin`,
};

