import * as i18n from 'i18next';
import { isNaN } from 'lodash';
import { mft } from './mark-for-translation';

export interface PaginationInfo {
  /** Whether or not there are more records */
  isMore: boolean;

  /**
   * The text that should be spoken to prompt the user
   * if they want to continue to the next page.
   * Will only be provided if `isMore === true`.
   */
  moreText?: string;

  /**
   * The next page to get.
   * Will only be provided if `isMore === true`.
   */
  nextPage?: number;
}

export const getPagination = (
  headers: { [key: string]: string },
  typeSingular: string,
  typePlural: string,
): PaginationInfo => {
  const nextPage = parseInt(headers['x-next-page'], 10);
  const isMore = !isNaN(nextPage);

  if (isMore) {
    const count = parseInt(headers['x-total'], 10);
    const currentPage = parseInt(headers['x-page'], 10);
    const perPage = parseInt(headers['x-per-page'], 10);
    const remaining = count - currentPage * perPage;

    const remainingText =
      remaining === 1
        ? mft(
            'You have one more {{typeSingular}}. Would you like me to read it?',
          )
        : mft(
            'You have {{remaining}} more {{typePlural}}. Would you like me to keep going?',
          );

    return {
      isMore: true,
      moreText: i18n.t(remainingText, { remaining, typeSingular, typePlural }),
      nextPage,
    };
  } else {
    return {
      isMore: false,
    };
  }
};
