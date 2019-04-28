// Half-baked implementation of an uptime monitor
const axios = require('axios');
const { getPingConfigs } = require('./pingConfig');

async function getUrlsForAccount(accountId, offset, limit, searchRegex) {
  const configs = await getPingConfigs(accountId, offset, limit, searchRegex);
  return configs.map(conf => conf.url);
}

async function isUp(url) {
  try {
    await axios.head(url);
    return true;
  } catch (e) {
    if (!e.response) {
      // error is not caused by 4xx or 5xx status code
      throw e;
    }
    return false;
  }
}

const getStatusForUrl = async url => ({
  url: url,
  isUp: await isUp(url)
});

// allow pinging by:
// - accountId
// - arbitrary search string (which we run against urls for partial matches)
async function pinger(accountId, { offset = 0, limit = 50 } = {}, search) {
  // the fact that we have an internal function called getUrlsForAccount is irrelevant
  const searchRegex = search
    ? new RegExp(search.split(' ').join('|'))
    : new RegExp('.*');
  const urls = await getUrlsForAccount(accountId, offset, limit, searchRegex);
  const responses = await Promise.all(urls.map(u => getStatusForUrl(u)));
  return responses;
}

module.exports = pinger;
