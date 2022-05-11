import {RSS_FEEDS} from './rssFeeds.es6';

export const FF_PREF_COOKIE = 'famifeed_preference';
export const FF_CACHE_AVAIL = 'get_famifeed_from_cache';
export const FF_CACHE = 'famifeed_headline_data';
export const FF_CACHE_EXPIRY = 'famifeed_cache_expiry';
export const FF_CACHE_EXPIRY_TIME = 60000 * 5;
export const HEADLINE_LIMIT = 2;
export const SOURCE_LIMIT = 100;
export const HEADLINE_CHAR_LIMIT = 85;
export const TOTAL_HEADLINES = Math.min(RSS_FEEDS.length, SOURCE_LIMIT) * HEADLINE_LIMIT;
export const RSS_COOKIE_EXPIRY = 60;
export const CIAO_CIAO_GIF_PATH = '/data/assets/logo/famifeed/ciaociao.gif';
export const CIAO_CIAO_IMG_PATH = '/data/assets/logo/famifeed/ciaociao-still.gif';
export const ON = 'on';
export const OFF = 'off';
export const COOKIE_VALUE_DIVIDER = '---';
