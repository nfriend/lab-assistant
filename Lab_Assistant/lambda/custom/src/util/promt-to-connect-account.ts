import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from './choose-one';

/**
 * Prompts the user to connect their GitLab.com account to this skill
 * @param handlerInput The handlerInput passed to the IntentHandler
 */
export const promptToConnectAccount = (handlerInput: Alexa.HandlerInput) => {
  let speechText = chooseOne(
    i18n.t(
      "Before you can do that, you'll need to connect your gitlab.com account. ",
    ),
    i18n.t("You'll need to connect your gitlab.com account first. "),
    i18n.t("Looks like you haven't connected your gitlab.com account yet. "),
  );

  speechText += chooseOne(
    i18n.t('Open your Alexa app to finish this setup.'),
    i18n.t('You can finish this setup in your Alexa app.'),
    i18n.t('Please open your Alexa app to finish this setup.'),
  );

  return handlerInput.responseBuilder
    .speak(speechText)
    .withLinkAccountCard()
    .getResponse();
};
