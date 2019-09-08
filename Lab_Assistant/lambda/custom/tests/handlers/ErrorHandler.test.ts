import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/util/get-failure-interjection');

describe('ErrorHandler', () => {
  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'RunPipelineIntent',
        confirmationStatus: 'NONE',

        // For this intent, the handler expects to be able to access
        // slots like slots.<slotname>.value, so the line below
        // will cause a runtime error
        slots: {},
      },
    },
  });

  test('when an error occurs', async () => {
    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Shoot! I had trouble doing what you asked. Please try again.</speak>',
    );
  });
});
