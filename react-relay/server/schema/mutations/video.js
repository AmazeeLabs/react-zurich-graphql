/**
 * @file    mutation definitions for videos.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import {
  addYoutubeVideo,
  addBrightcoveVideo,
  deleteVideo,
  getVideoById,
} from '../models/video';

import {
  videoType,
  brightcoveVideoType,
  youtubeVideoType,
} from '../types/video';

const commonInputFields = {
  title : {
    title : 'Title',
    type  : GraphQLString,
  },
  description : {
    title : 'Description',
    type  : GraphQLString,
  },
  publishedDate : {
    title : 'Published date',
    type  : GraphQLFloat,
  },
  thumbnail : {
    title : 'Thumbnail',
    type  : GraphQLString,
  },
  category : {
    title : 'Category',
    type  : GraphQLString,
  },
  slug : {
    title : 'Slug',
    type  : GraphQLString,
  },
  length : {
    title : 'Length',
    type  : GraphQLFloat,
  },
};

const createOrUpdateBrightcoveVideoFields = {
  inputFields : {
    ...commonInputFields,
    brightcoveId : {
      title : 'Brightcove Video Id',
      type  : new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields : {
    video : {
      type    : brightcoveVideoType,
      resolve : (video) => video,
    },
  },
};

export const addBrightcoveVideoMutation = mutationWithClientMutationId({
  name : 'AddBrightcoveVideo',
  mutateAndGetPayload : async (values) => addBrightcoveVideo(values),
  ...createOrUpdateBrightcoveVideoFields,
});

const createOrUpdateYoutubeVideoFields = {
  inputFields : {
    ...commonInputFields,
    youtubeId : {
      title : 'Youtube Video Id',
      type  : new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields : {
    video : {
      type    : youtubeVideoType,
      resolve : (video) => video,
    },
  },
};

export const addYoutubeVideoMutation = mutationWithClientMutationId({
  name : 'AddYoutubeVideo',
  mutateAndGetPayload : async (values) => addYoutubeVideo(values),
  ...createOrUpdateYoutubeVideoFields,
});

const deleteVideoFields = {
  inputFields : {
    id : {
      title : 'Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields : {
    video : {
      type    : videoType,
      resolve : (video) => video,
    },
  },
};

export const deleteVideoMutation = mutationWithClientMutationId({
  name : 'DeleteVideo',
  mutateAndGetPayload : async ({ id }) => {
    const { id : videoId } = fromGlobalId(id);
    const video = await getVideoById(videoId);

    // Wait until the video has been successfully deleted.
    await deleteVideo(videoId);

    return video;
  },
  ...deleteVideoFields,
});
