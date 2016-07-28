/**
 * @file    mutation definitions for images.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import {
  addImage,
  deleteImage,
  getImageById,
} from '../models/image';

import { imageType } from '../types/image';

const createOrUpdateImageFields = {
  inputFields : {
    title : {
      title : 'Title',
      type  : new GraphQLNonNull(GraphQLString),
    },
    url : {
      title : 'Url',
      type  : new GraphQLNonNull(GraphQLString),
    },
    width : {
      title : 'Width',
      type  : new GraphQLNonNull(GraphQLInt),
    },
    height : {
      title : 'Height',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
  outputFields : {
    image : {
      type    : imageType,
      resolve : (image) => image,
    },
  },
};

export const addImageMutation = mutationWithClientMutationId({
  name : 'AddImage',
  mutateAndGetPayload : async (values) => addImage(values),
  ...createOrUpdateImageFields,
});

const deleteImageFields = {
  inputFields : {
    id : {
      title : 'Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields : {
    image : {
      type    : imageType,
      resolve : (image) => image,
    },
  },
};

export const deleteImageMutation = mutationWithClientMutationId({
  name : 'DeleteImage',
  mutateAndGetPayload : async ({ id }) => {
    const { id : imageId } = fromGlobalId(id);
    const image = await getImageById(imageId);

    // Wait until the image has been successfully deleted.
    await deleteImage(imageId);

    return image;
  },
  ...deleteImageFields,
});
