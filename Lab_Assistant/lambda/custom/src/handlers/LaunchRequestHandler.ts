import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class LaunchRequestHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const speakOutput = chooseOne(
      i18n.t('Welcome! How can I help?'),
      i18n.t('Hello! What would you like to do?'),
      i18n.t('Happy gitlabing! How can I help?'),
      i18n.t('How can I help?'),
      i18n.t('What would you like to do?'),
      i18n.t('How can I help?'),
    );

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
