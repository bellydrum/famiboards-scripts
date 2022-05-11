import {shuffle} from '../../misc/shuffle.es6';
import {HEADLINE_CHAR_LIMIT, TOTAL_HEADLINES} from '../globals/famifeedGlobals.es6';

export function applyToPage(headlines) {
  /**
   * @param headlines {array<link, source, title>} - headlines to display on Famifeed.
   *
   * 1. Determine scroll speed
   * 2. Set the scroll speed
   * 3. Apply headline data to page
   */

  /** 1. Determine scroll speed **/
  let scrollDuration = (TOTAL_HEADLINES + 1) * 7;
  const scrollDurationUnits = Math.floor(scrollDuration * 0.09);
  const famifeedList = document.querySelector('.famifeed__ticker').firstElementChild;
  const customHeadlineCharLimit = parseInt(famifeedList.dataset.famifeedCharLimit);
  if (customHeadlineCharLimit) {
    if (customHeadlineCharLimit >= 75) scrollDuration -= (scrollDurationUnits)
    else if (customHeadlineCharLimit >= 65) scrollDuration -= (scrollDurationUnits * 2)
    else if (customHeadlineCharLimit >= 55) scrollDuration -= (scrollDurationUnits * 3)
    else if (customHeadlineCharLimit >= 45) scrollDuration -= (scrollDurationUnits * 4)
    else if (customHeadlineCharLimit >= 35) scrollDuration -= (scrollDurationUnits * 5)
    else if (customHeadlineCharLimit >= 25) scrollDuration -= (scrollDurationUnits * 6)
    else scrollDuration -= (scrollDurationUnits * 7)
  }

  /** 2. Set the scroll speed **/
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
