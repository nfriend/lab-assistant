import * as Alexa from 'ask-sdk-core';

/**
 * A debugging tool that echos back the name of intents that
 * are triggered but not yet implemented.
 */
export const IntentReflectorHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}.  It's not yet implemented.`;

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
