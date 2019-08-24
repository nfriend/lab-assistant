import * as Alexa from 'ask-sdk-core';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { ErrorHandler } from './handlers/ErrorHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { LoginIntentHandler } from './handlers/LoginIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';
import { TodoIntentHandler } from './handlers/TodoIntentHandler';

import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { LocalizationInterceptor } from './interceptors/LocalizationInterceptor';

import * as rp from 'request-promise';
rp.defaults({
  json: true,
});

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
  .addRequestInterceptors(AuthInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
