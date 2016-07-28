/**
 * @file    query definitions for images.
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
  getAllImages,
  getAllImagesCount,
  getImageById,
} from '../models/image';

import {
  imageConnection,
  imageType,
} from '../types/image';

export const allImagesField = {
  type    : imageConnection,
  args    : connectionArgs,
  resolve : async (_, args) => {
    const [
      connection,
      count,
    ] = await Promise.all([
      connectionFromPromisedArray(getAllImages(), args),
      getAllImagesCount(),
    ]);

    return ({
      ...connection,
      count,
    });
  },
};

export const imageByIdField = {
  type : imageType,
  args : {
    id : {
      title : 'Image Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  resolve : async (_, { id }) => getImageById(fromGlobalId(id).id),
};
