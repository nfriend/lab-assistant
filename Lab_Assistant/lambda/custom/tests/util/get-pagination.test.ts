import { PaginationInfo, getPagination } from '../../src/util/get-pagination';

describe('getPagination', () => {
  test('when there are no more pages', () => {
    const headers = {};
    const expected: PaginationInfo = {
      isMore: false,
    };
    const output = getPagination(headers, 'item', 'items');
    expect(output).toEqual(expected);
  });

  test('when there is one more item', () => {
    const headers = {
      'x-next-page': '2',
      'x-total': '6',
      'x-page': '1',
      'x-per-page': '5',
    };
    const expected: PaginationInfo = {
      isMore: true,
      moreText: 'You have one more item. Would you like me to read it?',
      nextPage: 2,
    };
    const output = getPagination(headers, 'item', 'items');
    expect(output).toEqual(expected);
  });

  test('when there are several more items', () => {
    const headers = {
      'x-next-page': '2',
      'x-total': '7',
      'x-page': '1',
      'x-per-page': '5',
    };
    const expected: PaginationInfo = {
      isMore: true,
      moreText: 'You have 2 more items. Would you like me to keep going?',
      nextPage: 2,
    };
    const output = getPagination(headers, 'item', 'items');
    expect(output).toEqual(expected);
  });
});
