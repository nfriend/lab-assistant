import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/adapters/dynamo-db');

describe('ConnectAccountIntentHandler', () => {
  let event: any;

  beforeEach(() => {
    event = createAlexaEvent({
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ConnectAccountIntent',
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
      'Sure. Open your Alexa app to finish connecting your Gitlab.com account.',
    );
  });

  test('when the user has already connected their GitLab.com account', async () => {
    const result = await executeLambda(event);

    expect(result.response.card).toBeUndefined();

    expect(result).toSpeek(
      "You've already connected your Gitlab.com account! If you'd like to switch or disconnect your account, please disable and re-enable the Lab Assistant skill.",
    );
  });
});
