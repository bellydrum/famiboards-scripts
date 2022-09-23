export const improveUsernameLineBreaks = () => {
  /**
   * improvements for username displays
   */
  const upperToLowerRatioMap = [17, 16, 16, 16, 16, 15, 15, 15, 15, 14, 14, 14, 14]
  const maxUpperCaseWordLength = upperToLowerRatioMap.length

  const truncateWord = (word) => {
    /** truncate a word at a point depending on its length and number of capital letters **/
    const numberOfCapitalLetters = word.length - word.replace(/[A-Z]/g, '').length
    if (numberOfCapitalLetters > maxUpperCaseWordLength) {
      return word.slice(0, maxUpperCaseWordLength - 1) + '...';
    } else {
      const maxAllowedLength = upperToLowerRatioMap[numberOfCapitalLetters]
      if ((numberOfCapitalLetters + (word.length - numberOfCapitalLetters)) > maxAllowedLength) {
        return word.slice(0, maxAllowedLength - 3) + '...';
      } else {
        return word
      }
    }
  }

  const memberUsernames = document.querySelectorAll("[data-xf-init='member-tooltip'][itemprop='name']");
  for (let i of memberUsernames) {
    const username = i.text
    /** if username contains no spaces **/
    if (username.indexOf(' ') < 0) {
      /** if username risks going out-of-bounds **/
      if (username.length >= maxUpperCaseWordLength) {
        i.text = truncateWord(i.text);
        i.setAttribute('style', 'white-space:nowrap');
      }
    /** if username contains spaces **/
    } else {
      /** truncate any individual words as needed **/
      i.text = username.split(' ').map(word => truncateWord(word) + ' ').join(' ')
      /** set whitespace wrapping behavior for container **/
      if ((username.replace(/\s+/g, '')).length > 10) {
        i.setAttribute('style', 'white-space:wrap');
      } else {
        i.setAttribute('style', 'white-space:nowrap');
      }
    }
  }
}