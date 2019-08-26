import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { Todo } from '../api-interfaces/Todo';
import { chooseOne } from '../util/choose-one';
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

    const todos: Todo[] = await rp.get('https://gitlab.com/api/v4/todos');

    return handlerInput.responseBuilder
      .speak('This is where I read the to-dos to you')
      .getResponse();
  }
}
