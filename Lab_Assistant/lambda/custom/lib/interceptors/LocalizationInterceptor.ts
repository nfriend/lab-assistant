import * as Alexa from 'ask-sdk-core';
import * as i18n from 'i18next';
import * as sprintf from 'i18next-sprintf-postprocessor';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readdirAsync = util.promisify(fs.readdir);

const I18N_DIR = path.resolve(__dirname, '../../../i18n');

/** A promise that returns an object containing all available translations */
const translationsPromise = (async () => {
  const langs = (await readdirAsync(I18N_DIR, {
    withFileTypes: true,
  }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const translations: { [lang: string]: any } = {};

  langs.forEach(l => {
    translations[l] = {
      translation: require(path.resolve(I18N_DIR, l, 'translation.json')),
    };
  });

  return translations;
})();

export const LocalizationInterceptor: Alexa.RequestInterceptor = {
  async process(handlerInput) {
    await i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      resources: await translationsPromise,
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
    });
  },
};
