import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { Todo, TodoAction } from '../api-interfaces/Todo';
import { chooseOne } from '../util/choose-one';
import { makeSpeakable } from '../util/make-speakable';
import { mft } from '../util/mark-for-translation';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';

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

    const currentUser = await rp.get('https://gitlab.com/api/v4/user');
    // TODO: paginate
    const todos: Todo[] = await rp.get(
      'https://gitlab.com/api/v4/todos?per_page=5',
    );

    const todoSpeeches: string[] = [];

    for (const todo of todos) {
      const isFromCurrentUser = todo.author.id === currentUser.id;
      let speech: string;

      const translationValues = {
        target:
          todo.target_type === 'Issue'
            ? i18n.t('issue')
            : i18n.t('merge request'),
        id: todo.target.id,
        author: todo.author.name,
        body: await makeSpeakable(todo.body, rp),
      };

      if (todo.action_name === TodoAction.Mentioned) {
        speech = isFromCurrentUser
          ? mft('You mentioned yourself on {{target}} #{{id}}: {{body}}')
          : mft('{{author}} mentioned you on {{target}} #{{id}}: {{body}}');
      } else if (todo.action_name === TodoAction.DirectlyAddressed) {
        speech = isFromCurrentUser
          ? mft(
              'You directly addressed yourself on {{target}} #{{id}}: {{body}}',
            )
          : mft(
              '{{author}} directly addressed you on {{target}} #{{id}}: {{body}}',
            );
      } else if (todo.action_name === TodoAction.Assigned) {
        speech = isFromCurrentUser
          ? mft('You assigned {{target}} #{{id}} to yourself')
          : mft('{{author}} assigned you {{target}} #{{id}}');
      } else if (todo.action_name === TodoAction.BuildFailed) {
        speech = mft('The build failed for {{target}} #{{id}}');
      } else if (todo.action_name === TodoAction.Marked) {
        speech = mft('You added a to-do for {{target}} #{{id}}');
      } else if (todo.action_name === TodoAction.Unmergeable) {
        speech = mft('Could not merge {{target}} #{{id}}');
      } else if (todo.action_name === TodoAction.ApprovalRequired) {
        speech = isFromCurrentUser
          ? mft('You set yourself as an approver for {{target}} #{{id}}')
          : mft('{{author}} set you as an approver for {{target}} #{{id}}');
      } else {
        speech = mft('{{body}}');
      }

      todoSpeeches.push(i18n.t(speech, translationValues));
    }

    // Pause between each todo
    const speechText = todoSpeeches.join('<break time="1s"/>');

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
}
