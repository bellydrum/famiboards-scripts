import {cookie} from '../../cookie/cookie.es6';
import {shuffle} from '../../misc/shuffle.es6';
import {COOKIE_VALUE_DIVIDER, HEADLINE_LIMIT, HEADLINE_CHAR_LIMIT_CLASSNAME, HEADLINE_CHAR_LIMIT, TOTAL_HEADLINES,
  RSS_COOKIE_EXPIRY} from '../globals/famifeedGlobals.es6';

export function applyToPage(headlines, fromRss=false) {
  /**
   * @param headlines {array<link, source, title>} - headlines to display on Famifeed.
   * @param fromRSS {boolean} - indicator whether headlines comes from RSS or document cookie.
   *
   * 1. Apply headline data to page
   * 2. Determine scroll speed
   * 3. Save headlines to document cookie if necessary
   */

  /** 1. Save headlines to document cookie if necessary **/
  if (fromRss === true) {
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
    cookie.add({get_famifeed_from_cookie: 'true'}, RSS_COOKIE_EXPIRY);
  }

  /** 2. Determine scroll speed **/
  const famifeedList = document.querySelector('.famifeed__ticker').firstElementChild;
  const customHeadlineCharLimit = parseInt(famifeedList.dataset.famifeedCharLimit);

  let scrollDuration = (TOTAL_HEADLINES + 1) * 7;
  const scrollDurationUnits = Math.floor(scrollDuration * 0.09);
  if (customHeadlineCharLimit) {
    if (customHeadlineCharLimit >= 75) scrollDuration -= (scrollDurationUnits)
    else if (customHeadlineCharLimit >= 65) scrollDuration -= (scrollDurationUnits * 2)
    else if (customHeadlineCharLimit >= 55) scrollDuration -= (scrollDurationUnits * 3)
    else if (customHeadlineCharLimit >= 45) scrollDuration -= (scrollDurationUnits * 4)
    else if (customHeadlineCharLimit >= 35) scrollDuration -= (scrollDurationUnits * 5)
    else if (customHeadlineCharLimit >= 25) scrollDuration -= (scrollDurationUnits * 6)
    else scrollDuration -= (scrollDurationUnits * 7)
  }

  document.querySelector(':root').style
    .setProperty('--famifeed-scroll-duration', `${scrollDuration}s`);

  /** 3. Apply headline data to page **/
  const famifeedHeadlineContainer = document.querySelector('.famifeed__item');
  const shuffledHeadlines = shuffle(headlines);
  for (let headline of shuffledHeadlines) {
    const headlineSourceElement = document.createElement('b');
    headlineSourceElement.innerHTML = headline.source.toUpperCase();

    let headlineTitle = headline.title;
    const headlineTitleOriginalLength = headlineTitle.length;

    /** clean up results from nitter **/
    if (headlineTitle.slice(0, 5) === "R to ") headlineTitle = headlineTitle.slice(5, headlineTitle.length);
    else if (headlineTitle.slice(0, 6) === "RT by ") headlineTitle = headlineTitle.slice(6, headlineTitle.length);
    /** clean up results from Serebii **/
    if (headlineTitle.includes('Serebii')) headlineTitle = headlineTitle.replace(/Serebii [A-Z|a-z]*: /, '');

    /** remove redundant twitter usernames from tweet content **/
    headlineTitle = headlineTitle.replace(headline.source + ': ', '');

    /** truncate headline title **/
    headlineTitle = customHeadlineCharLimit ?
      headlineTitle.slice(0, Math.min(Math.max(15, customHeadlineCharLimit), HEADLINE_CHAR_LIMIT)) :
      headlineTitle.slice(0, HEADLINE_CHAR_LIMIT);
    headlineTitle += headlineTitle.length < headlineTitleOriginalLength ? '...' : '';
    const headlineTitleElement = document.createTextNode(' | ' + headlineTitle);

    const headlineTextContainerElement = document.createElement('div');
    headlineTextContainerElement.appendChild(headlineSourceElement);
    headlineTextContainerElement.appendChild(headlineTitleElement);
    headlineTextContainerElement.classList.add('truncate');

    const headlineContainerElement = document.createElement('div');
    headlineContainerElement.appendChild(headlineTextContainerElement);
    headlineContainerElement.setAttribute('class', 'famifeed__text off');

    /** turn nitter links into twitter links **/
    const headlineLink = headline.link.includes('https://nitter.net/') ?
      headline.link.replace(/nitter.net/, 'twitter.com') :
      headline.link;
    const headlineAnchorElement = document.createElement('a');
    headlineAnchorElement.appendChild(headlineContainerElement);
    headlineAnchorElement.setAttribute('href', headlineLink);
    headlineAnchorElement.setAttribute('target', '_blank');
    headlineAnchorElement.classList.add('famifeed__anchor');

    famifeedHeadlineContainer.appendChild(headlineAnchorElement);
  }
}
