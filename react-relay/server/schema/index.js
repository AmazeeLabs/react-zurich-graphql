/**
 * @file    graphql schema entry point
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import { nodeField } from './node';

import {
  allArticlesField,
  articleByIdField,
} from './queries/article';

import {
  addArticleMutation,
  deleteArticleMutation,
} from './mutations/article';

import {
  allAuthorsField,
  authorByIdField,
} from './queries/author';

import {
  addAuthorMutation,
  deleteAuthorMutation,
} from './mutations/author';

import {
  allVideosField,
  videoByIdField,
} from './queries/video';

import {
  addBrightcoveVideoMutation,
  addYoutubeVideoMutation,
  deleteVideoMutation,
} from './mutations/video';

import {
  allImagesField,
  imageByIdField,
} from './queries/image';

import {
  addImageMutation,
  deleteImageMutation,
} from './mutations/image';

// Set up the root query type.
const query = new GraphQLObjectType({
  name        : 'Query',
  description : 'Query root.',
  fields      : () => ({
    node        : nodeField,
    viewer      : {
      title   : 'Viewer',
      resolve : () => true,
      type    : new GraphQLObjectType({
        name        :'Viewer',
        description : 'Extra nesting layer for Relay routing.',
        fields      : {
          allArticles : allArticlesField,
          allAuthors  : allAuthorsField,
          allVideos   : allVideosField,
          allImages   : allImagesField,
        },
      }),
    },
    articleById : articleByIdField,
    authorById  : authorByIdField,
    videoById   : videoByIdField,
    imageById   : imageByIdField,
  }),
});

// Set up the root mutation type.
const mutation = new GraphQLObjectType({
  name        : 'Mutation',
  description : 'Mutation root.',
  fields      : () => ({
    addArticle         : addArticleMutation,
    addAuthor          : addAuthorMutation,
    addImage           : addImageMutation,
    addBrightcoveVideo : addBrightcoveVideoMutation,
    addYoutubeVideo    : addYoutubeVideoMutation,
    deleteArticle      : deleteArticleMutation,
    deleteAuthor       : deleteAuthorMutation,
    deleteVideo        : deleteVideoMutation,
    deleteImage        : deleteImageMutation,
  }),
});

// Some types need to be registered manually because they are otherwise only
// referenced by interfaces.
import {
  bodyTextElementType,
  bodyVideoElementType,
  bodyImageElementType,
  bodyYoutubeElementType,
  bodyFacebookElementType,
  bodyInstagramElementType,
  bodyTwitterElementType,
  bodyTextBoxElementType,
  bodyQuoteElementType,
} from './types/article';

import {
  youtubeVideoType,
  brightcoveVideoType,
} from './types/video';

export default new GraphQLSchema({
  query,
  mutation,
  types : [
    bodyTextElementType,
    bodyVideoElementType,
    bodyImageElementType,
    bodyYoutubeElementType,
    bodyFacebookElementType,
    bodyInstagramElementType,
    bodyTwitterElementType,
    bodyTextBoxElementType,
    bodyQuoteElementType,
    youtubeVideoType,
    brightcoveVideoType,
  ],
});
