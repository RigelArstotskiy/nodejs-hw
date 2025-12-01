import { Joi, Segments } from "celebrate";
import {TAGS} from '../constants/tags.js';
import { isValidObjectId } from "mongoose";

//custom valid for ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),// for pagination
    perPage: Joi.number().integer().min(5).max(20).default(10),// for pagination
    tag: Joi.string().valid(...TAGS).optional(),// for filtration
    search: Joi.string().min(1).max(30).optional(),// for filtration
  })
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  })
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  })
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).min(1)//require at least one field in body
};
