import {RSS_FEEDS} from './rssFeeds.es6';

/** immutable constants **/
export const FF_PREF_COOKIE = 'famifeed_preference';
export const FF_AVAIL_COOKIE = 'get_famifeed_from_cookie';
export const HEADLINE_LIMIT = 2;
export const SOURCE_LIMIT = 10;
export const HEADLINE_CHAR_LIMIT_CLASSNAME = 'famifeed__char-limit-';
export const HEADLINE_CHAR_LIMIT = 85;
export const TOTAL_HEADLINES = Math.min(RSS_FEEDS.length, SOURCE_LIMIT) * HEADLINE_LIMIT;
export const RSS_COOKIE_EXPIRY = 60;
export const CIAO_CIAO_GIF_PATH = '/data/assets/logo/famifeed/ciaociao.gif';
export const CIAO_CIAO_IMG_PATH = '/data/assets/logo/famifeed/ciaociao-still.gif';
export const ON = 'on';
export const OFF = 'off';
export const COOKIE_VALUE_DIVIDER = '---';
