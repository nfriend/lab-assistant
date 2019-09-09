import * as rp from 'request-promise';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

describe('CountTodosIntentHandler', () => {
  let headers: any = {
    'x-page': '1',
    'x-total': '1',
    'x-per-page': '5',
  };

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'CountTodosIntent',
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

  test('when the user has no todos', async () => {
    headers = {
      'x-page': '1',
      'x-total': '0',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek('You have no to-dos. Good job!');
  });

  test('when the user has 1 todo', async () => {
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek('You only have one to-do. Would you like me to read it?');
  });

  test('when the user has 10 todos', async () => {
    headers = {
      'x-page': '1',
      'x-total': '10',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result).toSpeek('You have 10 to-dos. Would you like me to read them to you?');
  });
});
