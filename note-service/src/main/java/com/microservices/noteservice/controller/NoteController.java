package com.microservices.noteservice.controller;

import com.microservices.noteservice.dto.NoteRequest;
import com.microservices.noteservice.dto.NoteResponse;
import com.microservices.noteservice.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping("/notes")
    public ResponseEntity<?> createNote(@RequestBody NoteRequest noteRequest) {
        try {
            NoteResponse response = noteService.createNote(noteRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Note creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/notes/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Long id) {
        try {
            NoteResponse response = noteService.getNoteById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Note not found: " + e.getMessage());
        }
    }

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getAllNotes() {
        List<NoteResponse> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/notes/user/{userId}")
    public ResponseEntity<List<NoteResponse>> getNotesByUserId(@PathVariable Long userId) {
        List<NoteResponse> notes = noteService.getNotesByUserId(userId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/notes/user/{userId}/pinned")
    public ResponseEntity<List<NoteResponse>> getPinnedNotesByUserId(@PathVariable Long userId) {
        List<NoteResponse> notes = noteService.getPinnedNotesByUserId(userId);
        return ResponseEntity.ok(notes);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody NoteRequest noteRequest) {
        try {
            NoteResponse response = noteService.updateNote(id, noteRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Update failed: " + e.getMessage());
        }
    }

    @PatchMapping("/notes/{id}/pin")
    public ResponseEntity<?> togglePin(@PathVariable Long id) {
        try {
            NoteResponse response = noteService.togglePin(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Toggle pin failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        try {
            noteService.deleteNote(id);
            return ResponseEntity.ok("Note deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Delete failed: " + e.getMessage());
        }
    }
}

