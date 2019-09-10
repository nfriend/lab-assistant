import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { db } from '../adapters/dynamo-db';
import { chooseOne } from '../util/choose-one';
import { getFailureInterjection } from '../util/get-failure-interjection';
import { getProject } from '../util/get-project';
import { mft } from '../util/mark-for-translation';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';

export class SwitchProjectIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SwitchProjectIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes().rp;

    let speeches: string[] = [];

    const projectId = (handlerInput.requestEnvelope.request as IntentRequest).intent.slots.projectId
      .value;
    const project = await getProject(rp, projectId);

    // Validate that the project exists
    if (!project) {
      speeches = [];
      speeches.push(getFailureInterjection());
      speeches.push(
        i18n.t(
          chooseOne(
            mft(
              'I couldn\'t find a project number <say-as interpret-as="digits">{{projectId}}</say-as>.',
            ),
            mft(
              'I couldn\'t find a project with an ID of <say-as interpret-as="digits">{{projectId}}</say-as>.',
            ),
            mft(
              'Sorry, but I don\'t see a project with an ID of <say-as interpret-as="digits">{{projectId}}</say-as>.',
            ),
            mft(
              'Sorry, but I couldn\'t find project number <say-as interpret-as="digits">{{projectId}}</say-as>.',
            ),
          ),
          { projectId },
        ),
      );

      return handlerInput.responseBuilder.speak(speeches.join(' ')).getResponse();
    }

    // Save this project ID as the user's default project ID
    await db.put(handlerInput.requestEnvelope, { projectId });

    const projectIdSpeech = chooseOne(
      mft(
        'Great, I\'ll use project <say-as interpret-as="digits">{{projectId}}</say-as> as your default project.',
      ),
      mft(
        'Okay, I\'ve set <say-as interpret-as="digits">{{projectId}}</say-as> as your default project.',
      ),
      mft(
        'Sure, project <say-as interpret-as="digits">{{projectId}}</say-as> in now your default project.',
      ),
    );
    speeches.push(i18n.t(projectIdSpeech, { projectId }));

    return handlerInput.responseBuilder.speak(speeches.join(' ')).getResponse();
  }
}
