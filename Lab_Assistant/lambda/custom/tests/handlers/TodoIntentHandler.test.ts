const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
jest.mock('../../src/util/choose-one');

jest.mock('request-promise', () => {
  const requestPromiseMock = () => {
    return [{ id: 1 }];
  };

  requestPromiseMock.defaults = () => {};

  return requestPromiseMock;
});

test('IntentRequestHandler', async () => {
  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'TodoIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  const result = await lambdaLocal.execute({
    event,
    lambdaPath: path.join(__dirname, '../../src/index.ts'),
  });

  expect(result.response.outputSpeech.ssml).toBe(
    "<speak>You just triggered NotARealIntent. It's not yet implemented.</speak>",
  );
});
