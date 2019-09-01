import { buildUrlParams } from '../../src/util/build-url-params';

describe('buildUrlParams', () => {
  test('should build a URL query string', () => {
    const input = {
      param1: 'value1',
      param2: 'value2',
    };
    const expected = 'param1=value1&param2=value2';
    expect(buildUrlParams(input)).toBe(expected);
  });
});
