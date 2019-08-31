import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { isNaN } from 'lodash';
import * as requestPromise from 'request-promise';
import { Todo, TodoAction } from '../api-interfaces/Todo';
import { User } from '../api-interfaces/User';
import { getPagination } from '../util/get-pagination';
import { makeIdsSpeakable } from '../util/make-ids-speakable';
import { makeMarkDownSpeakable } from '../util/make-markdown-speakable';
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
        id: makeIdsSpeakable(todo.target.iid),
        author: todo.author.name,
        body: await makeMarkDownSpeakable(todo.body, rp, true),
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

    const paginationInfo = getPagination(
      result.headers,
      i18n.t('to-do'),
      i18n.t('to-dos'),
    );

    if (paginationInfo.isMore) {
      todoSpeeches.push(paginationInfo.moreText);

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldContinueReadingTodos,
        nextPage: paginationInfo.nextPage,
      });
    }

    // Pause between each todo
    const speechText = todoSpeeches.join('<break time="1s"/>');

    const builder = handlerInput.responseBuilder.speak(speechText);

    if (paginationInfo.isMore) {
      builder.reprompt(i18n.t('Would you like me to keep going?'));
    }

    return builder.getResponse();
  }
}
