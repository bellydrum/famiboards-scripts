import {shuffle} from '../../misc/shuffle.es6';
import {RSS_FEEDS} from '../globals/rssFeeds.es6';
import {HEADLINE_LIMIT, SOURCE_LIMIT} from '../globals/famifeedGlobals.es6';

export async function fetchFromRss() {
  const topFeeds = shuffle(RSS_FEEDS).slice(0, SOURCE_LIMIT);
  const returnedHeadlines = [];
  for (const rssFeed of topFeeds) {
    const response = await getFeedJson(rssFeed.url);
    returnedHeadlines.push(...response.items.slice(0, HEADLINE_LIMIT).map(item => {
      return {link: item.link, source: rssFeed.source, title: item.title}
    }));
  }
  return returnedHeadlines;
}

async function getFeedJson(rssFeedUrl) {
  const apiKey = process.env.FAMIFEED_RSS_API_KEY;
  const baseUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const url = baseUrl + encodeURIComponent(rssFeedUrl);
  let response;
  try {
    response = await $.ajax({
      url: url,
      type: "GET",
      data: {
        api_key: apiKey,
      },
      error: function(error) {
        console.log(error);
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
