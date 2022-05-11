import {cookie} from '../cookie/cookie.es6';
import {storageAvailable} from '../storage/localStorage.es6';
import {fetchFromRss} from './fetch/fetchFromRss.es6';
import {fetchFromLocalStorage} from './fetch/fetchFromLocalStorage.es6';
import {saveToLocalStorage} from './store/saveToLocalStorage.es6';
import {fetchFromCookie} from './fetch/fetchFromCookie.es6';
import {saveToCookie} from './store/saveToCookie.es6';
import {applyToPage} from './fetch/applyToPage.es6';

import {
  FF_PREF_COOKIE,
  CIAO_CIAO_GIF_PATH,
  CIAO_CIAO_IMG_PATH,
  ON,
  OFF,
  FF_CACHE_AVAIL
} from './globals/famifeedGlobals.es6';

export async function activateFamifeed() {
  /**
   * Handles activation of Famifeed on page load.
   *
   * @param preference {string} -
   *
   * 1. Check if Famifeed is enabled on the DOM
   * 2. Populate page with data from either request or localStorage cache
   * 3. Set Famifeed visibility
   * 4. Activate Famifeed toggle elements
   */

  /** 1. Check if Famifeed is enabled on the DOM **/
  const famifeedIsEnabled = document.querySelector('.famifeed__container') !== null;

  if (famifeedIsEnabled) {

    /** 2. Populate page with latest data, or cached data if available **/
    if (storageAvailable('localStorage') && localStorage.getItem(FF_CACHE_AVAIL) === 'true') {
      console.log('Fetching headlines from localStorage.');
      applyToPage(await fetchFromLocalStorage());
    } else if (cookie.getValueByKey(FF_CACHE_AVAIL) === 'true') {
      console.log('Fetching data from document cookie.');
      applyToPage(await fetchFromCookie());
    } else {
      console.log('Fetching data from RSS feeds.');
      const headlineData = await fetchFromRss();
      storageAvailable('localStorage') ?
        saveToLocalStorage(headlineData) :
        saveToCookie(headlineData);
      applyToPage(headlineData);
    }


    /** 3. Set Famifeed visibility **/
    toggleFamifeedVisibility(null, true);

    /** 4. Activate Famifeed toggle elements **/
    for (let toggle of document.querySelectorAll("[aria-label='famifeed-toggle']")) {
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
  const famifeedTicker = document.querySelector('.famifeed__ticker');
  const feedContainer = document.querySelector('.famifeed__container');
  const feedBackgrounds = document.querySelectorAll('.famifeed__background');
  const ciaoCiao = document.querySelector('.famifeed__icon-img');
  const newCookie = {};
  if (state === ON) {
    ciaoCiao.setAttribute('src', CIAO_CIAO_GIF_PATH);
    newCookie[FF_PREF_COOKIE] = ON;
    feedContainer.classList.remove(OFF);
    feedContainer.classList.add(ON);
    for (let background of feedBackgrounds) {
      background.classList.remove(OFF);
      background.classList.add(ON);
    }
    cookie.add(newCookie);
  } else {
    ciaoCiao.setAttribute('src', CIAO_CIAO_IMG_PATH);
    newCookie[FF_PREF_COOKIE] = OFF;
    feedContainer.classList.remove(ON);
    feedContainer.classList.add(OFF);
    for (let background of feedBackgrounds) {
      background.classList.remove(ON);
      background.classList.add(OFF);
    }
    cookie.add(newCookie);
  }
  /** make news feed continuously scroll **/
  const list = document.querySelector('.famifeed__list');
  famifeedTicker.append(list.cloneNode(true));
}
