import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { Todo } from '../api-interfaces/Todo';
import { chooseOne } from '../util/choose-one';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import { YesIntentQuestion } from './YesIntentHandler';

export class CountTodosIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CountTodosIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const result = await rp.get('https://gitlab.com/api/v4/todos', {
      resolveWithFullResponse: true,
    });

    const count = parseInt(result.headers['x-total'], 10);
    const todos: Todo[] = result.body;

    let speechText: string;

    if (count === 0) {
      speechText = chooseOne(
        i18n.t('You have no to-dos. '),
        i18n.t("You don't have any to-dos. "),
        i18n.t('You have zero to-dos. '),
      );

      speechText += chooseOne(
        i18n.t('Good job!'),
        i18n.t("Isn't an empty to-do list beautiful?"),
        i18n.t('Give yourself a pat on the back!'),
        i18n.t('High five!'),
        i18n.t('Henceforth, you shall be known as "to-do destroyer"'),
      );

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    } else {
      let repromptText: string;

      if (count === 1) {
        speechText = chooseOne(
          i18n.t('You only have one to-do. '),
          i18n.t('You have one to-do. '),
          i18n.t('You only have one to-do left. '),
        );

        speechText += i18n.t('Would you like me to read it?');
        repromptText = i18n.t('Would you like me to read your to-do');
      } else {
        speechText = i18n.t('You have {{count}} to-dos. ', {
          count,
        });

        speechText += i18n.t('Would you like me to read them to you?');
        repromptText = i18n.t('Would you like me to read your to-dos');
      }

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldReadTodos,
      });

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
    }
  }
}
