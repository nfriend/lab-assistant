import * as Alexa from 'ask-sdk-core';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { ErrorHandler } from './handlers/ErrorHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { LoginIntentHandler } from './handlers/LoginIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';
import { TodoIntentHandler } from './handlers/TodoIntentHandler';
import { LocalizationInterceptor } from './interceptors/LocalizationInterceptor';

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
