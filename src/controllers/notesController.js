import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
import {TAGS} from '../constants/tags.js';

//get all notes
// export const getAllNotes = async (req, res) => {
//   const notes = await Note.find();
//   res.status(200).json(notes);
// }; old one

export const getAllNotes = async (req, res) => {
  const { tag, search } = req.query;

  //pagination
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const query = {};

  //filter by tag
  if (tag) {
   if (!TAGS.includes(tag)) {
      return res.status(400).json({ message: "Invalid tag" });
    }
    query.tag = tag;
  }

  //filter by seearch
  if (search) {
    query.$text = { $search: search };
  }

  //paralel requests
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(query),
    Note.find(query).skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

//get note by id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById({ _id: noteId });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
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
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
