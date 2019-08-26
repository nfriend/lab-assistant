const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
jest.mock('../../src/util/choose-one');

test('IntentRequestHandler', async () => {
  const event = createAlexaEvent({
    session: {
      attributes: {
        YesIntentQuestion: 'ShouldReadTodos',
      },
    },
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'AMAZON.YesIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  const result = await lambdaLocal.execute({
    event,
    lambdaPath: path.join(__dirname, '../../src/index.ts'),
  });

  expect(result.response.outputSpeech.ssml).toBe(
    '<speak>You just triggered NotARealIntent, but no handler was able to handle the request.</speak>',
  );
});
