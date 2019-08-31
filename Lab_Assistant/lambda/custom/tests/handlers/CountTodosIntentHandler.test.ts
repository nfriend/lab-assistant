const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
jest.mock('../../src/util/choose-one');

jest.mock('request-promise', () => ({
  defaults: () => ({
    get: () => {
      return {
        body: [{ id: 1 }],
        headers: {
          'x-total': '1',
        },
      };
    },
  }),
}));

test('IntentRequestHandler', async () => {
  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'CountTodosIntent',
        confirmationStatus: 'NONE',
        slots: {
          shouldReadTodos: {
            name: 'shouldReadTodos',
            confirmationStatus: 'NONE',
          },
        },
      },
    },
  });

  const result = await lambdaLocal.execute({
    event,
    lambdaPath: path.join(__dirname, '../../src/index.ts'),
  });

  expect(result.response.outputSpeech.ssml).toBe(
    '<speak>You only have one to-do. Would you like me to read it?</speak>',
  );
});
