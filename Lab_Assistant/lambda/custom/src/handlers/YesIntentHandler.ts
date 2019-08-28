import * as Alexa from 'ask-sdk-core';
import { ReadTodosIntentHandler } from './ReadTodosIntentHandler';

export enum YesIntentQuestion {
  ShouldReadTodos = 'ShouldReadTodos',
  ShouldContinueReadingTodos = 'ShouldContinueReadingTodos',
}

export class YesIntentHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const question: YesIntentQuestion = handlerInput.attributesManager.getSessionAttributes()
      .YesIntentQuestion;

    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.YesIntent' &&
      Object.values(YesIntentQuestion).includes(question)
    );
  }
  async handle(handlerInput: Alexa.HandlerInput) {
    const question: YesIntentQuestion = handlerInput.attributesManager.getSessionAttributes()
      .YesIntentQuestion;

    if (
      question === YesIntentQuestion.ShouldReadTodos ||
      question === YesIntentQuestion.ShouldContinueReadingTodos
    ) {
      return new ReadTodosIntentHandler().handle(handlerInput);
    } else {
      throw new Error(`Unhandled YesIntentQuestion: "${question}"`);
    }
  }
}
