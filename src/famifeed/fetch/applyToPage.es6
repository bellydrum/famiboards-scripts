import {cookie} from '../../cookie/cookie.es6';
import {shuffle} from '../../misc/shuffle.es6';
import {COOKIE_VALUE_DIVIDER, HEADLINE_LIMIT, RSS_COOKIE_EXPIRY} from '../globals/famifeedGlobals.es6';

export function applyToPage(headlines, fromRss=false) {
  /**
   * @param headlines {array<link, source, title>} - headlines to display on Famifeed.
   * @param fromRSS {boolean} - indicator whether headlines comes from RSS or document cookie.
   *
   * 1. Apply headline data to page
   * 2. Save headlines to document cookie if necessary
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

  /** 2. Apply headline data to page **/
  const famifeedHeadlineContainer = document.querySelector('.famifeed__item');
  const shuffledHeadlines = shuffle(headlines);
  for (let headline of shuffledHeadlines) {
    const headlineSourceElement = document.createElement('b');
    headlineSourceElement.innerHTML = headline.source.toUpperCase();
    const headlineTitleElement = document.createTextNode(' | ' + headline.title.replace(headline.source + ': ', ''));

    const headlineTextContainerElement = document.createElement('div');
    headlineTextContainerElement.appendChild(headlineSourceElement);
    headlineTextContainerElement.appendChild(headlineTitleElement);
    headlineTextContainerElement.classList.add('truncate');

    const headlineContainerElement = document.createElement('div');
    headlineContainerElement.appendChild(headlineTextContainerElement);
    headlineContainerElement.setAttribute('class', 'famifeed__text off');

    const headlineAnchorElement = document.createElement('a');
    headlineAnchorElement.appendChild(headlineContainerElement);
    headlineAnchorElement.setAttribute('href', headline.link);
    headlineAnchorElement.setAttribute('target', '_blank');
    headlineAnchorElement.classList.add('famifeed__anchor');
    headlineAnchorElement.setAttribute('onclick', 'return false;');

    famifeedHeadlineContainer.appendChild(headlineAnchorElement);
  }
}
