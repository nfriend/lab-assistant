import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import * as requestPromise from 'request-promise';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class ReadTodosIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadTodosIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak('This is where I read the to-dos to you')
      .getResponse();
  }
}
