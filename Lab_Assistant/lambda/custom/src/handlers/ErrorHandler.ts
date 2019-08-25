import * as Alexa from 'ask-sdk-core';

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
export class ErrorHandler implements Alexa.ErrorHandler {
  canHandle() {
    return true;
  }
  handle(handlerInput: Alexa.HandlerInput, error: Error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
