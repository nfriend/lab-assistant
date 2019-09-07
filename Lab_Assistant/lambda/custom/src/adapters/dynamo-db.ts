import * as Adapter from 'ask-sdk-dynamodb-persistence-adapter';
import { RequestEnvelope } from 'ask-sdk-model';

export const adapter = new Adapter.DynamoDbPersistenceAdapter({
  tableName: 'LabAssistant',
  createTable: true,
});

export interface LabAssistantAttributes {
  projectId?: string;
}

export const db = {
  /**
   * Writes values to the database
   * @param requestEnvelope The current request envelope
   * @param values The values to write to the database
   */
  async put(requestEnvelope: RequestEnvelope, values: LabAssistantAttributes): Promise<void> {
    const attrs = await adapter.getAttributes(requestEnvelope);
    await adapter.saveAttributes(requestEnvelope, {
      ...attrs,
      ...values,
    });
  },

  /**
   * Gets all the values from the database
   * @param requestEnvelope The current request envelope
   */
  async get(requestEnvelope: RequestEnvelope): Promise<LabAssistantAttributes> {
    return (await adapter.getAttributes(requestEnvelope)) as LabAssistantAttributes;
  },

  /**
   * Deletes one or more values from the database
   * @param requestEnvelope The current request envelope
   * @param keys A list of keys to delete
   */
  async delete(
    requestEnvelope: RequestEnvelope,
    keys: Array<keyof LabAssistantAttributes>,
  ): Promise<void> {
    const attrs = await adapter.getAttributes(requestEnvelope);
    for (const key of keys) {
      delete attrs[key];
    }
    await adapter.saveAttributes(requestEnvelope, attrs);
  },
};
