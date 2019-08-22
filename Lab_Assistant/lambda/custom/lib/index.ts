import * as Alexa from 'ask-sdk-core';
import { LocalizationInterceptor } from './interceptors/LocalizationInterceptor';
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { TodoIntentHandler } from './handlers/TodoIntentHandler';
import { LoginIntentHandler } from './handlers/LoginIntentHandler';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { ErrorHandler } from './handlers/ErrorHandler';

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    LoginIntentHandler,
    TodoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,

    // IntentReflectorHandler needs to be last so that it doesn't
    // override any custom intent handlers
    IntentReflectorHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
