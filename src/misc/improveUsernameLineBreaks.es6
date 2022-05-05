/**
 *  improve line breaks on usernames
 **/
export const improveUsernameLineBreaks = () => {
  const memberUsernames = document.querySelectorAll("[data-xf-init='member-tooltip'][itemprop='name']");
  for (let i of memberUsernames) {
    const username = i.text
    if (username.length >= 15) {
      const usernameWords = username.split(' ');
      let noWordsGreaterThan17 = true;
      for (let word of usernameWords) {
        if (word.length > 17) {
          noWordsGreaterThan17 = false;
        }
      }
      if (noWordsGreaterThan17) {
        i.setAttribute('style', 'white-space:nowrap');
      }
    }
  }
}
