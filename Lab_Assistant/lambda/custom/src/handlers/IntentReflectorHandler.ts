import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';

/**
 * A debugging tool that echos back the name of intents that
 * are triggered but not yet implemented.
 */
export class IntentReflectorHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = i18n.t(
      'You just triggered {{ intentName }}, but no handler was able to handle the request.',
      { intentName },
    );

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
}
