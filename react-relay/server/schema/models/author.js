/**
 * @file    mongodb model for authors.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import mongoose, { Schema } from 'mongoose';

const AuthorSchema = new Schema({
  lastName : {
    type     : String,
    required : true,
  },
  firstName : {
    type     : String,
    required : true,
  },
  department : {
    type : String,
  },
  avatar : {
    type : String,
  },
});

export const Author = mongoose.model('Author', AuthorSchema);

export const getAuthorById = (id) => Author.findById(id);
export const getAllAuthorsCount = () => Author.count({});
export const getAllAuthors = () => Author.find({});

export const addAuthor = (values) =>
  Author
    .create(values)
    .then((author) => author.save());

export const deleteAuthor = (id) => Author.findByIdAndRemove(id);
