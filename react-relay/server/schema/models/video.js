/**
 * @file    mongodb model for videos.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import mongoose, { Schema } from 'mongoose';

const options = { discriminatorKey : 'kind' };
const VideoSchema = new Schema({
  title : {
    type : String,
  },
  description : {
    type : String,
  },
  publishedDate : {
    type : Date,
  },
  thumbnail : {
    type : String,
  },
  category : {
    type : String,
  },
  slug : {
    type : String,
  },
  length : {
    type : Number,
  },
}, options);

const YoutubeVideoSchema = new Schema({
  youtubeId : {
    type : String,
  },
}, options);

const BrightcoveVideoSchema = new Schema({
  brightcoveId : {
    type : Number,
  },
}, options);

export const Video = mongoose.model('Video', VideoSchema);
export const YoutubeVideo = Video.discriminator('YoutubeVideo', YoutubeVideoSchema);
export const BrightcoveVideo = Video.discriminator('BrightcoveVideo', BrightcoveVideoSchema);

export const getVideoById = (id) => Video.findById(id);
export const getAllVideosCount = () => Video.count({});
export const getAllVideos = () => Video.find({});

export const addYoutubeVideo = (values) =>
  YoutubeVideo
    .create(values)
    .then((video) => video.save());

export const addBrightcoveVideo = (values) =>
  BrightcoveVideo
    .create(values)
    .then((video) => video.save());

export const deleteVideo = (id) => Video.findByIdAndRemove(id);
