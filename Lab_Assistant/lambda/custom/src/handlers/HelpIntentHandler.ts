import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import { chooseOne } from '../util/choose-one';

export class HelpIntentHandler implements Alexa.RequestHandler {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  }
  handle(handlerInput: Alexa.HandlerInput) {
    const speeches: string[] = [];

    speeches.push(
      i18n.t(
        'To get information about your workload, try saying <break strength="strong"/> <prosody pitch="+10%">"to-dos"</prosody>, <break strength="strong"/> <prosody pitch="+10%">"do I have any merge requests?"</prosody>, or <break strength="strong"/> <prosody pitch="+10%">"what issues are assigned to me?"</prosody>',
      ),
    );

    speeches.push(
      i18n.t(
        'To run a pipe line, say something like <break strength="strong"/> <prosody pitch="+10%">"run a pipeline,"</prosody> or <break strength="strong"/> <prosody pitch="+10%">"execute a new deployment."</prosody>',
      ),
    );

    speeches.push(
      i18n.t(
        'To take full advantage of the pipeline feature, make sure your C.I. config file is set up properly.',
      ),
    );

    speeches.push(
      i18n.t("Check out the Lab Assistant skill's homepage or Gitlab repo for instructions."),
    );

    speeches.push(
      chooseOne(
        i18n.t("That's all I can do at the moment!"),
        i18n.t("And that's it!"),
        i18n.t("That's it for now!"),
      ),
    );

    speeches.push(
      chooseOne(
        i18n.t(
          'If you have ideas for other things I should do, please open an issue on the Lab Assistant Gitlab repo.',
        ),
        i18n.t(
          "I'd love your ideas for other things I should do. Feel free to open an issue on the Lab Assistant Gitlab repo.",
        ),
        i18n.t(
          "Have a feature you'd like to see added? Feel free to open an issue on the Lab Assistant Gitlab repo.",
        ),
      ),
    );

    speeches.push('<break time="500ms"/>');

    speeches.push(
      chooseOne(
        i18n.t('Now that you know some of the things you can ask me, what would you like to do?'),
        i18n.t('Now that you know some of the things you can ask me, how can I help?'),
      ),
    );

    const speakOutput = speeches.join(' ');

    const repromptSpeech = i18n.t('What would you like to do?');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptSpeech)
      .getResponse();
  }
}
