import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getAllNotes,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNoteById);
router.post('/notes', createNote);
router.delete('/note/:noteId', deleteNote);
router.patch('/note/:noteId', updateNote);

export default router;
