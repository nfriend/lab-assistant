import { db as realDb } from '../dynamo-db';

export const db: typeof realDb = {
  put(requestEnvelope, values) {
    return Promise.resolve();
  },
  get(requestEnvelope) {
    return Promise.resolve({});
  },
  delete() {
    return Promise.resolve();
  },
};
