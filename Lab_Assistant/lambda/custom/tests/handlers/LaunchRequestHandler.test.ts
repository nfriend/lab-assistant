import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
import { db, LabAssistantAttributes } from '../../src/adapters/dynamo-db';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/adapters/dynamo-db');

describe('LaunchRequestHandler', () => {
  let userAttributes: LabAssistantAttributes;

  const event = createAlexaEvent({
    request: {
      type: 'LaunchRequest',
    },
  });

  jest.spyOn(db, 'get').mockImplementation(() => Promise.resolve(userAttributes));

  jest.spyOn(db, 'put').mockImplementation(() => Promise.resolve());

  test('when this is the first time the user has launched the skill', async () => {
    userAttributes = {};

    const result = await executeLambda(event);

    const expected = [
      'Welcome to Lab Assistant!',
      'Looks like this is your first visit! I\'ll explain a few things you can do, and feel free to say "help" at any time for assistance.',
      'You can trigger a pipeline by saying <break strength="strong"/> <prosody pitch="+10%">"run a new pipeline."</prosody>',
      'Catch up on your workload by saying <break strength="strong"/> <prosody pitch="+10%">"to-dos"</prosody>, <break strength="strong"/> <prosody pitch="+10%">"issues"</prosody>, or <break strength="strong"/> <prosody pitch="+10%">"merge requests."</prosody>',
      'What would you like to do?',
    ].join(' ');

    expect(result).toSpeek(expected);
  });

  test('when the user has launched the skill previously', async () => {
    userAttributes = {
      lastLaunch: new Date().getTime().toString(),
    };

    const result = await executeLambda(event);

    expect(result).toSpeek('Welcome! How can I help?');
  });
});
