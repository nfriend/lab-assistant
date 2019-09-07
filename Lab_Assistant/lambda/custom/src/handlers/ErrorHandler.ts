import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';
import { getFailureInterjection } from '../util/get-failure-interjection';

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
export class ErrorHandler implements Alexa.ErrorHandler {
  canHandle() {
    return true;
  }
  handle(handlerInput: Alexa.HandlerInput, error: Error) {
    console.log(`~~~~ Error handled: ${error.stack}`);

    const speeches: string[] = [];

    speeches.push(getFailureInterjection());

    speeches.push(
      i18n.t(
        chooseOne(
          i18n.t('I had trouble doing what you asked. Please try again.'),
          i18n.t('Something went wrong. Can you try again?'),
          i18n.t('Something went wrong - sorry about that! Can you try again?'),
          i18n.t("I'm sorry, but I had trouble doing what you asked! Can you try again?"),
        ),
      ),
    );

    const speech = speeches.join(' ');

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(speech)
      .getResponse();
  }
}
