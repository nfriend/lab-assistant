import { first } from 'lodash';

/**
 * Always returns the **first** item in the list, for testing purposes
 * @param items The list of items to choose from
 */
export function chooseOne<T>(...items: T[]) {
  return first(items);
}
