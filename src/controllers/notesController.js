import { Note } from '../models/notes.js';
import createHttpError from 'http-errors';

//get all notes
export const getNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

//get note by id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.status(200).json(note);
};

//post note
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

//delete note
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

//patch note
export const updateNote = async (req, res, next) => {
  const { noteId } = res.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
