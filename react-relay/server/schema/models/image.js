/**
 * @file    mongodb model for images.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import mongoose, { Schema } from 'mongoose';

const ImageSchema = new Schema({
  url : {
    type     : String,
    required : true,
  },
  alt : {
    type     : String,
    required : true,
  },
  width : {
    type     : Number,
    required : true,
  },
  height : {
    type     : Number,
    required : true,
  },
});

export const Image = mongoose.model('Image', ImageSchema);

export const getImageById = (id) => Image.findById(id);
export const getImagesByIds = (ids) => Image.find({ _id: { $in: ids } });
export const getAllImagesCount = () => Image.count({});
export const getAllImages = () => Image.find({});

export const addImage = (values) =>
  Image
    .create(values)
    .then((image) => image.save());

export const deleteImage = (id) => Image.findByIdAndRemove(id);
