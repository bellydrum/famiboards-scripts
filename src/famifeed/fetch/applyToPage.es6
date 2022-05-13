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
  /**
   * A really stupid formula that actually works.
   *  BASE_SCROLL_DURATION
   *    - intended for use with the max character limit (85 characters)
   *    - derived using the number of headlines rendered on the page
   *  SCROLL_DURATION_UNITS
   *    - intended to be subtracted from the BASE_SCROLL_DURATION to derive the current scroll duration
   *    - derived from a percentage of BASE_SCROLL_DURATION
   *  - define scroll duration "units" for modifying said base scroll duration.
   *  - subtract a number of said units from the
   */
  const BASE_SCROLL_DURATION = (TOTAL_HEADLINES + 1) * 7;
  const SCROLL_DURATION_UNITS = Math.floor(BASE_SCROLL_DURATION * 0.09);

  const famifeedList = document.querySelector('.famifeed__ticker').firstElementChild;
  const currentCharLimit = parseInt(famifeedList.dataset.famifeedCharLimit);
  let currentScrollDuration = BASE_SCROLL_DURATION;
  if (currentCharLimit) {
    if (currentCharLimit >= 75) currentScrollDuration -= (SCROLL_DURATION_UNITS)
    else if (currentCharLimit >= 65) currentScrollDuration -= (SCROLL_DURATION_UNITS * 2)
    else if (currentCharLimit >= 55) currentScrollDuration -= (SCROLL_DURATION_UNITS * 3)
    else if (currentCharLimit >= 45) currentScrollDuration -= (SCROLL_DURATION_UNITS * 4)
    else if (currentCharLimit >= 35) currentScrollDuration -= (SCROLL_DURATION_UNITS * 5)
    else if (currentCharLimit >= 25) currentScrollDuration -= (SCROLL_DURATION_UNITS * 6)
    else currentScrollDuration -= (SCROLL_DURATION_UNITS * 7)
  }

  /** 2. Set the scroll speed **/
  document.querySelector(':root').style
    .setProperty('--famifeed-scroll-duration', `${currentScrollDuration}s`);

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
    /** clean up results from FamiComms **/
    if (headline.source.toLowerCase().includes('famicomms')) {
      if (headlineTitle.includes('--')) {
        console.log(`before: ${headlineTitle}`);
        headlineTitle = headlineTitle.replace(/--.+--\n\n/g, '');
      } else {
        headlineTitle = headlineTitle.replace(/\s.+: \n\n/, ': ');
      }
      console.log(`after: ${headlineTitle}`);
    }

    /** remove redundant twitter usernames from tweet content **/
    headlineTitle = headlineTitle.replace(headline.source + ': ', '');

    /** truncate headline title **/
    headlineTitle = currentCharLimit ?
      headlineTitle.slice(0, Math.min(Math.max(15, currentCharLimit), HEADLINE_CHAR_LIMIT)) :
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
