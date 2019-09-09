import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

test('IntentReflectionHandler', async () => {
  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'NotARealIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  const result = await executeLambda(event);

  expect(result).toSpeek(
    'You just triggered NotARealIntent, but no handler was able to handle the request.',
  );
});
