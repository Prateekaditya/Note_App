import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Fab,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteDialog from '../components/NoteDialog';
import { useAuth } from '../context/AuthContext';
import noteService from '../services/note.service';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadNotes();
  }, [userId]);

  useEffect(() => {
    filterNotes();
  }, [notes, tabValue]);

  const loadNotes = async () => {
    if (!userId) return;

    setLoading(true);
    setError('');
    try {
      const data = await noteService.getNotesByUser(userId);
      setNotes(data);
    } catch (err: any) {
      setError('Failed to load notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    switch (tabValue) {
      case 0: // All notes
        setFilteredNotes(notes);
        break;
      case 1: // Pinned notes
        setFilteredNotes(notes.filter(note => note.pinned));
        break;
      case 2: // Unpinned notes
        setFilteredNotes(notes.filter(note => !note.pinned));
        break;
      default:
        setFilteredNotes(notes);
    }
  };

  const handleCreateNote = async (noteData: CreateNoteRequest | UpdateNoteRequest) => {
    try {
      await noteService.createNote(noteData as CreateNoteRequest);
      loadNotes();
    } catch (err: any) {
      setError('Failed to create note. Please try again.');
    }
  };

  const handleUpdateNote = async (noteData: CreateNoteRequest | UpdateNoteRequest) => {
    if (!selectedNote) return;

    try {
      await noteService.updateNote(selectedNote.id, noteData as UpdateNoteRequest);
      loadNotes();
    } catch (err: any) {
      setError('Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await noteService.deleteNote(id);
      loadNotes();
    } catch (err: any) {
      setError('Failed to delete note. Please try again.');
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      await noteService.togglePin(id);
      loadNotes();
    } catch (err: any) {
      setError('Failed to toggle pin. Please try again.');
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNote(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            My Notes
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              onClick={loadNotes}
              color="primary"
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              New Note
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={`All Notes (${notes.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Pinned (${notes.filter(n => n.pinned).length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={`Unpinned (${notes.filter(n => !n.pinned).length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Notes Grid */}
        {!loading && filteredNotes.length > 0 && (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && filteredNotes.length === 0 && (
          <Paper
            sx={{
              py: 8,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {tabValue === 1 ? 'No pinned notes' : tabValue === 2 ? 'No unpinned notes' : 'No notes yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {tabValue === 0 && "Click the 'New Note' button to create your first note"}
            </Typography>
            {tabValue === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Create Note
              </Button>
            )}
          </Paper>
        )}
      </Container>

      {/* Floating Action Button (Mobile) */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Note Dialog */}
      <NoteDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={selectedNote ? handleUpdateNote : handleCreateNote}
        note={selectedNote}
        userId={userId!}
      />
    </Box>
  );
};

export default Dashboard;

