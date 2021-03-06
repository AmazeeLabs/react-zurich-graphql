/**
 * @file    database drop script.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

// Load the environment configuration.
require('dotenv-extended').config({
  path     : '.env.local',
  defaults : '.env',
});

import mongoose from 'mongoose';

// Use promises for mongoose async operations.
mongoose.Promise = Promise;

/**
 * drop database
 *
 * @desc   main entry point for this script
 * @return {null}
 */
const dropDatabase = () => {
  console.log('Starting to drop the entire database.');

  mongoose.connection.db.dropDatabase(() => {
    console.log('Done.');

    process.exit();
  });
};

mongoose
  .connect(process.env.DATABASE)
  .then(dropDatabase);
