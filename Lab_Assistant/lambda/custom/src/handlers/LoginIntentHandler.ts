import * as Alexa from 'ask-sdk-core';

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

    if (accessToken == undefined) {
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
