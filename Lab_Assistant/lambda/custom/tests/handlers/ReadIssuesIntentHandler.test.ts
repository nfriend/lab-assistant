import * as rp from 'request-promise';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/adapters/dynamo-db');

describe('ReadIssuesIntentHandler', () => {
  let response: any[];
  let headers: any;

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'ReadIssuesIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  jest.spyOn(rp, 'defaults').mockImplementation(
    () =>
      ({
        get: (url: string) => {
          const paths = [
            {
              regex: /api\/v4\/user$/,
              mockedResponse: { id: 3 },
            },
            {
              regex: /api\/v4\/issues/,
              mockedResponse: { body: response, headers },
            },
          ];

          for (const p of paths) {
            if (url.match(p.regex)) {
              return Promise.resolve(p.mockedResponse);
            }
          }

          throw new Error(`Unmocked URL: "${url}"`);
        },
      } as any),
  );

  beforeEach(() => {
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };
    response = undefined;
  });

  test('when you have one issue', async () => {
    response = [
      {
        iid: 2,
        author: {
          id: 3,
          name: 'Nathan Friend',
        },
        created_at: '2019-09-01T15:03:00.000Z',
        title: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result).toSpeek('Number 2 was created an hour ago by you: test');
  });

  test('for multiple issues', async () => {
    response = [
      {
        iid: 2,
        author: {
          id: 3,
          name: 'Nathan Friend',
        },
        created_at: '2019-09-01T15:03:00.000Z',
        title: 'test',
      },
      {
        iid: 3,
        author: {
          id: 4,
          name: 'Test User',
        },
        created_at: '2019-09-01T15:03:00.000Z',
        title: 'another',
      },
    ];

    const result = await executeLambda(event);

    expect(result).toSpeek(
      [
        'Number 2 was created an hour ago by you: test\n',
        '<break time="1s"/>',
        'Number 3 was created an hour ago by Test User: another',
      ].join(''),
    );
  });

  test('when there are 6 issues', async () => {
    headers = {
      'x-page': '1',
      'x-total': '6',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    response = [
      {
        iid: 2,
        author: {
          id: 3,
          name: 'Nathan Friend',
        },
        created_at: '2019-09-01T15:03:00.000Z',
        title: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Number 2 was created an hour ago by you: test\n<break time="1s"/>You have one more issue. Would you like me to read it?',
    );
  });

  test('when there are 7 issues', async () => {
    headers = {
      'x-page': '1',
      'x-total': '7',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    response = [
      {
        iid: 2,
        author: {
          id: 3,
          name: 'Nathan Friend',
        },
        created_at: '2019-09-01T15:03:00.000Z',
        title: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Number 2 was created an hour ago by you: test\n<break time="1s"/>You have 2 more issues. Would you like me to keep going?',
    );
  });
});
