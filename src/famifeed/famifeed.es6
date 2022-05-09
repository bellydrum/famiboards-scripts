import {cookie} from '../cookie/cookie.es6';
import {fetchFromRss} from './fetch/fetchFromRss.es6';
import {fetchFromCookie} from './fetch/fetchFromCookie.es6';
import {applyToPage} from './fetch/applyToPage.es6';

import {
  FF_PREF_COOKIE,
  CIAO_CIAO_GIF_PATH,
  CIAO_CIAO_IMG_PATH,
  ON,
  OFF,
  FF_AVAIL_COOKIE
} from './globals/famifeedGlobals.es6';

//document.querySelector(':root').style.setProperty('--famifeed-scroll-duration', '1000s');

export async function activateFamifeed() {
  /**
   * Handles activation of Famifeed on page load.
   *
   * @param preference {string} -
   *
   * 1. Retrieve data from either RSS feeds or document cookie
   * 2. Apply data to page and save cookie if necessary
   * 3. Set Famifeed visibility
   * 4. Activate Famifeed toggle elements
   */

  const famifeedIsEnabled = document.querySelector('.famifeed__container') !== null;
  if (famifeedIsEnabled) {
    /** 1. Retrieve data from either RSS feeds or document cookie **/
    const useCookies = cookie.getValueByKey(FF_AVAIL_COOKIE) === 'true';
    useCookies ? console.log('Fetching data from cookies.') : console.log('Fetching data from RSS feeds.');
    /** 2. Apply data to page and save cookie if necessary **/
    applyToPage(useCookies ? await fetchFromCookie() : await fetchFromRss(), !useCookies);
    /** 3. Set Famifeed visibility **/
    toggleFamifeedVisibility(null, true);
    /** 4. Activate Famifeed toggle elements **/
    for (let toggle of document.querySelectorAll('[aria-label="famifeed-toggle"]')) {
      toggle.addEventListener('click', toggleFamifeedVisibility);
    }
  } else {
    console.log('Famifeed is disabled. Not requesting RSS data.');
  }
}

export function toggleFamifeedVisibility(event='click', pageload=false) {
  const toggleState = cookie.getValueByKey(FF_PREF_COOKIE);
  if (pageload === true) toggleState === ON ? setFamifeedVisibility(ON) : setFamifeedVisibility(OFF);
  else toggleState === ON ? setFamifeedVisibility(OFF) : setFamifeedVisibility(ON);
}

export function setFamifeedVisibility(state) {
  const feedContainer = document.querySelector(".famifeed__container");
  const headlineText = document.querySelectorAll(".famifeed__text");
  const feedBackgrounds = document.querySelectorAll(".famifeed__background");
  const feedAnchors = document.querySelectorAll(".famifeed__anchor");
  const ciaoCiao = document.querySelector(".famifeed__icon-img");
  const newCookie = {};
  if (state === ON) {
    ciaoCiao.setAttribute('src', CIAO_CIAO_GIF_PATH);
    newCookie[FF_PREF_COOKIE] = ON;
    feedContainer.classList.remove(OFF);
    feedContainer.classList.add(ON);
    for (let feed of headlineText) {
      feed.style.opacity = '1';
    }
    for (let background of feedBackgrounds) {
      background.classList.remove(OFF);
      background.classList.add(ON);
    }
    for (let anchor of feedAnchors) {
      anchor.classList.remove(OFF);
      anchor.classList.add(ON);
      anchor.removeAttribute('onclick');
    }
    cookie.add(newCookie);
  } else {
    ciaoCiao.setAttribute('src', CIAO_CIAO_IMG_PATH);
    newCookie[FF_PREF_COOKIE] = OFF;
    feedContainer.classList.remove(ON);
    feedContainer.classList.add(OFF);
    for (let feed of headlineText) {
      feed.style.opacity = '0';
      feed.classList.remove(ON);
      feed.classList.add(OFF);
    }
    for (let background of feedBackgrounds) {
      background.classList.remove(ON);
      background.classList.add(OFF);
    }
    for (let anchor of feedAnchors) {
      anchor.classList.remove(ON);
      anchor.classList.add(OFF);
      anchor.setAttribute('onclick', 'return false;');
    }
    cookie.add(newCookie);
  }
  /** make news feed continuously scroll **/
  const famifeedTicker = document.querySelector('.famifeed__ticker');
  const list = document.querySelector('.famifeed__list');
  famifeedTicker.append(list.cloneNode(true));
}
