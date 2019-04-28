# jest-specific-argument-assert

> Jest assert over single or specific argument/parameters with .toHaveBeenCalledWith and expect.anything()

See it in action at https://codesandbox.io/s/github/HugoDF/jest-specific-argument-assert/tree/master/

Most of the interesting things happen in [./src/pinger.test.js](./src/pinger.test.js).

To run the tests:

- `npm install` (Node 10+, npm 6+)
- `npm test` to run tests (or `npm test -- --coverage` to run with coverage)

Note the use of `expect.anyting()` to ignore certain parameters to a function that aren't asserted against for specific tests.

```js
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
```
