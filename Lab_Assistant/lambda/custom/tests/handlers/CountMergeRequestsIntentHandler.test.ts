import * as rp from 'request-promise';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/adapters/dynamo-db');

describe('CountMergeRequestsIntentHandler', () => {
  let headers: any = {
    'x-page': '1',
    'x-total': '1',
    'x-per-page': '5',
  };

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'CountMergeRequestsIntent',
        confirmationStatus: 'NONE',
        slots: {},
      },
    },
  });

  jest.spyOn(rp, 'defaults').mockImplementation(
    () =>
      ({
        get: () => {
          return Promise.resolve({
            body: {},
            headers,
          });
        },
      } as any),
  );

  test('when the user has no merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '0',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek('You have no open merge requests assigned to you.');
  });

  test('when the user has 1 merge request', async () => {
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'You only have one open merge request assigned to you. Would you like me to read it?',
    );
  });

  test('when the user has 10 merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '10',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'You have 10 open merge requests assigned to you. Would you like me to read them to you?',
    );
  });
});
