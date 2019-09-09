import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

describe('AuthenticatedCheckRequestHandler', () => {
  let event: any;

  beforeEach(() => {
    event = createAlexaEvent({
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'CountTodosIntent',
          confirmationStatus: 'NONE',
        },
      },
    });
  });

  test("when the user hasn't yet connected their GitLab.com account", async () => {
    delete event.context.System.user.accessToken;

    const result = await executeLambda(event);

    expect(result.response.card.type).toBe('LinkAccount');

    expect(result).toSpeek(
      "Before you can do that, you'll need to connect your gitlab.com account. Open your Alexa app to finish this setup.",
    );
  });

  test('when the user has already connected their GitLab.com account', async () => {
    const result = await executeLambda(event);

    expect(result.response.card).toBeUndefined();
  });
});
