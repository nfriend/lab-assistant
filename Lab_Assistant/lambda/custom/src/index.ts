import * as Alexa from 'ask-sdk-core';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { ConnectAccountHandler } from './handlers/ConnectAccountHandler';
import { ErrorHandler } from './handlers/ErrorHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { NoIntentHandler } from './handlers/NoIntentHandler';
import { ReadTodosIntentHandler } from './handlers/ReadTodosIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';
import { TodoIntentHandler } from './handlers/TodoIntentHandler';
import { YesIntentHandler } from './handlers/YesIntentHandler';

import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { LocalizationInterceptor } from './interceptors/LocalizationInterceptor';

import * as rp from 'request-promise';
rp.defaults({
  json: true,
});

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    new LaunchRequestHandler(),
    new ConnectAccountHandler(),
    new TodoIntentHandler(),
    new HelpIntentHandler(),
    new CancelAndStopIntentHandler(),
    new SessionEndedRequestHandler(),
    new ReadTodosIntentHandler(),
    new YesIntentHandler(),
    new NoIntentHandler(),

    // IntentReflectorHandler needs to be last so that it doesn't
    // override any custom intent handlers
    new IntentReflectorHandler(),
  )
  .addRequestInterceptors(new LocalizationInterceptor())
  .addRequestInterceptors(new AuthInterceptor())
  .addErrorHandlers(new ErrorHandler())
  .lambda();
