import { first, shuffle } from 'lodash';

/**
 * Randomly returns one item from the list
 * @param items The list of items to choose from
 */
export function chooseOne<T>(...items: T[]) {
  return first(shuffle(items));
}
