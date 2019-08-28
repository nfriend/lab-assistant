import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { isNaN } from 'lodash';
import * as requestPromise from 'request-promise';
import { Todo, TodoAction } from '../api-interfaces/Todo';
import { User } from '../api-interfaces/User';
import { chooseOne } from '../util/choose-one';
import { makeSpeakable } from '../util/make-speakable';
import { mft } from '../util/mark-for-translation';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import { YesIntentQuestion } from './YesIntentHandler';

export class ReadTodosIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadTodosIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const currentUser: User = await rp.get('https://gitlab.com/api/v4/user');

    const page =
      handlerInput.attributesManager.getSessionAttributes().nextPage || 1;
    const result = await rp.get(
      `https://gitlab.com/api/v4/todos?per_page=5&page=${page}`,
      {
        resolveWithFullResponse: true,
      },
    );

    const todos: Todo[] = result.body;
    const todoSpeeches: string[] = [];

    for (const todo of todos) {
      const isFromCurrentUser = todo.author.id === currentUser.id;
      let speech: string;

      const translationValues = {
        target:
          todo.target_type === 'Issue'
            ? i18n.t('issue')
            : i18n.t('merge request'),

        // For IDs less than 100, say the number normally (i.e. "eighty-seven")
        // For IDs equal to or greater than 100, say the number as digits
        // (i.e. "eight seven two")
        id:
          todo.target.iid < 100
            ? todo.target.iid
            : `<say-as interpret-as="digits">${todo.target.iid}</say-as>`,

        author: todo.author.name,
        body: await makeSpeakable(todo.body, rp, true),
      };

      if (todo.action_name === TodoAction.Mentioned) {
        speech = isFromCurrentUser
          ? mft('You mentioned yourself on {{target}} number {{id}}: {{body}}')
          : mft(
              '{{author}} mentioned you on {{target}} number {{id}}: {{body}}',
            );
      } else if (todo.action_name === TodoAction.DirectlyAddressed) {
        speech = isFromCurrentUser
          ? mft(
              'You directly addressed yourself on {{target}} number {{id}}: {{body}}',
            )
          : mft(
              '{{author}} directly addressed you on {{target}} number {{id}}: {{body}}',
            );
      } else if (todo.action_name === TodoAction.Assigned) {
        speech = isFromCurrentUser
          ? mft('You assigned {{target}} number {{id}} to yourself')
          : mft('{{author}} assigned you {{target}} number {{id}}');
      } else if (todo.action_name === TodoAction.BuildFailed) {
        speech = mft('The build failed for {{target}} number {{id}}');
      } else if (todo.action_name === TodoAction.Marked) {
        speech = mft('You added a to-do for {{target}} number {{id}}');
      } else if (todo.action_name === TodoAction.Unmergeable) {
        speech = mft('Could not merge {{target}} number {{id}}');
      } else if (todo.action_name === TodoAction.ApprovalRequired) {
        speech = isFromCurrentUser
          ? mft('You set yourself as an approver for {{target}} number {{id}}')
          : mft(
              '{{author}} set you as an approver for {{target}} number {{id}}',
            );
      } else {
        speech = mft('{{body}}');
      }

      todoSpeeches.push(i18n.t(speech, translationValues));
    }

    const nextPage = parseInt(result.headers['x-next-page'], 10);
    const isMore = !isNaN(nextPage);

    if (isMore) {
      const count = parseInt(result.headers['x-total'], 10);
      const currentPage = parseInt(result.headers['x-page'], 10);
      const perPage = parseInt(result.headers['x-per-page'], 10);
      const remaining = count - currentPage * perPage;

      const remainingText =
        remaining === 1
          ? mft(
              'You have {{remaining}} more to-do. Would you like me to read it?',
            )
          : mft(
              'You have {{remaining}} more to-dos. Would you like me to keep going?',
            );

      todoSpeeches.push(i18n.t(remainingText, { remaining }));

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldContinueReadingTodos,
        nextPage,
      });
    }

    // Pause between each todo
    const speechText = todoSpeeches.join('<break time="1s"/>');

    const builder = handlerInput.responseBuilder.speak(speechText);

    if (isMore) {
      builder.reprompt(i18n.t('Would you like me to keep going?'));
    }

    return builder.getResponse();
  }
}
