import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import * as requestPromise from 'request-promise';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class ReadTodosIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    if (
      Alexa.getRequestType(handlerInput.requestEnvelope) !== 'IntentRequest'
    ) {
      return false;
    }

    if (
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
      'ReadTodosIntentHandler'
    ) {
      return true;
    }

    if (
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'TodoIntentHandler' &&
      (<IntentRequest>handlerInput.requestEnvelope.request).intent.slots
        .shouldReadTodos.value === 'yes'
    ) {
      return true;
    }

    return false;
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak('This is where I read the todos to you')
      .getResponse();
  }
}
