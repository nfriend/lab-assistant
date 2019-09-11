import { first } from 'lodash';
import * as rp from 'request-promise';
import { db, LabAssistantAttributes } from '../../src/adapters/dynamo-db';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');
jest.mock('../../src/util/get-failure-interjection');
jest.mock('../../src/util/get-success-interjection');
jest.mock('../../src/adapters/dynamo-db');

describe('RunPipelineIntentHandler', () => {
  let response: any;
  let statusCode: number;
  let slots: any;
  let event: any;
  let userAttributes: LabAssistantAttributes;

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

  jest.spyOn(db, 'get').mockImplementation(() => Promise.resolve(userAttributes));

  jest.spyOn(db, 'put').mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    response = {
      id: 1,
      name: 'my project',
    };

    statusCode = 200;

    slots = {
      pipelineVariable: {
        value: 'test',
      },
      projectId: {
        value: '1234',
      },
    };

    userAttributes = {};
  });

  const factory = () => {
    event = createAlexaEvent({
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'RunPipelineIntent',
          confirmationStatus: 'NONE',
          slots,
        },
      },
    });
  };

  test('when both the projectId and pipelineVariable slots are provided', async () => {
    factory();

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Great, I\'ll use project <say-as interpret-as="digits">1234</say-as> as your default project so you won\'t have to specify it in the future. <break time="1s"/> Hooray! A test pipeline has been created.',
    );

    expect(db.put).toHaveBeenCalledWith(expect.any(Object), { projectId: '1234' });

    expect(rpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('api/v4/projects/1234/pipeline'),
      expect.objectContaining({
        body: {
          variables: [
            { key: 'LAB_ASSISTANT', variable_type: 'env_var', value: 'true' },
            { key: 'LAB_ASSISTANT_TEST', variable_type: 'env_var', value: 'true' },
          ],
        },
      }),
    );
  });

  test('when no slots are provided, and the user **does** have a default project selected', async () => {
    delete slots.pipelineVariable.value;
    delete slots.projectId.value;

    userAttributes = {
      projectId: '1234',
    };

    factory();

    const result = await executeLambda(event);

    expect(result).toSpeek('Hooray! A new pipeline has been created.');

    expect(rpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('api/v4/projects/1234/pipeline'),
      expect.objectContaining({
        body: {
          variables: [{ key: 'LAB_ASSISTANT', variable_type: 'env_var', value: 'true' }],
        },
      }),
    );
  });

  test('when both the pipelineVariable slot is provided, and the user does not have a default project selected', async () => {
    delete slots.projectId.value;

    factory();

    const result = await executeLambda(event);

    expect(first<any>(result.response.directives).type).toBe('Dialog.Delegate');
  });

  test('when both the pipelineVariable slot is provided, and the user **does** have a default project selected', async () => {
    delete slots.projectId.value;

    userAttributes = {
      projectId: '1234',
    };

    factory();

    const result = await executeLambda(event);

    expect(result).toSpeek('Hooray! A test pipeline has been created.');
  });

  test('when the project does not exist', async () => {
    statusCode = 404;

    factory();

    const result = await executeLambda(event);

    expect(result).toSpeek(
      'Shoot! I couldn\'t find a project number <say-as interpret-as="digits">1234</say-as>.',
    );
  });
});
