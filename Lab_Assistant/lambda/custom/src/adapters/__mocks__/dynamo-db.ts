import { db as realDb } from '../dynamo-db';

export const db: typeof realDb = {
  put(requestEnvelope, values) {
    console.log('inside put()');

    return Promise.resolve();
  },
  get(requestEnvelope) {
    return Promise.resolve({});
  },
  delete() {
    return Promise.resolve();
  },
};
