const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
jest.mock('../../src/util/choose-one');

test('LaunchRequestHandler', async () => {
  const event = createAlexaEvent({
    request: {
      type: 'LaunchRequest',
    },
  });

  const result = await lambdaLocal.execute({
    event,
    lambdaPath: path.join(__dirname, '../../src/index.ts'),
  });

  expect(result.response.outputSpeech.ssml).toBe('<speak>Welcome! How can I help?</speak>');
});
