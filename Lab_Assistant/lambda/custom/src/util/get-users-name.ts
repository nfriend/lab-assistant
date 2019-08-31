import { first } from 'lodash';
import * as requestPromise from 'request-promise';

/**
 * Gets a user's full name (i.e. "Nathan Friend")
 * from a username (i.e. nfriend).
 * If no match is found, the username is returned.
 * @param username The username of the user _with_ the `@`
 * @rp A request-promise instance that is setup to make
 * authenticated calls to the GitLab.com API
 */
export const getUsersName = async (
  username: string,
  rp: typeof requestPromise,
): Promise<string> => {
  if (username.substring(0, 1) !== '@') {
    throw new Error('Username passed to getUsersName must begin with an "@"');
  }

  const usernameWithoutAt = username.substring(1);

  const users: any[] = await rp.get(
    `https://gitlab.com/api/v4/users?username=${usernameWithoutAt}`,
  );

  return users.length > 0 ? first(users).name : username;
};
