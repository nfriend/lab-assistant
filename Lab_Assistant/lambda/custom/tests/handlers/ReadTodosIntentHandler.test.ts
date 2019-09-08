import * as rp from 'request-promise';
import { TodoAction } from '../../src/api-interfaces/Todo';
import { createAlexaEvent } from './create-alexa-event';
import { executeLambda } from './execute-lambda';
jest.mock('../../src/util/choose-one');

describe('ReadTodosIntentHandler', () => {
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
        name: 'ReadTodosIntent',
        confirmationStatus: 'NONE',
      },
    },
  });

  jest.spyOn(rp, 'defaults').mockImplementation(
    () =>
      ({
        get: (url: string) => {
          if (url.includes('api/v4/user')) {
            return Promise.resolve({
              id: 3,
            });
          } else {
            return Promise.resolve({
              body: response,
              headers,
            });
          }
        },
      } as any),
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You mentioned yourself on merge request number 5: test</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You directly addressed yourself on merge request number 5: test</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend directly addressed you on merge request number 5: test</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You assigned merge request number 5 to yourself</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend assigned you merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>The build failed for merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You added a to-do for merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Could not merge merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>You set yourself as an approver for merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend set you as an approver for merge request number 5</speak>',
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

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
          iid: 5,
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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe('<speak>test\n<break time="1s"/>test</speak>');
  });

  test('for targets with IDs less that 100', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: TodoAction.Mentioned,
        target_type: 'MergeRequest',
        target: {
          iid: 88,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend mentioned you on merge request number 88: test</speak>',
    );
  });

  test('for targets with IDs greater than or equal to that 100', async () => {
    response = [
      {
        id: 2,
        author: {
          id: 4,
          name: 'Nathan Friend',
        },
        action_name: TodoAction.Mentioned,
        target_type: 'MergeRequest',
        target: {
          iid: 882,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toBe(
      '<speak>Nathan Friend mentioned you on merge request number <say-as interpret-as="digits">882</say-as>: test</speak>',
    );
  });

  test('when there are 6 todos', async () => {
    headers = {
      'x-page': '1',
      'x-total': '6',
      'x-per-page': '5',
      'x-next-page': '2',
    };

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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>test\n<break time="1s"/>You have one more to-do. Would you like me to read it?</speak>',
    );
  });

  test('when there are 7 todos', async () => {
    headers = {
      'x-page': '1',
      'x-total': '7',
      'x-per-page': '5',
      'x-next-page': '2',
    };

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
          iid: 5,
        },
        body: 'test',
      },
    ];

    const result = await executeLambda(event);

    expect(result.response.outputSpeech.ssml).toContain(
      '<speak>test\n<break time="1s"/>You have 2 more to-dos. Would you like me to keep going?</speak>',
    );
  });
});
