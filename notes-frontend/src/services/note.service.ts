import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

class NoteService {
  async getAllNotes(): Promise<Note[]> {
    return await apiService.get<Note[]>(API_ENDPOINTS.NOTES);
  }

  async getNoteById(id: number): Promise<Note> {
    return await apiService.get<Note>(API_ENDPOINTS.NOTE_BY_ID(id));
  }

  async getNotesByUser(userId: number): Promise<Note[]> {
    return await apiService.get<Note[]>(API_ENDPOINTS.NOTES_BY_USER(userId));
  }

  async getPinnedNotes(userId: number): Promise<Note[]> {
    return await apiService.get<Note[]>(API_ENDPOINTS.PINNED_NOTES(userId));
  }

  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    return await apiService.post<Note>(API_ENDPOINTS.NOTES, noteData);
  }

  async updateNote(id: number, noteData: UpdateNoteRequest): Promise<Note> {
    return await apiService.put<Note>(API_ENDPOINTS.NOTE_BY_ID(id), noteData);
  }

  async togglePin(id: number): Promise<Note> {
    return await apiService.patch<Note>(API_ENDPOINTS.TOGGLE_PIN(id));
  }

  async deleteNote(id: number): Promise<void> {
    return await apiService.delete(API_ENDPOINTS.NOTE_BY_ID(id));
  }
}

export default new NoteService();

