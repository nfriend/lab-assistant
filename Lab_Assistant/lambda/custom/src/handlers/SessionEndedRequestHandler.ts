import * as Alexa from 'ask-sdk-core';

export class SessionEndedRequestHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  }
  handle(handlerInput: Alexa.HandlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
}
