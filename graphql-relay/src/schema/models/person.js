/**
 * @file    mongodb model for persons.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import mongoose, { Schema } from 'mongoose';

const PersonSchema = new Schema({
  lastName : {
    type     : String,
    required : true,
  },
  firstName : {
    type     : String,
    required : true,
  },
  friends: {
    type : [Schema.Types.ObjectId],
    ref  : 'Person',
  },
});

const Person = mongoose.model('Person', PersonSchema);

export const getPersonById = (id) => Person.findById(id);
export const getPersonsByIds = (ids) => Person.find({ _id: { $in: ids } });
export const getAllPersons = () => Person.find({});

export const createPerson = (values) => Person.create(values);
export const deletePerson = (id) => Person.findByIdAndRemove(id);

export default Person;
