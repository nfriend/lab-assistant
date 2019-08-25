import * as Alexa from 'ask-sdk-core';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import * as requestPromise from 'request-promise';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';
import { IntentRequest } from 'ask-sdk-model';

export class TodoIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'TodoIntent' &&
      (<IntentRequest>handlerInput.requestEnvelope.request).intent.slots
        .shouldReadTodos.value !== 'yes'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const todos: any[] = await rp.get('https://gitlab.com/api/v4/todos');

    let speechText: string;

    if (todos.length === 0) {
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
      if (todos.length === 1) {
        speechText = chooseOne(
          i18n.t('You only have one to-do. '),
          i18n.t('You have one to-do. '),
          i18n.t('You only have one to-do left. '),
        );

        speechText += i18n.t('Would you like me to read it?');
      } else {
        speechText = i18n.t('You have %d to-dos. ', {
          postProcess: 'sprintf',
          sprintf: [todos.length],
        });

        speechText += i18n.t('Would you like me to read them to you?');
      }

      return handlerInput.responseBuilder
        .speak(speechText)
        .addElicitSlotDirective('shouldReadTodos')
        .getResponse();
    }
  }
}
