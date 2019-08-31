const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
import * as rp from 'request-promise';
jest.mock('../../src/util/choose-one');

describe('ReadMergeRequestsIntentHandler', () => {
  let result: any;
  let response: any;
  let headers: any;

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'ReadMergeRequestsIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  jest.spyOn(rp, 'defaults').mockImplementation(
    () =>
      <any>{
        get: (url: string) => {
          if (url.includes('api/v4/user')) {
            if (url.includes('test-user')) {
              return [{ name: 'Test User' }];
            } else {
              return Promise.resolve({
                id: 3,
              });
            }
          } else {
            return Promise.resolve({
              body: response,
              headers,
            });
          }
        },
      },
  );

  beforeEach(() => {
    result = undefined;
    response = undefined;
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };
  });

  test('when you have one merge request', async () => {
    response = [{ iid: 2, title: 'test' }];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2: test</speak>',
    );
  });

  test('for multiple merge requests', async () => {
    response = [{ iid: 2, title: 'test' }, { iid: 3, title: 'another' }];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2: test\n<break time="1s"/>Number 3: another</speak>',
    );
  });

  test('when there are 6 merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '6',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    response = [{ iid: 2, title: 'test' }];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>Number 2: test\n<break time="1s"/>You have one more merge request. Would you like me to read it?</speak>',
    );
  });

  test('when there are 7 merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '7',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    response = [{ iid: 2, title: 'test' }];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>Number 2: test\n<break time="1s"/>You have 2 more merge requests. Would you like me to keep going?</speak>',
    );
  });

  test('when the merge request is authored by you', async () => {
    response = [
      {
        iid: 2,
        title: 'test',
        author: {
          id: 3,
        },
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2, authored by you: test</speak>',
    );
  });

  test('when the merge request is authored by someone else', async () => {
    response = [
      {
        iid: 2,
        title: 'test',
        author: {
          id: 4,
          username: 'test-user',
        },
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2, authored by Test User: test</speak>',
    );
  });
});
