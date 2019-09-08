import * as rp from 'request-promise';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

describe('CountIssuesIntentHandler', () => {
  let headers: any = {
    'x-page': '1',
    'x-total': '1',
    'x-per-page': '5',
  };

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'CountIssuesIntent',
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

  test('when the user has no issued', async () => {
    headers = {
      'x-page': '1',
      'x-total': '0',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You have no open issues assigned to you.</speak>',
    );
  });

  test('when the user has 1 issue', async () => {
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You only have one open issue assigned to you. Would you like me to read it?</speak>',
    );
  });

  test('when the user has 10 issues', async () => {
    headers = {
      'x-page': '1',
      'x-total': '10',
      'x-per-page': '5',
    };

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You have 10 open issues assigned to you. Would you like me to read them to you?</speak>',
    );
  });
});
