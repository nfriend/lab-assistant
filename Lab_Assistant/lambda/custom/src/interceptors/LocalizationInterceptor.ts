import * as Alexa from 'ask-sdk-core';
import * as fs from 'fs';
import * as i18n from 'i18next';
import * as path from 'path';
import * as util from 'util';

export class LocalizationInterceptor implements Alexa.RequestInterceptor {
  private translationsPromise: Promise<{ [lang: string]: any }>;

  constructor() {
    const readdirAsync = util.promisify(fs.readdir);

    const I18N_DIR = path.resolve(__dirname, '../../i18n');

    /** A promise that returns an object containing all available translations */
    this.translationsPromise = (async () => {
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
  }

  async process(handlerInput: Alexa.HandlerInput) {
    await i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      resources: await this.translationsPromise,
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
  }
}
