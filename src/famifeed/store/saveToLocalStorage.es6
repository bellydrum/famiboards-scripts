import {FF_CACHE, FF_CACHE_AVAIL, FF_CACHE_EXPIRY} from '../globals/famifeedGlobals.es6';

export function saveToLocalStorage(headlines) {
  localStorage.setItem(FF_CACHE, JSON.stringify(headlines));
  localStorage.setItem(FF_CACHE_EXPIRY, JSON.stringify(Date.now()));
  localStorage.setItem(FF_CACHE_AVAIL, 'true');
}
