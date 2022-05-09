import {cookie} from '../../cookie/cookie.es6';
import {HEADLINE_LIMIT, TOTAL_HEADLINES, COOKIE_VALUE_DIVIDER} from '../globals/famifeedGlobals.es6';

export function fetchFromCookie() {
  let sourceIterator = 0;
  const famifeedSources = cookie.getValueByKey('famifeed_sources').split(COOKIE_VALUE_DIVIDER);
  const famifeedTitles = cookie.getValueByKey('famifeed_titles').split(COOKIE_VALUE_DIVIDER);
  const famifeedLinks = cookie.getValueByKey('famifeed_links').split(COOKIE_VALUE_DIVIDER);
  return [...Array(TOTAL_HEADLINES).keys()].map((i) => {
    if (i % HEADLINE_LIMIT === 0 && i !== 0) sourceIterator ++;
    return {
      link: decodeURIComponent(famifeedLinks[i]),
      source: decodeURIComponent(famifeedSources[sourceIterator]),
      title: decodeURIComponent(famifeedTitles[i]),
    };
  });
}
