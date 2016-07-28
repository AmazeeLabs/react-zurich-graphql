import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import fetch from 'node-fetch';

const personType = new GraphQLObjectType({
  name : 'Person',
  description : 'A character from the StarWars universe.',
  fields : () => ({
    name : {
      type : GraphQLString,
    },
    height : {
      type : GraphQLString,
    },
    mass : {
      type : GraphQLString,
    },
    gender : {
      type : GraphQLString,
    },
    films : {
      type : new GraphQLList(filmType),
      resolve : (person) => person.films.map(getByUrl),
    },
  }),
});

const filmType = new GraphQLObjectType({
  name : 'Film',
  description : 'One of the many StarWars movies.',
  fields : () => ({
    title : {
      type : GraphQLString,
    },
    characters : {
      type : new GraphQLList(personType),
      resolve : (film) => film.characters.map(getByUrl),
    },
  }),
});

const getByUrl = (url) =>
  fetch(url).then((result) => result.json());

const getPersonById = (id) =>
  getByUrl(`http://swapi.co/api/people/${id}`);

export default new GraphQLSchema({
  query : new GraphQLObjectType({
    name        : 'Query',
    description : 'Query root',
    fields      : () => ({
      personById : {
        type  : personType,
        args  : {
          id : {
            type : new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve : async (_, { id }) => getPersonById(id),
      },
    }),
  }),
});
