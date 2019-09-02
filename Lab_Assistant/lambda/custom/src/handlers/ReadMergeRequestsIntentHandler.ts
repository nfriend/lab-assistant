import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as moment from 'moment';
import * as requestPromise from 'request-promise';
import {
  MergeRequest,
  SimpleMergeRequest,
} from '../api-interfaces/MergeRequest';
import { User } from '../api-interfaces/User';
import { buildUrlParams } from '../util/build-url-params';
import { chooseOne } from '../util/choose-one';
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

    const page =
      handlerInput.attributesManager.getSessionAttributes().nextPage || 1;

    const apiParams = buildUrlParams({
      view: 'simple',
      state: 'opened',
      scope: 'assigned_to_me',
      order_by: 'updated_at',
      per_page: 5,
      page,
    });

    const [currentUser, result]: [User, any] = await Promise.all([
      rp.get('https://gitlab.com/api/v4/user'),
      rp.get(`https://gitlab.com/api/v4/merge_requests?${apiParams}`, {
        resolveWithFullResponse: true,
      }),
    ]);

    const mrs: MergeRequest[] = await Promise.all(
      (result.body as SimpleMergeRequest[]).map(smr => {
        return rp.get(
          `https://gitlab.com/api/v4/projects/${smr.project_id}/merge_requests/${smr.iid}`,
        );
      }),
    );

    const mrSpeeches: string[] = [];

    for (const mr of mrs) {
      let pipelineDescription: string;
      if (!mr.pipeline) {
        pipelineDescription = chooseOne(
          i18n.t('has no pipeline'),
          i18n.t("doesn't have a pipeline"),
        );
      } else if (mr.pipeline.status === 'running') {
        pipelineDescription = chooseOne(
          i18n.t('has an in-progress pipeline'),
          i18n.t("has pipeline that's in-progress"),
          i18n.t('has a currently-running pipeline'),
          i18n.t('has a running pipeline'),
          i18n.t("has a pipeline that's running"),
        );
      } else if (mr.pipeline.status === 'success') {
        pipelineDescription = chooseOne(
          i18n.t('has a successful pipeline'),
          i18n.t('has a pipeline that succeeded'),
          i18n.t('has a passing pipeline'),
          i18n.t('has a pipeline that passed'),
          i18n.t('has a green pipeline'),
          i18n.t("has a pipeline that's green"),
        );
      } else if (mr.pipeline.status === 'failed') {
        pipelineDescription = chooseOne(
          i18n.t('has a failed pipeline'),
          i18n.t('has a pipeline that failed'),
          i18n.t('has a red pipeline'),
          i18n.t('has a pipeline that is red'),
          i18n.t('has a broken pipeline'),
        );
      } else if (mr.pipeline.status === 'canceled') {
        pipelineDescription = chooseOne(
          i18n.t('has a cancelled pipeline'),
          i18n.t('has a pipeline that was cancelled'),
        );
      } else if (mr.pipeline.status === 'pending') {
        pipelineDescription = chooseOne(
          i18n.t('has a pending pipeline'),
          i18n.t('has a pipeline that is pending'),
          i18n.t("has a pipeline that hasn't started"),
          i18n.t("has a pipeline that hasn't started yet"),
        );
      } else if (mr.pipeline.status === 'skipped') {
        pipelineDescription = chooseOne(
          i18n.t('has a skipped pipeline'),
          i18n.t('has a pipeline that was skipped'),
        );
      } else {
        pipelineDescription = chooseOne(
          i18n.t('has a pipeline with an unknown status'),
        );
      }

      const translationValues: { [key: string]: string } = {
        id: makeIdsSpeakable(mr.iid),
        title: await makeMarkDownSpeakable(mr.title, rp),
        author:
          mr.author.id === currentUser.id ? i18n.t('you') : mr.author.name,
        timeAgo: moment(mr.created_at).fromNow(),
        pipelineDescription,
      };

      let speech: string;
      speech = chooseOne(
        mft(
          'Number {{id}} was created {{timeAgo}} by {{author}} and {{pipelineDescription}}: {{title}}',
        ),
        mft(
          'Number {{id}} was authored {{timeAgo}} by {{author}} and {{pipelineDescription}}: {{title}}',
        ),
        mft(
          'Number {{id}} {{pipelineDescription}} and was created {{timeAgo}} by {{author}} : {{title}}',
        ),
        mft(
          'Number {{id}} {{pipelineDescription}} and was authored {{timeAgo}} by {{author}} : {{title}}',
        ),
        mft(
          'Number {{id}} {{pipelineDescription}} and was created by {{author}} {{timeAgo}}: {{title}}',
        ),
        mft(
          'Number {{id}} {{pipelineDescription}} and was authored by {{author}} {{timeAgo}} : {{title}}',
        ),
      );

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
