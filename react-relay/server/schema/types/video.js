/**
 * @file    mock schema for videos.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import { nodeInterface } from '../node';

import {
  YoutubeVideo,
  BrightcoveVideo,
} from '../models/video';

export const commonVideoFields = {
  id        : globalIdField('Video'),
  videoId : {
    title   : 'Video Id',
    type    : new GraphQLNonNull(GraphQLString),
    resolve : ({ id }) => id,
  },
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

export const videoType = new GraphQLInterfaceType({
  name        : 'Video',
  fields      : () => commonVideoFields,
  resolveType : (object) => { // eslint-disable-line consistent-return
    if (object instanceof BrightcoveVideo) {
      return brightcoveVideoType;
    }

    if (object instanceof YoutubeVideo) {
      return youtubeVideoType;
    }
  },
});

export const youtubeVideoType = new GraphQLObjectType({
  name   : 'YoutubeVideo',
  fields : () => ({
    ...commonVideoFields,
    id        : globalIdField('Video'),
    youtubeId : {
      title : 'Youtube Video Id',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : [nodeInterface, videoType],
});

export const brightcoveVideoType = new GraphQLObjectType({
  name   : 'BrightcoveVideo',
  fields : () => ({
    ...commonVideoFields,
    id           : globalIdField('Video'),
    brightcoveId : {
      title : 'Brightcove Video Id',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces : [nodeInterface, videoType],
});

export const {
  connectionType : videoConnection,
  edgeType       : videoEdge,
} = connectionDefinitions({
  name     : 'Videos',
  nodeType : videoType,
  connectionFields : {
    count : {
      title : 'Count',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
});
