import {FF_CACHE, FF_CACHE_AVAIL, FF_CACHE_EXPIRY, FF_CACHE_EXPIRY_TIME} from '../globals/famifeedGlobals.es6';

export function fetchFromLocalStorage() {
  const famifeedExpiry = JSON.parse(localStorage.getItem(FF_CACHE_EXPIRY));
  const headlineData = JSON.parse(localStorage.getItem(FF_CACHE));
  if ((Date.now() - famifeedExpiry) >= FF_CACHE_EXPIRY_TIME) {
    localStorage.removeItem(FF_CACHE);
    localStorage.removeItem(FF_CACHE_EXPIRY);
    localStorage.setItem(FF_CACHE_AVAIL, 'false');
  }
  return headlineData;
}
