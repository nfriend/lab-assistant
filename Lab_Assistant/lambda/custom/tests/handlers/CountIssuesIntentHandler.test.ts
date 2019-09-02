const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
import * as rp from 'request-promise';
jest.mock('../../src/util/choose-one');

describe('CountIssuesIntentHandler', () => {
  let response: any;
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
      <any>{
        get: () => {
          return Promise.resolve({
            body: response,
            headers,
          });
        },
      },
  );

  test('when the user has no issued', async () => {
    headers = {
      'x-page': '1',
      'x-total': '0',
      'x-per-page': '5',
    };

    const result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

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

    const result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

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

    const result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You have 10 open issues assigned to you. Would you like me to read them to you?</speak>',
    );
  });
});
