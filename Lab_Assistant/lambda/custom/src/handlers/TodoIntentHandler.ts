import * as Alexa from 'ask-sdk-core';
import { isNil } from 'lodash';
import * as requestPromise from 'request-promise';
import { promptToConnectAccount } from '../util/promt-to-connect-account';

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
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    if (isNil(accessToken)) {
      return promptToConnectAccount(handlerInput);
    }

    const todos = await rp.get('https://gitlab.com/api/v4/todos');

    const speechText = `You have ${todos.length} to-dos`;

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};
