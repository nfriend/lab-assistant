import * as Alexa from 'ask-sdk-core';
import * as rp from 'request-promise';

/**
 * Sets up some request-promise defaults to make it
 * simpler to make requests inside handlers
 */
export const AuthInterceptor: Alexa.RequestInterceptor = {
  async process(handlerInput) {
    // set up all requests to use JSON
    const defaults: rp.RequestPromiseOptions = {
      json: true,
    };

    // if the user has already connected their account
    // set up the request to send along the credentials
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;
    if (accessToken) {
      defaults.auth = { bearer: accessToken };
    }

    const attributes = handlerInput.attributesManager.getRequestAttributes();

    // the properly defaulted version of request-promise will now be
    // available in handlers as handlerInput.attributesManager.getRequestAttributes().rp
    attributes.rp = rp.defaults(defaults);
  },
};
