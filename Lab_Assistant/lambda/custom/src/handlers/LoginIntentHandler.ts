import * as Alexa from 'ask-sdk-core';
import { isNil } from 'lodash';

export const LoginIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'LoginIntent'
    );
  },
  handle(handlerInput) {
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;

    if (isNil(accessToken)) {
      const speechText =
        'Sure. Open your Alexa app to finish connecting your gitlab.com account.';

      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    } else {
      const speechText = "You've already connected your gitlab.com account!";

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
  },
};
