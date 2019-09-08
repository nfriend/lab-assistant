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
        'To get information about your workload, try saying <break strength="strong"/> <prosody pitch="+10%">"issues"</prosody>, <break strength="strong"/> <prosody pitch="+10%">"do I have any merge requests?"</prosody>, or <break strength="strong"/> <prosody pitch="+10%">"what issues are assigned to me?"</prosody>',
      ),
    );

    speeches.push(
      i18n.t(
        'To run a pipeline, say something like <break strength="strong"/> <prosody pitch="+10%">"run a pipeline"</prosody> or <break strength="strong"/> <prosody pitch="+10%">"execute a new deployment"</prosody>.',
      ),
    );

    speeches.push(
      i18n.t(
        'To take full advantage of the pipeline feature, make sure your C.I. config file is setup up properly.',
      ),
    );

    speeches.push(
      i18n.t(
        "Check out the Lab Assistant skill's homepage or the Lab Assistant Gitlab repo for instructions.",
      ),
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

    const speakOutput = speeches.join(' ');

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
}
