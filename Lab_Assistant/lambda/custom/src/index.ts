import * as Alexa from 'ask-sdk-core';
import { adapter } from './adapters/dynamo-db';
import { CancelAndStopIntentHandler } from './handlers/CancelAndStopIntentHandler';
import { ConnectAccountHandler } from './handlers/ConnectAccountHandler';
import { CountIssuesIntentHandler } from './handlers/CountIssuesIntentHandler';
import { CountMergeRequestsIntentHandler } from './handlers/CountMergeRequestsIntentHandler';
import { CountTodosIntentHandler } from './handlers/CountTodosIntentHandler';
import { ErrorHandler } from './handlers/ErrorHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { IntentReflectorHandler } from './handlers/IntentReflectorHandler';
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { NoIntentHandler } from './handlers/NoIntentHandler';
import { ReadIssuesIntentHandler } from './handlers/ReadIssuesIntentHandler';
import { ReadMergeRequestsIntentHandler } from './handlers/ReadMergeRequestsIntentHandler';
import { ReadTodosIntentHandler } from './handlers/ReadTodosIntentHandler';
import { RunPipelineIntentHandler } from './handlers/RunPipelineIntentHandler';
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequestHandler';

import { YesIntentHandler } from './handlers/YesIntentHandler';

import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { LocalizationInterceptor } from './interceptors/LocalizationInterceptor';

import * as rp from 'request-promise';
rp.defaults({ json: true });

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    new LaunchRequestHandler(),
    new ConnectAccountHandler(),
    new CountTodosIntentHandler(),
    new HelpIntentHandler(),
    new CancelAndStopIntentHandler(),
    new SessionEndedRequestHandler(),
    new ReadTodosIntentHandler(),
    new CountMergeRequestsIntentHandler(),
    new ReadMergeRequestsIntentHandler(),
    new CountIssuesIntentHandler(),
    new ReadIssuesIntentHandler(),
    new YesIntentHandler(),
    new NoIntentHandler(),
    new RunPipelineIntentHandler(),

    // IntentReflectorHandler needs to be last so that it doesn't
    // override any custom intent handlers
    new IntentReflectorHandler(),
  )
  .addRequestInterceptors(new LocalizationInterceptor())
  .addRequestInterceptors(new AuthInterceptor())
  .addErrorHandlers(new ErrorHandler())
  .withPersistenceAdapter(adapter)
  .lambda();
