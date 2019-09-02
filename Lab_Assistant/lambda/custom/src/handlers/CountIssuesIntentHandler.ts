import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { chooseOne } from '../util/choose-one';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import { YesIntentQuestion } from './YesIntentHandler';

export class CountIssuesIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CountIssuesIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const result = await rp.get(
      'https://gitlab.com/api/v4/issues?state=opened&scope=assigned_to_me',
      {
        resolveWithFullResponse: true,
      },
    );

    const count = parseInt(result.headers['x-total'], 10);

    let speechText: string;

    if (count === 0) {
      speechText = chooseOne(
        i18n.t('You have no open issues assigned to you.'),
        i18n.t("You don't have any open issues assigned to you."),
        i18n.t('You have zero open issues assigned to you.'),
      );

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    } else {
      let repromptText: string;

      if (count === 1) {
        speechText = chooseOne(
          i18n.t('You only have one open issue assigned to you. '),
          i18n.t('You have one open merge request assigned to you. '),
        );

        speechText += i18n.t('Would you like me to read it?');
        repromptText = i18n.t('Would you like me to read your issue?');
      } else {
        speechText = i18n.t(
          'You have {{count}} open issues assigned to you. ',
          {
            count,
          },
        );

        speechText += i18n.t('Would you like me to read them to you?');
        repromptText = i18n.t('Would you like me to read your open issue?');
      }

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldReadIssues,
      });

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
    }
  }
}
