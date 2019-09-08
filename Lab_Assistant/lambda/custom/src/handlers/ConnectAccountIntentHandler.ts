import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { isNil } from 'lodash';
import { chooseOne } from '../util/choose-one';

export class ConnectAccountIntentHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConnectAccountIntent'
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (isNil(accessToken)) {
      // The user hasn't yet connected their GitLab.com account

      const speechText = chooseOne(
        i18n.t('Sure. Open your Alexa app to finish connecting your Gitlab.com account.'),
        i18n.t('Okay. Open your Alexa app to finish connecting your Gitlab.com account.'),
      );

      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    } else {
      // The user has already connected their GitLab.com account

      const speeches: string[] = [];

      speeches.push(
        chooseOne(
          i18n.t("You've already connected your Gitlab.com account!"),
          i18n.t("You're good to go - your Gitlab.com account is already connected!"),
        ),
      );

      speeches.push(
        chooseOne(
          i18n.t(
            "If you'd like to switch or disconnect your account, please disable and re-enable the Lab Assistant skill.",
          ),
          i18n.t(
            "If you'd like to switch to a different account, or if you'd like to disconnect your current account, please disable and re-enable the Lab Assistant skill.",
          ),
        ),
      );

      return handlerInput.responseBuilder.speak(speeches.join(' ')).getResponse();
    }
  }
}
