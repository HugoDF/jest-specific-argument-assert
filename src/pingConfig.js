const pingConfigs = [
  {
    url: 'https://codewithhugo.com',
    accountId: 1
  },
  {
    url: 'https://example.codewithhugo.com',
    accountId: 1
  },
  {
    url: 'https://google.com',
    accountId: 2
  },
  {
    url: 'https://github.com/HugoDF',
    accountId: 2
  }
];

// async function since response would normally
// be a database call away
const getPingConfigs = async (accountId, offset, limit, searchRegex) => {
  return pingConfigs
    .filter(conf => conf.accountId === accountId && conf.url.match(searchRegex))
    .slice(offset)
    .slice(0, limit);
};

module.exports = { getPingConfigs };
