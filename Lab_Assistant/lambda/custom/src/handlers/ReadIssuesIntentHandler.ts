import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as moment from 'moment';
import * as requestPromise from 'request-promise';
import { Issue } from '../api-interfaces/Issue';
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

export class ReadIssuesIntentHandler extends AuthenticatedCheckRequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadIssuesIntent'
    );
  }
  async handleAfterAuthenticationCheck(handlerInput: Alexa.HandlerInput) {
    const rp: typeof requestPromise = handlerInput.attributesManager.getRequestAttributes()
      .rp;

    const page =
      handlerInput.attributesManager.getSessionAttributes().nextPage || 1;

    const apiParams = buildUrlParams({
      state: 'opened',
      scope: 'assigned_to_me',
      order_by: 'updated_at',
      per_page: 5,
      page,
    });

    const [currentUser, result]: [User, any] = await Promise.all([
      rp.get('https://gitlab.com/api/v4/user'),
      rp.get(`https://gitlab.com/api/v4/issues?${apiParams}`, {
        resolveWithFullResponse: true,
      }),
    ]);

    const issues: Issue[] = result.body;

    const issueSpeeches: string[] = [];

    for (const issue of issues) {
      const translationValues: { [key: string]: string } = {
        id: makeIdsSpeakable(issue.iid),
        title: await makeMarkDownSpeakable(issue.title, rp),
        author:
          issue.author.id === currentUser.id
            ? i18n.t('you')
            : await getUsersName(`@${issue.author.username}`, rp),
        timeAgo: moment(issue.created_at).fromNow(),
      };

      let speech: string;
      speech = chooseOne(
        mft('Number {{id}} was created {{timeAgo}} by {{author}}: {{title}}'),
        mft('Number {{id}} was authored {{timeAgo}} by {{author}}: {{title}}'),
        mft('Number {{id}} was created by {{author}} {{timeAgo}}: {{title}}'),
        mft('Number {{id}} was authored by {{author}} {{timeAgo}} : {{title}}'),
      );

      issueSpeeches.push(i18n.t(speech, translationValues));
    }

    const paginationInfo = getPagination(
      result.headers,
      i18n.t('issue'),
      i18n.t('issues'),
    );

    if (paginationInfo.isMore) {
      issueSpeeches.push(paginationInfo.moreText);

      handlerInput.attributesManager.setSessionAttributes({
        YesIntentQuestion: YesIntentQuestion.ShouldContinueReadingIssues,
        nextPage: paginationInfo.nextPage,
      });
    }

    // Pause between each issue
    const speechText = issueSpeeches.join('<break time="1s"/>');

    const builder = handlerInput.responseBuilder.speak(speechText);

    if (paginationInfo.isMore) {
      builder.reprompt(i18n.t('Would you like me to keep going?'));
    }

    return builder.getResponse();
  }
}
