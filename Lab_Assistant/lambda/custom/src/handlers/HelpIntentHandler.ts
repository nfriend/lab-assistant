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
    let speakOutput = i18n.t(
      'To get information about your to-dos, say <break strength="strong"/> <prosody pitch="+10%">"do I have any to-dos?"</prosody> ',
    );

    speakOutput += chooseOne(
      i18n.t("That's all I can do at the moment! "),
      i18n.t("And that's it! "),
      i18n.t("That's it for now! "),
    );

    speakOutput += chooseOne(
      i18n.t(
        "But be sure to check back in regularly as I'll be getting smarter every day.",
      ),
      i18n.t("I know it's not much, but much more is coming soon!"),
      i18n.t(
        'If you have ideas for other things I should do, please open an issue on the Lab Assistant Gitlab repo.',
      ),
      i18n.t(
        "I'd love your ideas for other things I should do. Feel free to open an issue on the Lab Assistant Gitlab repo.",
      ),
      i18n.t(
        "Have a feature you'd like to see added? Feel free to open an issue on the Lab Assistant Gitlab repo.",
      ),
    );

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
}
