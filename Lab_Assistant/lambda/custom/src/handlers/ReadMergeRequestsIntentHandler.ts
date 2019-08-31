import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as requestPromise from 'request-promise';
import { MergeRequest } from '../api-interfaces/MergeRequest';
import { User } from '../api-interfaces/User';
import { getPagination } from '../util/get-pagination';
import { getUsersName } from '../util/get-users-name';
import { makeIdsSpeakable } from '../util/make-ids-speakable';
import { makeMarkDownSpeakable } from '../util/make-markdown-speakable';
import { mft } from '../util/mark-for-translation';
import { AuthenticatedCheckRequestHandler } from './AuthenticatedCheckRequestHandler';
import { YesIntentQuestion } from './YesIntentHandler';

export class ReadMergeRequestsIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'ReadMergeRequestsIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const currentUser: User = await rp.get('https://gitlab.com/api/v4/user');

    const page =
      handlerInput.attributesManager.getSessionAttributes().nextPage || 1;
    const result = await rp.get(
      `https://gitlab.com/api/v4/merge_requests?state=opened&scope=assigned_to_me&per_page=5&page=${page}`,
      {
        resolveWithFullResponse: true,
      },
    );

    // Order merge requests starting at the most recently updated
    const mrs = (result.body as MergeRequest[]).sort((a, b) => {
      return (new Date(a.updated_at) as any) - (new Date(b.updated_at) as any);
    });
    const mrSpeeches: string[] = [];

    for (const mr of mrs) {
      const translationValues: { [key: string]: string } = {
        id: makeIdsSpeakable(mr.iid),
        title: await makeMarkDownSpeakable(mr.title, rp),
      };

      let speech: string;
      if (mr.author) {
        translationValues.author =
          mr.author.id === currentUser.id
            ? i18n.t('you')
            : await getUsersName(`@${mr.author.username}`, rp);

        speech = mft('Number {{id}}, authored by {{author}}: {{title}}');
      } else {
        speech = mft('Number {{id}}: {{title}}');
      }

      mrSpeeches.push(i18n.t(speech, translationValues));
    }

    const paginationInfo = getPagination(
      result.headers,
      i18n.t('merge request'),
      i18n.t('merge requests'),
    );

    if (paginationInfo.isMore) {
      mrSpeeches.push(paginationInfo.moreText);

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldContinueReadingMergeRequests,
        nextPage: paginationInfo.nextPage,
      });
    }

    // Pause between each merge request
    const speechText = mrSpeeches.join('<break time="1s"/>');

    const builder = handlerInput.responseBuilder.speak(speechText);

    if (paginationInfo.isMore) {
      builder.reprompt(i18n.t('Would you like me to keep going?'));
    }

    return builder.getResponse();
  }
}
