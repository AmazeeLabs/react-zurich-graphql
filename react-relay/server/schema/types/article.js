/**
 * @file    mock schema for articles.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInterfaceType,
  GraphQLID,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import { nodeInterface } from '../node';
import { videoType } from './video';
import { imageType } from './image';
import { getAuthorById } from '../models/author';
import { getVideoById } from '../models/video';

import {
  getImageById,
  getImagesByIds,
} from '../models/image';

import {
  getBodyElementsByIds,
  getTagsByIds,

  // Import the models for the interface type resolver callback.
  BodyVideoElement,
  BodyImageElement,
  BodyTextElement,
  BodyYoutubeElement,
  BodyFacebookElement,
  BodyInstagramElement,
  BodyTwitterElement,
  BodyTextBoxElement,
  BodyQuoteElement,
} from '../models/article';

const commonBodyElementFields = {
  kind : {
    title : 'Kind',
    type  : GraphQLString,
  },
  id : {
    title : 'Id',
    type  : GraphQLID,
  },
};

export const bodyTextElementType = new GraphQLObjectType({
  name   : 'BodyTextElement',
  fields : () => ({
    ...commonBodyElementFields,
    text : {
      title : 'Text',
      type  : GraphQLString,
    },
    gallery : {
      title   : 'Gallery',
      type    : new GraphQLList(imageType),
      resolve : async ({ gallery }) => getImagesByIds(gallery),
    },
    image : {
      title   : 'Image',
      type    : imageType,
      resolve : async ({ image }) => getImageById(image),
    },
    video : {
      title   : 'Video',
      type    : videoType,
      resolve : async ({ video }) => getVideoById(video),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyVideoElementType = new GraphQLObjectType({
  name   : 'BodyVideoElement',
  fields : () => ({
    ...commonBodyElementFields,
    video : {
      title   : 'Video',
      type    : videoType,
      resolve : async ({ video }) => getVideoById(video),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyImageElementType = new GraphQLObjectType({
  name   : 'BodyImageElement',
  fields : () => ({
    ...commonBodyElementFields,
    image : {
      title   : 'Image',
      type    : imageType,
      resolve : async ({ image }) => getImageById(image),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyYoutubeElementType = new GraphQLObjectType({
  name   : 'BodyYoutubeElement',
  fields : () => ({
    ...commonBodyElementFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyFacebookElementType = new GraphQLObjectType({
  name   : 'BodyFacebookElement',
  fields : () => ({
    ...commonBodyElementFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyInstagramElementType = new GraphQLObjectType({
  name   : 'BodyInstagramElement',
  fields : () => ({
    ...commonBodyElementFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyTwitterElementType = new GraphQLObjectType({
  name   : 'BodyTwitterElement',
  fields : () => ({
    ...commonBodyElementFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyTextBoxElementType = new GraphQLObjectType({
  name   : 'BodyTextBoxElement',
  fields : () => ({
    ...commonBodyElementFields,
    title : {
      title : 'Title',
      type  : GraphQLString,
    },
    text : {
      title : 'Text',
      type  : GraphQLString,
    },
    link : {
      title : 'Link',
      type  : GraphQLString,
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyQuoteElementType = new GraphQLObjectType({
  name   : 'BodyQuoteElement',
  fields : () => ({
    ...commonBodyElementFields,
    author : {
      title : 'Author',
      type  : GraphQLString,
    },
    text : {
      title : 'Text',
      type  : GraphQLString,
    },
  }),
  interfaces : () => [bodyElementInterface],
});

export const bodyElementInterface = new GraphQLInterfaceType({
  name        : 'BodyElement',
  fields      : () => commonBodyElementFields,
  resolveType : (object) => { // eslint-disable-line consistent-return
    if (object instanceof BodyVideoElement) {
      return bodyVideoElementType;
    }

    if (object instanceof BodyImageElement) {
      return bodyImageElementType;
    }

    if (object instanceof BodyTextElement) {
      return bodyTextElementType;
    }

    if (object instanceof BodyYoutubeElement) {
      return bodyYoutubeElementType;
    }

    if (object instanceof BodyFacebookElement) {
      return bodyFacebookElementType;
    }

    if (object instanceof BodyInstagramElement) {
      return bodyInstagramElementType;
    }

    if (object instanceof BodyTwitterElement) {
      return bodyTwitterElementType;
    }

    if (object instanceof BodyTextBoxElement) {
      return bodyTextBoxElementType;
    }

    if (object instanceof BodyQuoteElement) {
      return bodyQuoteElementType;
    }
  },
});

export const articleType = new GraphQLObjectType({
  name : 'Article',
  fields : () => ({
    id : globalIdField('Article'),
    articleId : {
      title   : 'Article Id',
      type    : new GraphQLNonNull(GraphQLString),
      resolve : ({ id }) => id,
    },
    title : {
      title : 'Title',
      type  : new GraphQLNonNull(GraphQLString),
    },
    lead : {
      title : 'Lead',
      type  : GraphQLString,
    },
    shareCount : {
      title : 'Share Count',
      type  : GraphQLInt,
    },
    commentCount : {
      title : 'Comment Count',
      type  : GraphQLInt,
    },
    body : {
      title   : 'Body',
      type    : new GraphQLList(bodyElementInterface),
      resolve : async ({ body }) => getBodyElementsByIds(body),
    },
    url : {
      title : 'Url',
      type  : GraphQLString,
    },
    author : {
      title   : 'Author',
      type    : require('./author').authorType, // eslint-disable-line global-require
      resolve : async ({ author }) => getAuthorById(author),
    },
    tags : {
      title   : 'Tags',
      type    : new GraphQLList(new GraphQLNonNull(GraphQLString)),
      resolve : async ({ tags }) => {
        const result = await getTagsByIds(tags);
        return result.map(({ name }) => name);
      },
    },
    teaserImage : {
      title : 'Teaser image',
      type  : imageType,
      resolve : async ({ teaserImage }) => getImageById(teaserImage),
    },
    createTime : {
      title : 'Create time',
      type  : new GraphQLNonNull(GraphQLFloat),
    },
    modifyTime : {
      title : 'Modify time',
      type  : new GraphQLNonNull(GraphQLFloat),
    },
  }),
  interfaces : () => [nodeInterface],
});

export const {
  connectionType : articleConnection,
  edgeType       : articleEdge,
} = connectionDefinitions({
  name             : 'Articles',
  nodeType         : articleType,
  connectionFields : {
    count : {
      title : 'Count',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
});
