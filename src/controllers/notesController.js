import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  const { tag, search } = req.query;

  // pagination
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  // build Mongoose query with chaining
  const notesQuery = Note.find().where('userId').equals(req.user._id);

  // build plain filter in parallel for countDocuments (keeps count reliable)
  const filter = { userId: req.user._id };

  // filter by tag using chain
  if (tag) {
    notesQuery.where('tag').equals(tag);
    filter.tag = tag;
  }

  // filter by search (text index) using chain
  if (search) {
    // .find({...}) on a Query appends conditions — keeps chain style
    notesQuery.find({ $text: { $search: search } });
    filter.$text = { $search: search };
  }

  // execute parallel requests: count by filter, and notes by chained query with pagination
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    notesQuery.skip(skip).limit(perPage).exec(),
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
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};

//post note
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

//delete note
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};

//patch note
export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};
