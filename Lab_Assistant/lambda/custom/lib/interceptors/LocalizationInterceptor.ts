import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as sprintf from 'i18next-sprintf-postprocessor';

const translations = {
  en: require('../../i18n/en/translation.json'),
};

export const LocalizationInterceptor: Alexa.RequestInterceptor = {
  async process(handlerInput) {
    await i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      resources: translations,
    });
  },
};
