const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
import * as rp from 'request-promise';
jest.mock('../../src/util/choose-one');

describe('ReadMergeRequestsIntentHandler', () => {
  let result: any;
  let response: any;
  let headers: any = {
    'x-page': '1',
    'x-total': '1',
    'x-per-page': '5',
  };

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
          return Promise.resolve({
            body: response,
            headers,
          });
        },
      },
  );

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
});
