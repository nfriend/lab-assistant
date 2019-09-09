import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { db } from '../adapters/dynamo-db';
import { chooseOne } from '../util/choose-one';
import { getFailureInterjection } from '../util/get-failure-interjection';
import { getProject } from '../util/get-project';
import { getSuccessInterjection } from '../util/get-success-interjection';
import { mft } from '../util/mark-for-translation';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';

export class RunPipelineIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'RunPipelineIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes().rp;
    const { slots } = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const pipelineVariable = slots.pipelineVariable.value;
    let projectId = slots.projectId.value;
    let speeches: string[] = [];

    if (!projectId) {
      // No project ID was provided with the request as a slot

      // Try and get the user's default project ID from the database
      projectId = (await db.get(handlerInput.requestEnvelope)).projectId;

      if (!projectId) {
        // The user doesn't have a default project ID, so ask the user for it

        return handlerInput.responseBuilder.addDelegateDirective().getResponse();
      }
    } else {
      // The project ID was provided with the request

      const projectIdSpeech = chooseOne(
        mft(
          "Great, I'll use project {{projectId}} as your default project so you won't have to specify it in the future.",
        ),
        mft(
          "Okay, I've set {{projectId}} as your default project. You won't have to specify it in the future.",
        ),
        mft(
          "Sure, project {{projectId}} in now your default project. You won't have to specify it in the future.",
        ),
      );
      speeches.push(i18n.t(projectIdSpeech, { projectId }));

      // Pause after the sentence above
      speeches.push('<break time="1s"/>');
    }

    // Validate that the project exists
    const project = await getProject(rp, projectId);

    if (!project) {
      speeches = [];
      speeches.push(getFailureInterjection());
      speeches.push(
        i18n.t(
          chooseOne(
            mft("I couldn't find a project number {{projectId}}."),
            mft("I couldn't find a project with an ID of {{projectId}}."),
            mft("Sorry, but I don't see a project with an ID of {{projectId}}."),
            mft("Sorry, but I counldn't find project number {{projectId}}."),
          ),
          { projectId },
        ),
      );

      return handlerInput.responseBuilder.speak(speeches.join(' ')).getResponse();
    }

    // Save this project ID as the user's default project ID
    await db.put(handlerInput.requestEnvelope, { projectId });

    // Always include the LAB_ASSISTANT environment variable when creating pipelines
    const variables = [{ key: 'LAB_ASSISTANT', variable_type: 'env_var', value: 'true' }];

    // Additionally, if the user specified a variable, include this variables as well
    // in the format of LAB_ASSISTANT_<VARIABLE_NAME>
    if (pipelineVariable) {
      variables.push({
        key: `LAB_ASSISTANT_${pipelineVariable.toUpperCase()}`,
        variable_type: 'env_var',
        value: 'true',
      });
    }

    await rp.post(`https://gitlab.com/api/v4/projects/${projectId}/pipeline?ref=master"`, {
      resolveWithFullResponse: true,
      simple: false,
      body: { variables },
    });

    speeches.push(getSuccessInterjection());

    if (pipelineVariable) {
      speeches.push(
        i18n.t(
          chooseOne(
            mft('A {{pipelineVariable}} pipeline has been created.'),
            mft("I've created a new {{pipelineVariable}} pipeline."),
            mft('Your {{pipelineVariable}} pipeline has been created.'),
            mft('A shiny new {{pipelineVariable}} pipeline has been created.'),
            mft('Congrats on your new {{pipelineVariable}} pipeline.'),
          ),
          { pipelineVariable },
        ),
      );
    } else {
      speeches.push(
        i18n.t(
          chooseOne(
            mft('A new pipeline has been created.'),
            mft("I've created a new pipeline."),
            mft('Your pipeline has been created.'),
            mft('A shiny new pipeline has been created.'),
            mft('Congrats on your new pipeline.'),
          ),
        ),
      );
    }

    return handlerInput.responseBuilder.speak(speeches.join(' ')).getResponse();
  }
}
