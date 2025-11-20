import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getNotes);
router.get('/notes/:noteId', getNoteById);
router.post('/notes', createNote);
router.delete('/note/:noteId', deleteNote);
router.patch('/note/:noteId', updateNote);

export default router;
