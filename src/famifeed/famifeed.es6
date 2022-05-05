import {cookie} from '../cookie/cookie.es6';
import {updateFamifeed} from './fetch/fetchFromRss.es6';
import {updateFamifeedFromCookie} from './fetch/fetchFromCookie.es6';
import {applyToPage} from './fetch/applyToPage.es6';

import {FF_PREF_COOKIE, CIAO_CIAO_GIF_PATH, CIAO_CIAO_IMG_PATH, ON, OFF} from './globals/famifeedGlobals.es6';

//document.querySelector(':root').style.setProperty('--famifeed-scroll-duration', '1000s');

export function activateFamifeed(preference=OFF, cookiesExist=false) {
  /**
   *  Initializes Famifeed on page load.
   *
   * @calls
   *  updateFamifeed
   *  updateFamifeedFromCookie
   *  applyToPage
   *  toggleFamifeedVisibility
   * @modifies
   *  document (el.addEventListener)
   * @returns null
   **/

  /* initialize Famifeed toggles on page */
  for (let toggle of document.querySelectorAll('[aria-label="famifeed-toggle"]')) {
    toggle.addEventListener("click", toggleFamifeedVisibility);
  }

  /* request updated feed data or grab existing feed data from cookie */
  if (cookiesExist === false) {
    console.log('Requesting feed data.');
    updateFamifeed();
  } else {
    console.log('Retrieving feed data from cookies.');
    const famifeedItemsToProcess = updateFamifeedFromCookie();
    const famifeedDataToProcess = {
      source: 'cookie',
      items: famifeedItemsToProcess
    }
    applyToPage(famifeedDataToProcess,true);
  }

  toggleFamifeedVisibility(null, true);
}

export function toggleFamifeedVisibility(event="click", pageload=false) {
  /**
   *  Toggles Famifeed visibility on or off.
   *
   * @calls
   *  cookie.getValueByKey
   *  setFamifeedVisibility
   * @returns null
   **/
  const toggleState = cookie.getValueByKey(FF_PREF_COOKIE);
  if (pageload === true) {
    toggleState === ON ? setFamifeedVisibility(ON) : setFamifeedVisibility(OFF);
  } else {
    toggleState === ON ? setFamifeedVisibility(OFF) : setFamifeedVisibility(ON);
  }
}

export function setFamifeedVisibility(state) {
  /**
   *  Changes page styles to display or hide certain elements of Famifeed.
   *
   * @calls
   *  cookie.add
   * @modifies
   *  document (cookie, el.setAttribute, el.classList, el.style.opacity)
   * @returns null
   **/
  const feedContainer = document.querySelector(".famifeed__container");
  const headlineText = document.querySelectorAll(".famifeed__text");
  const feedBackgrounds = document.querySelectorAll(".famifeed__background");
  const feedAnchors = document.querySelectorAll(".famifeed__anchor");
  const ciaoCiao = document.querySelector(".famifeed__icon-img");
  const newCookie = {};
  if (state === ON) {
    ciaoCiao.setAttribute("src", CIAO_CIAO_GIF_PATH);
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
      anchor.removeAttribute("onclick");
    }
    cookie.add(newCookie);
  } else {
    ciaoCiao.setAttribute("src", CIAO_CIAO_IMG_PATH);
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
      anchor.setAttribute("onclick", "return false;");
    }
    cookie.add(newCookie);
  }
}
