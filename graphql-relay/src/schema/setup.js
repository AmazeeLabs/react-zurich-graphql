/**
 * @file    data creator definitions.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import faker from 'faker';
import shuffle from 'lodash/shuffle';

import { createPerson } from './models/person';

/**
 * create persons
 *
 * @desc    Create dummy content persons.
 * @returns {Array}
 */
const createPersonsCreator = (count) => () => {

  // Create {count} persons but don't save them yet.
  const personsArray = Array.from(Array(count));
  const createdPersons = personsArray.map(() => createPerson({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }));

  // Find a random other person in the array of created persons.
  const otherPerson = (others, person) => shuffle(others).find((current) => current !== person);

  // Friendships are mutual, so add the reference to both persons.
  const addFriendship = (a, b) => {
    a.friends = [...(a.friends || []), b]; // eslint-disable-line no-param-reassign
    b.friends = [...(b.friends || []), a]; // eslint-disable-line no-param-reassign
  };

  // Everyone gets to pick one friend. Since we iterate on the entire list of
  // created persons, this will result in a nice, randomized set of relations
  // where every person has at least one friend.
  const addFriendshipToPerson = (persons) => (person) => addFriendship(person, otherPerson(persons, person));
  const addFriendshipToPersons = (persons) => persons.forEach(addFriendshipToPerson(persons)) || persons;

  // Add at least one friendship to every person.
  return Promise
    .all(createdPersons)
    .then(addFriendshipToPersons);
};

export default {
  persons: createPersonsCreator(100),
};
