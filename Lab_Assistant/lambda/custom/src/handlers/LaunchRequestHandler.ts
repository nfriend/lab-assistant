import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class LaunchRequestHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const isFirstLaunch: boolean = handlerInput.attributesManager.getRequestAttributes()
      .isFirstLaunch;

    const speeches: string[] = [];

    if (isFirstLaunch) {
      speeches.push(
        chooseOne(
          i18n.t('Welcome to Lab Assistant!'),
          i18n.t('Hello!'),
          i18n.t('Happy gitlabing!'),
        ),
        i18n.t(
          'Looks like this is your first visit! I\'ll explain a few things you can do, and feel free to say "help" at any time for assistance.',
        ),
        i18n.t(
          'You can trigger a pipeline by saying <break strength="strong"/> <prosody pitch="+10%">"run a new pipeline."</prosody>',
        ),
        i18n.t(
          'Catch up on your workload by saying <break strength="strong"/> <prosody pitch="+10%">"to-dos"</prosody>, <break strength="strong"/> <prosody pitch="+10%">"issues"</prosody>, or <break strength="strong"/> <prosody pitch="+10%">"merge requests."</prosody>',
        ),
        i18n.t('What would you like to do?'),
      );
    } else {
      speeches.push(
        chooseOne(
          i18n.t('Welcome! How can I help?'),
          i18n.t('Hello! What would you like to do?'),
          i18n.t('Happy gitlabing! How can I help?'),
          i18n.t('How can I help?'),
          i18n.t('What would you like to do?'),
          i18n.t('How can I help?'),
        ),
      );
    }

    const repromptSpeeches = [
      chooseOne(i18n.t('What you you like to do?'), i18n.t('How can I help?')),
      chooseOne(
        i18n.t(
          'If you need some instructions, just say <break strength="strong"/> <prosody pitch="+10%">"help"</prosody>.',
        ),
        i18n.t(
          'Feel free to say <break strength="strong"/> <prosody pitch="+10%">"help"</prosody> if you need some instructions.',
        ),
      ),
    ];

    return handlerInput.responseBuilder
      .speak(speeches.join(' '))
      .reprompt(repromptSpeeches.join(' '))
      .getResponse();
  }
}
