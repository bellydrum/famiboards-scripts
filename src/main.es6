/**
 * Entry file for the webpack bundle script.
 * Think of this as the "only" script file.
 **/

import {improveUsernameLineBreaks} from './misc/improveUsernameLineBreaks.es6';
import {activateFamifeed} from './famifeed/famifeed.es6';

improveUsernameLineBreaks();
await activateFamifeed();
