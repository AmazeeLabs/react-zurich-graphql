/**
 * @file    query definitions for videos.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId,
} from 'graphql-relay';

import {
  getAllVideos,
  getAllVideosCount,
  getVideoById,
} from '../models/video';

import {
  videoConnection,
  videoType,
} from '../types/video';

export const allVideosField = {
  type    : videoConnection,
  args    : connectionArgs,
  resolve : async (_, args) => {
    const [
      connection,
      count,
    ] = await Promise.all([
      connectionFromPromisedArray(getAllVideos(), args),
      getAllVideosCount(),
    ]);

    return ({
      ...connection,
      count,
    });
  },
};

export const videoByIdField = {
  type : videoType,
  args : {
    id : {
      title : 'Video Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  resolve : async (_, { id }) => getVideoById(fromGlobalId(id).id),
};
