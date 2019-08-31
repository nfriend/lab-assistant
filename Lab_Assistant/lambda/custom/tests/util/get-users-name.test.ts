import { getUsersName } from '../../src/util/get-users-name';

describe('getUsersName', () => {
  const rpMock: any = {
    get: (url: string) => {
      let result: any[];
      if (url.includes('nfriend')) {
        result = [{ name: 'Nathan Friend' }];
      } else {
        result = [];
      }
      return Promise.resolve(result);
    },
  };

  test('when the username is a match', async () => {
    expect(await getUsersName('@nfriend', rpMock)).toBe('Nathan Friend');
  });

  test('when the username is not a match', async () => {
    expect(await getUsersName('@notarealuser', rpMock)).toBe('@notarealuser');
  });
});
