import {cookie} from '../../cookie/cookie.es6';
import {shuffle} from '../../misc/shuffle.es6';
import {setFamifeedVisibility} from '../famifeed.es6';
import {applyToPage} from './applyToPage.es6';

import {RSS_FEEDS} from '../globals/rssFeeds.es6';
import {FF_PREF_COOKIE, SOURCE_LIMIT, TOTAL_HEADLINES, RSS_COOKIE_EXPIRY, COOKIE_VALUE_DIVIDER,
  TIMEOUTS} from '../globals/famifeedGlobals.es6';

let WAITING_FOR_RSS_RESPONSE = false;

export function updateFamifeed() {
  /**
   * Entry point for fetching data from RSS feeds.
   *
   * @calls
   *  getFeedData
   *  setFamifeedVisibility
   *  updateFamifeed (recursively)
   * @modifies
   *  WAITING_FOR_RSS_RESPONSE
   *  TIMEOUTS
   * @type {Element}
   */
  const famifeedTickerUpdated = document.querySelector('.famifeed__ticker-updated');
  if (famifeedTickerUpdated === null) {
    if (WAITING_FOR_RSS_RESPONSE === false) {
      WAITING_FOR_RSS_RESPONSE = true;
      getFeedData();
    }
    const timeout = setTimeout(updateFamifeed, 500);
    clearTimeout(TIMEOUTS[0]);
    TIMEOUTS.shift();
    TIMEOUTS.push(timeout);
    return false;
  } else {
    clearTimeout(TIMEOUTS[0]);
    TIMEOUTS.shift();
    const preference = cookie.getValueByKey(FF_PREF_COOKIE);
    setFamifeedVisibility(preference);
    return true;
  }
}

function getFeedJson(rssFeedUrl) {
  /**
   *  Returns an RSS feed as JSON.
   * */
  const apiKey = process.env.FAMIFEED_RSS_API_KEY;
  const baseUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const url = baseUrl + encodeURIComponent(rssFeedUrl);

  return $.ajax({
    url: url,
    type: "GET",
    data: {
      api_key: apiKey,
    },
    error: function(error) {
      console.log(error);
    }
  });
}

export function getFeedData() {
  /**
   *  1. Requests and displays RSS feed data.
   *  2. Stores RSS feed data in cookie.
   *
   *  @calls
   *   getFeedJson
   *   applyToPage
   *   cookie.add
   *  @modifies
   *   document (cookie, applyToPage)
   * */
  const topFeeds = shuffle(RSS_FEEDS).slice(0, SOURCE_LIMIT);
  let headlineCounter = 1;
  let sourcesCookieValue = '';
  let headlinesCookieValue = '';
  let urlsCookieValue = '';

  for (const rssFeed of topFeeds) {
    getFeedJson(rssFeed.url).then(response => {
      const responseData = {
        source: rssFeed.source,
        items: response.items,
      };

      sourcesCookieValue += responseData.source + COOKIE_VALUE_DIVIDER;
      const headlines = applyToPage(responseData);

      for (let headline of headlines) {
        /**
         *  COOKIE STORAGE TYPE 1 (many short cookies)
         *      eg:
         *          headline1: "blah blah",
         *          headline2: "blah blah",
         *          link1: "https://blah.com",
         *          link2: "https://blah.com",
         *          source1: "source",
         *          source2: "source",
         **/

        /**
        const headlineTextCookieName = "headlineText" + headlineCounter;
        const linkUrlCookieName = "linkUrl" + headlineCounter;
        const headlineCookieObject = {["headlineText" + headlineCounter]: headline.headlineText};
        const linkUrlCookieObject = {["linkUrl" + headlineCounter]: encodeURIComponent(headline.linkUrl)};
        const sourceCookieObject = {["source" + headlineCounter]: responseData.source};
        cookie.add(headlineCookieObject, RSS_COOKIE_EXPIRY);
        cookie.add(linkUrlCookieObject, RSS_COOKIE_EXPIRY);
        cookie.add(sourceCookieObject, RSS_COOKIE_EXPIRY);
         **/

        /**
         *  COOKIE STORAGE TYPE 2 (few long cookies)
         *    eg:
         *      sources: "source--source--source",
         *      headlines: "blah blah blah---blah blah--- blah blah",
         *      urls: "https://yo.com---https://yo.com--- https://yo.com"
         **/

        headlinesCookieValue += encodeURIComponent(headline.headlineText) + COOKIE_VALUE_DIVIDER;
        urlsCookieValue += headline.linkUrl + COOKIE_VALUE_DIVIDER;

        if (headlineCounter === TOTAL_HEADLINES) {
          const sliceValue = 0 - COOKIE_VALUE_DIVIDER.length;
          cookie.add({
            famifeed_sources: sourcesCookieValue.slice(
              0, sliceValue
            )
          }, RSS_COOKIE_EXPIRY);
          cookie.add({
            famifeed_headlines: headlinesCookieValue.slice(
              0, sliceValue
            )
          }, RSS_COOKIE_EXPIRY);
          cookie.add({
            famifeed_urls: urlsCookieValue.slice(
              0, sliceValue
            )
          }, RSS_COOKIE_EXPIRY);
          cookie.add({get_famifeed_from_cookie: "true"}, RSS_COOKIE_EXPIRY);
        } else {
          headlineCounter += 1;
        }
      }
    });
  }
}
