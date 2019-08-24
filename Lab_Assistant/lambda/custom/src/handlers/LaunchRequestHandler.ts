import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export const LaunchRequestHandler: Alexa.RequestHandler = {
  canHandle(handlerInput: any) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    const speakOutput = chooseOne(
      i18n.t(
        'Welcome! How can I help? To get a list of what you can ask me, just say "help".',
      ),
      i18n.t(
        'Hello! What would you like to do? Just say "help" for a list of things you can ask me.',
      ),
      i18n.t(
        'Happy gitlabing! How can I help? You can say "help" if you\'re not sure what to do.',
      ),
      i18n.t(
        'This is a test!',
      ),
    );

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
