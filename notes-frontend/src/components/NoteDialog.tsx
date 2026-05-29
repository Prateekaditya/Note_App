import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (noteData: CreateNoteRequest | UpdateNoteRequest) => void;
  note?: Note | null;
  userId: number;
}

const NoteDialog: React.FC<NoteDialogProps> = ({ open, onClose, onSave, note, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pinned: false,
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        pinned: note.pinned,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        pinned: false,
      });
    }
  }, [note, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = () => {
    if (note) {
      // Update existing note
      onSave(formData as UpdateNoteRequest);
    } else {
      // Create new note
      onSave({
        ...formData,
        userId,
      } as CreateNoteRequest);
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      pinned: false,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
        {note ? 'Edit Note' : 'Create New Note'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            multiline
            rows={6}
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.pinned}
                onChange={handleChange}
                name="pinned"
                color="primary"
              />
            }
            label="Pin this note"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title || !formData.content}
        >
          {note ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;

