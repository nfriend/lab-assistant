import * as Alexa from 'ask-sdk-core';
import { isNil } from 'lodash';
import * as rp from 'request-promise';

export const TodoIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'TodoIntent'
    );
  },
  async handle(handlerInput) {
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;

    if (isNil(accessToken)) {
      const speechText =
        'You need to connect your gitlab.com account in order to check your to-dos.';

      return handlerInput.responseBuilder
        .speak(speechText)
        .withLinkAccountCard()
        .getResponse();
    } else {
      const todos = await rp.get('https://gitlab.com/api/v4/todos', {
        auth: {
          bearer: accessToken,
        },
        json: true,
      });

      const speechText = `You have ${todos.length} to-dos`;

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
  },
};
