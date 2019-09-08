import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

test('LaunchRequestHandler', async () => {
  const event = createAlexaEvent({
    request: {
      type: 'LaunchRequest',
    },
  });

  const result = await executeLambda(event);

  expect(result.response.outputSpeech.ssml).toBe('<speak>Welcome! How can I help?</speak>');
});
