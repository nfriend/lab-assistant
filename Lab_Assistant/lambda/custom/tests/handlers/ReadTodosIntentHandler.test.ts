const lambdaLocal = require('lambda-local');
import * as path from 'path';
import { createAlexaEvent } from './create-alexa-event';
import * as rp from 'request-promise';
import { TodoAction } from '../../src/api-interfaces/Todo';
jest.mock('../../src/util/choose-one');

describe('ReadTodosIntentHandler', () => {
  let result: any;
  let response: any;

  const event = createAlexaEvent({
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'ReadTodosIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  jest.spyOn(rp, 'defaults').mockImplementation(
    () =>
      <any>{
        get: (url: string) => {
          let result: any;
          if (url.includes('api/v4/user')) {
            return Promise.resolve({
              id: 3,
            });
          } else {
            return Promise.resolve(response);
          }
        },
      },
  );

  test('when you mention yourself', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.Mentioned,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You mentioned yourself on merge request #5: test</speak>',
    );
  });

  test('when you directly address yourself', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.DirectlyAddressed,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You directly addressed yourself on merge request #5: test</speak>',
    );
  });

  test('when someone else directly addressed you', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: TodoAction.DirectlyAddressed,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend directly addressed you on merge request #5: test</speak>',
    );
  });

  test('when you assign something to yourself', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.Assigned,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You assigned merge request #5 to yourself</speak>',
    );
  });

  test('when someone else directly addressed you', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: TodoAction.Assigned,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend assigned you merge request #5</speak>',
    );
  });

  test('when a build fails', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.BuildFailed,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>The build failed for merge request #5</speak>',
    );
  });

  test('when you mark something as a todo', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.Marked,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You added a to-do for merge request #5</speak>',
    );
  });

  test('when a merge request cannot be merged', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.Unmergeable,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Could not merge merge request #5</speak>',
    );
  });

  test('when you set yourself as an approver', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Current User',
        },
        action_name: TodoAction.ApprovalRequired,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You set yourself as an approver for merge request #5</speak>',
    );
  });

  test('when someone else sets you as an approver', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: TodoAction.ApprovalRequired,
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend set you as an approver for merge request #5</speak>',
    );
  });

  test('for other types of todos', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: 'not_a_real_type',
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe('<speak>test</speak>');
  });

  test('for multiple todos', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: 'not_a_real_type',
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
      {
        id: 22,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: 'not_a_real_type',
        target_type: 'MergeRequest',
        target: {
          id: 5,
        },
        body: 'test',
      },
    ];

    result = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../../src/index.ts'),
    });

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>test<break time="1s"/>test</speak>',
    );
  });
});
