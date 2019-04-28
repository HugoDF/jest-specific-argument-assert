const mockHead = jest.fn();
jest.mock('axios', () => ({
  head: mockHead
}));
const mockPingConfig = jest.fn().mockResolvedValue([]);
jest.mock('./pingConfig', () => ({
  getPingConfigs: mockPingConfig
}));

const pinger = require('./pinger');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('pinger', () => {
  describe('without search', () => {
    test('calls getPingConfigs with right accountId, searchRegex', async () => {
      await pinger(1);
      expect(mockPingConfig).toHaveBeenCalledWith(
        1,
        expect.anything(),
        expect.anything(),
        new RegExp('.*')
      );
    });
  });
  describe('offset, limit', () => {
    test('calls getPingConfigs with passed offset and limit', async () => {
      await pinger(1, { offset: 20, limit: 100 });
      expect(mockPingConfig).toHaveBeenCalledWith(
        1,
        20,
        100,
        expect.anything()
      );
    });
    test('calls getPingConfigs with default offset and limit if undefined', async () => {
      await pinger(1);
      expect(mockPingConfig).toHaveBeenCalledWith(1, 0, 50, expect.anything());
    });
  });
  describe('search', () => {
    describe('single-word search', () => {
      test('calls getPingConfigs with right accountId, searchRegex', async () => {
        await pinger(1, {}, 'search');
        expect(mockPingConfig).toHaveBeenCalledWith(
          1,
          expect.anything(),
          expect.anything(),
          new RegExp('search')
        );
      });
    });
    describe('multi-word search', () => {
      test('calls getPingConfigs with right accountId, searchRegex', async () => {
        await pinger(1, {}, 'multi word search');
        expect(mockPingConfig).toHaveBeenCalledWith(
          1,
          expect.anything(),
          expect.anything(),
          new RegExp('multi|word|search')
        );
      });
    });
  });
  // included for completeness
  test('calls axios.head with each url of entries returned by getPingConfigs', async () => {
    mockPingConfig.mockResolvedValueOnce([
      { url: 'http://domain.tld' },
      { url: 'http://example.tld' }
    ]);
    await pinger(1);

    expect(mockHead).toHaveBeenCalledWith('http://domain.tld');
    expect(mockHead).toHaveBeenCalledWith('http://example.tld');
  });
  test('returns list of { url, isUp } correctly based on axios.head response', async () => {
    const upDomain = 'http://example.tld';
    const downDomain = 'http://other-domain.tld';
    mockPingConfig.mockResolvedValueOnce([
      { url: upDomain },
      { url: downDomain }
    ]);
    mockHead.mockImplementation(async url => {
      if (url === upDomain) return {};
      const axiosStyleError = new Error();
      axiosStyleError.response = {};
      throw axiosStyleError;
    });
    const expected = [
      { url: upDomain, isUp: true },
      { url: downDomain, isUp: false }
    ];
    const actual = await pinger(1);
    expect(actual).toEqual(expected);
  });
  test('throws if error thrown from axios is not caused by 4xx or 5xx status code', async () => {
    mockPingConfig.mockResolvedValueOnce([
      { url: 'example.tld' },
    ]);
    mockHead.mockImplementation(async () => {
      throw Error('my error')
    });
    expect(pinger(1)).rejects.toEqual(new Error('my error'))
  })
});
