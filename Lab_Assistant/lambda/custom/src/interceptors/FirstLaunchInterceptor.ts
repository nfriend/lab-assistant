import * as Alexa from 'ask-sdk-core';
import { db } from '../adapters/dynamo-db';

export class FirstLaunchInterceptor implements Alexa.RequestInterceptor {
  async process(handlerInput: Alexa.HandlerInput) {
    const lastLaunch = (await db.get(handlerInput.requestEnvelope)).lastLaunch;

    await db.put(handlerInput.requestEnvelope, { lastLaunch: new Date().getTime().toString() });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.isFirstLaunch = !lastLaunch;
  }
}
