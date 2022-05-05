import {cookie} from '../../cookie/cookie.es6';
import {HEADLINE_LIMIT, TOTAL_HEADLINES, COOKIE_VALUE_DIVIDER} from '../globals/famifeedGlobals.es6';

export function updateFamifeedFromCookie() {
  /**
   *  RETRIEVE FROM COOKIE STORAGE TYPE 2 (few long cookies)
   *    eg:
   *      sources: "source--source--source",
   *      headlines: "blah blah blah---blah blah--- blah blah",
   *      urls: "https://yo.com---https://yo.com--- https://yo.com"
   **/
  let sourceIterator = 0;

  const famifeedSources = cookie.getValueByKey('famifeed_sources').split(COOKIE_VALUE_DIVIDER);
  const famifeedHeadlines = cookie.getValueByKey('famifeed_headlines').split(COOKIE_VALUE_DIVIDER);
  const famifeedUrls = cookie.getValueByKey('famifeed_urls').split(COOKIE_VALUE_DIVIDER);
  return [...Array(TOTAL_HEADLINES).keys()].map((i) => {
    if (i % HEADLINE_LIMIT === 0 && i !== 0) sourceIterator ++;
    return {
      link: famifeedUrls[i],
      source: famifeedSources[sourceIterator],
      // title: cookie.getValueByKey('headlineText' + (i + 1)),  // COOKIE STORAGE TYPE 1
      title: decodeURIComponent(famifeedHeadlines[i]),  // COOKIE STORAGE TYPE 2
    };
  });

  /**
   *  RETRIEVE FROM COOKIE STORAGE TYPE 1 (many short cookies)
   *      eg:
   *          headline1: "blah blah",
   *          headline2: "blah blah",
   *          link1: "https://blah.com",
   *          link2: "https://blah.com",
   *          source1: "source",
   *          source2: "source",
   **/
  /**
   return Object.entries(cookieObject).reduce(
   (prev, curr, iter, arr) => {
                if (curr[0].includes('headlineText')) {
                    const famifeedItem = {
                        title: cookieObject[curr[0]],
                        link: decodeURIComponent(
                            cookieObject[
                                'linkUrl' + Math.floor(
                                    curr[0].replace('headlineText', '')
                                )
                            ]
                        ),
                        source: cookieObject['source' + Math.floor(curr[0].replace('headlineText', ''))],
                    };
                    prev.push(famifeedItem);
                }
                return prev;
            }, []
   );
   **/
}
