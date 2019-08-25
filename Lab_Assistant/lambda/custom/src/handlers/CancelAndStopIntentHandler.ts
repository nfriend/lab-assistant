import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class CancelAndStopIntentHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          'AMAZON.StopIntent')
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const speakOutput = chooseOne(
      i18n.t('Goodbye!'),
      i18n.t('Bye! May your pipelines be green.'),
      i18n.t('Have a good one!'),
      i18n.t('Bye! Happy dev-opsing'),
    );
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
}
