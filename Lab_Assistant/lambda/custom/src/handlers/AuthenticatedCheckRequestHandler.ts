import * as Alexa from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import * as i18n from 'i18next';
import { isNil } from 'lodash';
import { chooseOne } from '../util/choose-one';

export abstract class AuthenticatedCheckRequestHandler
  implements Alexa.RequestHandler {
  abstract canHandle(
    handlerInput: Alexa.HandlerInput,
  ): Promise<boolean> | boolean;

  handle(handlerInput: Alexa.HandlerInput) {
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;

    if (isNil(accessToken)) {
      let speechText = chooseOne(
        i18n.t(
          "Before you can do that, you'll need to connect your gitlab.com account. ",
        ),
        i18n.t("You'll need to connect your gitlab.com account first. "),
        i18n.t(
          "Looks like you haven't connected your gitlab.com account yet. ",
        ),
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
    } else {
      return this.handleAfterAuthenticationCheck(handlerInput);
    }
  }

  abstract handleAfterAuthenticationCheck(
    handlerInput: Alexa.HandlerInput,
  ): Promise<Response> | Response;
}
