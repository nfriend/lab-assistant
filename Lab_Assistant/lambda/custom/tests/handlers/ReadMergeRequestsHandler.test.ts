const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
import * as rp from 'request-promise';
jest.mock('../../src/util/choose-one');

describe('ReadMergeRequestsIntentHandler', () => {
  let result: any;
  let response: any;
  let headers: any;
  let pipeline: any;

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
          const paths = [
            {
              regex: /api\/v4\/user$/,
              mockedResponse: { id: 3 },
            },
            {
              regex: /api\/v4\/merge_requests/,
              mockedResponse: { body: response, headers },
            },
            {
              regex: /api\/v4\/projects\/20\/merge_requests\/2/,
              mockedResponse: {
                iid: 2,
                title: 'test',
                author: {
                  id: 3,
                  name: 'Nathan Friend',
                },
                created_at: '2019-09-01T15:03:00.000Z',
                pipeline,
              },
            },
            {
              regex: /api\/v4\/projects\/20\/merge_requests\/3/,
              mockedResponse: {
                iid: 3,
                title: 'another',
                author: {
                  id: 4,
                  name: 'Test User',
                },
                created_at: '2019-09-01T15:03:00.000Z',
                pipeline,
              },
            },
          ];

          for (const p of paths) {
            if (url.match(p.regex)) {
              return Promise.resolve(p.mockedResponse);
            }
          }

          throw new Error(`Unmocked URL: "${url}"`);
        },
      },
  );

  beforeEach(() => {
    response = [{ iid: 2, project_id: 20 }];
    headers = {
      'x-page': '1',
      'x-total': '1',
      'x-per-page': '5',
    };
    result = undefined;
    pipeline = undefined;
  });

  test('when you have one merge request', async () => {
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has no pipeline: test</speak>',
    );
  });

  test('for multiple merge requests', async () => {
    response = [{ iid: 2, project_id: 20 }, { iid: 3, project_id: 20 }];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      [
        '<speak>',
        'Number 2 was created an hour ago by you and has no pipeline: test\n',
        '<break time="1s"/>',
        'Number 3 was created an hour ago by Test User and has no pipeline: another',
        '</speak>',
      ].join(''),
    );
  });

  test('when there are 6 merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '6',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>Number 2 was created an hour ago by you and has no pipeline: test\n<break time="1s"/>You have one more merge request. Would you like me to read it?</speak>',
    );
  });

  test('when there are 7 merge requests', async () => {
    headers = {
      'x-page': '1',
      'x-total': '7',
      'x-per-page': '5',
      'x-next-page': '2',
    };

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>Number 2 was created an hour ago by you and has no pipeline: test\n<break time="1s"/>You have 2 more merge requests. Would you like me to keep going?</speak>',
    );
  });

  test('when the pipeline is running', async () => {
    pipeline = {
      status: 'running',
    };

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has an in-progress pipeline: test</speak>',
    );
  });

  test('when the pipeline succeeded', async () => {
    pipeline = {
      status: 'success',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a successful pipeline: test</speak>',
    );
  });

  test('when the pipeline failed', async () => {
    pipeline = {
      status: 'failed',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a failed pipeline: test</speak>',
    );
  });

  test('when the pipeline was cancelled', async () => {
    pipeline = {
      status: 'canceled',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a cancelled pipeline: test</speak>',
    );
  });

  test('when the pipeline is pending', async () => {
    pipeline = {
      status: 'pending',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a pending pipeline: test</speak>',
    );
  });

  test('when the pipeline was skipped', async () => {
    pipeline = {
      status: 'skipped',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a skipped pipeline: test</speak>',
    );
  });

  test('when the pipeline has an unknown status', async () => {
    pipeline = {
      status: 'not_a_real_status',
    };
    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Number 2 was created an hour ago by you and has a pipeline with an unknown status: test</speak>',
    );
  });
});
