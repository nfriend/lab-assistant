import * as rp from 'request-promise';
import { db } from '../../src/adapters/dynamo-db';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/get-failure-interjection');
jest.mock('../../src/util/choose-one');
jest.mock('../../src/adapters/dynamo-db');

describe('SwitchProjectIntentHandler', () => {
  let response: any;
  let statusCode: number;

  const rpMock: any = {
    get: jest.fn(() => {
      return Promise.resolve({
        body: response,
        statusCode,
      });
    }),
    post: jest.fn(() => {
      return Promise.resolve();
    }),
  };

  jest.spyOn(rp, 'defaults').mockImplementation(() => rpMock);

  jest.spyOn(db, 'get').mockImplementation(() => Promise.resolve({ projectId: '5678' }));

  jest.spyOn(db, 'put').mockImplementation(() => Promise.resolve());

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'SwitchProjectIntent',
        confirmationStatus: 'NONE',
        slots: {
          projectId: {
            value: '1234',
          },
        },
      },
    },
  });

  test('when the user provides a valid project ID', async () => {
    statusCode = 200;
    response = {
      body: {
        id: '1234',
      },
    };

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Great, I\'ll use project <say-as interpret-as="digits">1234</say-as> as your default project.',
    );
  });

  test("when the project ID provided by the user doesn't exist", async () => {
    statusCode = 404;
    response = {
      body: {
        message: '404 not found',
      },
    };

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Shoot! I couldn\'t find a project number <say-as interpret-as="digits">1234</say-as>.',
    );
  });
});
