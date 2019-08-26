import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { isNil } from 'lodash';

export class ConnectAccountHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'LoginIntent'
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;

    if (isNil(accessToken)) {
      // the user hasn't yet connected their GitLab.com account
      const speechText = i18n.t(
        'Sure. Open your Alexa app to finish connecting your gitlab.com account.',
      );

      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    } else {
      // the user has already connected their GitLab.com account
      const speechText = i18n.t(
        "You've already connected your gitlab.com account!",
      );

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
  }
}
