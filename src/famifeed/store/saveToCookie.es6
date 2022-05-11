import {COOKIE_VALUE_DIVIDER, HEADLINE_LIMIT, RSS_COOKIE_EXPIRY} from '../globals/famifeedGlobals.es6';
import {cookie} from '../../cookie/cookie.es6';

export function saveToCookie(headlines) {
  /** prevent overloading of cookie **/
  headlines = headlines.slice(0, 20);
  const sources = Object.values(headlines).map(headline => encodeURIComponent(headline.source));
  let i = sources.length;
  while (i--) (i + 1) % HEADLINE_LIMIT === 0 && (sources.splice(i, 1));
  let linksCookieValue = Object.values(headlines)
    .map(headline => encodeURIComponent(headline.link))
    .join(COOKIE_VALUE_DIVIDER);
  let sourcesCookieValue = sources
    .join(COOKIE_VALUE_DIVIDER);
  let titlesCookieValue = Object.values(headlines)
    .map(headline => encodeURIComponent(headline.title))
    .join(COOKIE_VALUE_DIVIDER);
  cookie.add({famifeed_sources: sourcesCookieValue}, RSS_COOKIE_EXPIRY);
  cookie.add({famifeed_titles: titlesCookieValue}, RSS_COOKIE_EXPIRY);
  cookie.add({famifeed_links: linksCookieValue}, RSS_COOKIE_EXPIRY);
  cookie.add({get_famifeed_from_cache: 'true'}, RSS_COOKIE_EXPIRY);
}
