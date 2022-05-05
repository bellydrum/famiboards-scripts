/**
 * Entry file for the webpack bundle script.
 * Think of this as the "only" script file.
 **/

import {cookie} from './cookie/cookie.es6';
import {improveUsernameLineBreaks} from './misc/improveUsernameLineBreaks.es6';
import {activateFamifeed} from './famifeed/famifeed.es6';
import {FF_PREF_COOKIE, FF_AVAIL_COOKIE} from './famifeed/globals/famifeedGlobals.es6';

improveUsernameLineBreaks();
activateFamifeed(cookie.getValueByKey(FF_PREF_COOKIE),cookie.getValueByKey(FF_AVAIL_COOKIE) === 'true');
