package com.microservices.noteservice.service;

import com.microservices.noteservice.client.UserServiceClient;
import com.microservices.noteservice.dto.NoteRequest;
import com.microservices.noteservice.dto.NoteResponse;
import com.microservices.noteservice.dto.UserResponse;
import com.microservices.noteservice.entity.Note;
import com.microservices.noteservice.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    public NoteResponse createNote(NoteRequest noteRequest) {
        // Validate user exists via Feign client
        try {
            UserResponse user = userServiceClient.getUserById(noteRequest.getUserId());
            if (user == null) {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("User validation failed: " + e.getMessage());
        }

        Note note = new Note();
        note.setUserId(noteRequest.getUserId());
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setPinned(noteRequest.getPinned() != null ? noteRequest.getPinned() : false);

        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    public NoteResponse getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        return mapToResponse(note);
    }

    public List<NoteResponse> getAllNotes() {
        return noteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NoteResponse> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NoteResponse> getPinnedNotesByUserId(Long userId) {
        return noteRepository.findByUserIdAndPinned(userId, true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NoteResponse updateNote(Long id, NoteRequest noteRequest) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (noteRequest.getTitle() != null) {
            note.setTitle(noteRequest.getTitle());
        }

        if (noteRequest.getContent() != null) {
            note.setContent(noteRequest.getContent());
        }

        if (noteRequest.getPinned() != null) {
            note.setPinned(noteRequest.getPinned());
        }

        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    public NoteResponse togglePin(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        note.setPinned(!note.getPinned());
        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    public void deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new RuntimeException("Note not found");
        }
        noteRepository.deleteById(id);
    }

    private NoteResponse mapToResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getUserId(),
                note.getTitle(),
                note.getContent(),
                note.getPinned(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}

