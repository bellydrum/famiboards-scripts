import {cookie} from '../../cookie/cookie.es6';
import {shuffle} from '../../misc/shuffle.es6';

import {HEADLINE_LIMIT, TOTAL_HEADLINES} from '../globals/famifeedGlobals.es6';

let CURRENT_HEADLINE_COUNT = 0;

export function applyToPage(responseData, cookieLoad=false) {
  /**
   * Applies headline data to the web page
   * @param responseData - {
   *      source: String,
   *      items: [
   *          { title: String, link: String, source: String },
   *          { ... },
   *      ]
   *  }
   * */
  const feedSource = responseData.source;
  const sourceHeadlines = cookieLoad === true ?
    responseData.items :
    responseData.items.slice(0, HEADLINE_LIMIT);
  const famifeedHeadlineContainer = document.querySelector('.famifeed__item');
  let headlineData = [];
  const shuffledSourceHeadlines = shuffle(sourceHeadlines);
  for (const headline of shuffledSourceHeadlines) {
    const headlineTextSource = document.createElement('b');
    headline.title = headline.title.replace(headline.source + ': ', '');
    headline.title = headline.title.replace('&amp;', '&');
    const headlineTextTitle = document.createTextNode(
      ' | ' + headline.title.replace(headline.source + ': ', '')
    );
    headlineTextSource.innerHTML = feedSource === "cookie" ?
      headline.source.toUpperCase() :
      feedSource.toUpperCase();
    const headlineText = headline.title;
    const linkUrl = headline.link;
    headlineData.push({
      headlineText: headlineText,
      linkUrl: linkUrl,
    });
    const feedAnchor = document.createElement('a');
    const feedTextContainer = document.createElement('div');
    const headlineTextContainer = document.createElement('div');
    headlineTextContainer.appendChild(headlineTextSource);
    headlineTextContainer.appendChild(headlineTextTitle);
    headlineTextContainer.classList.add('truncate');
    feedTextContainer.appendChild(headlineTextContainer);
    feedAnchor.appendChild(feedTextContainer);
    feedAnchor.setAttribute('href', linkUrl);
    feedAnchor.setAttribute('target', '_blank');
    feedAnchor.classList.add('famifeed__anchor');
    feedAnchor.setAttribute('onclick', 'return false;');
    feedTextContainer.setAttribute('class', 'famifeed__text off');
    famifeedHeadlineContainer.appendChild(feedAnchor);
    CURRENT_HEADLINE_COUNT += 1;
    if (CURRENT_HEADLINE_COUNT === TOTAL_HEADLINES) {
      /**
       * Handle completion of Famifeed population
       **/

      /** trigger the listener for populated feed **/
      const famifeedTicker = document.querySelector('.famifeed__ticker');
      famifeedTicker.classList.add("famifeed__ticker-updated");

      /** make news feed continuously scroll **/
      const famifeed = document.querySelector('.famifeed__ticker');
      const list = document.querySelector('.famifeed__list');
      famifeed.append(list.cloneNode(true));
    }
  }
  return headlineData;
}
