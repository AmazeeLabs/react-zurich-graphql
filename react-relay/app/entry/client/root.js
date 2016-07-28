/**
 * @file    routing and redux setup wrapper
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

/**
 * Root component for setting up the redux provider and route container.
 *
 * Needs to be in a separate file to enable hot reloading.
 */

import React from 'react';
import { Router } from 'react-router';

// For some inexplainable reason, this import is required to make hot-reloading
// work. I have no clue why.
import 'createRoutes';

export default (props) => <Router {...props} />
