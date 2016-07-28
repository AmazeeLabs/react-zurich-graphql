/**
 * @file    mock schema for images.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import { nodeInterface } from '../node';

export const imageType = new GraphQLObjectType({
  name   : 'Image',
  fields : () => ({
    id : globalIdField('Image'),
    imageId : {
      title   : 'Image Id',
      type    : new GraphQLNonNull(GraphQLString),
      resolve : ({ id }) => id,
    },
    url : {
      title : 'Url',
      type  : new GraphQLNonNull(GraphQLString),
    },
    alt : {
      title : 'Alt',
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
  }),
  interfaces : [nodeInterface],
});

export const {
  connectionType : imageConnection,
  edgeType       : imageEdge,
} = connectionDefinitions({
  name     : 'Images',
  nodeType : imageType,
  connectionFields : {
    count : {
      title : 'Count',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
});
