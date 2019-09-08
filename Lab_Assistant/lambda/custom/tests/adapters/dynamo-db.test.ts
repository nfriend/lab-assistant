import { RequestEnvelope } from 'ask-sdk-model';
import { adapter, db, LabAssistantAttributes } from '../../src/adapters/dynamo-db';

jest.mock('ask-sdk-dynamodb-persistence-adapter');

interface LabAssistantAttributesMock extends LabAssistantAttributes {
  mockProperty?: string;
}

describe('dynamo-db', () => {
  const values: LabAssistantAttributesMock = {
    projectId: '4',
    mockProperty: 'test',
  };

  const requestEnvelope: any = {};

  beforeEach(() => {
    jest.spyOn(adapter, 'getAttributes').mockImplementation(async () => Promise.resolve(values));
    jest.spyOn(adapter, 'saveAttributes').mockImplementation(async () => Promise.resolve());
  });

  test('all values are returned when db.get is called', async () => {
    const result = await db.get(requestEnvelope);

    expect(result).toEqual(values);
  });

  test('values are deleted when db.delete is called', async () => {
    await db.delete(requestEnvelope, ['projectId']);

    expect(adapter.saveAttributes).toHaveBeenCalledWith(requestEnvelope, { mockProperty: 'test' });
  });

  test('values are updated when db.put is called', async () => {
    await db.put(requestEnvelope, { projectId: '6' });

    expect(adapter.saveAttributes).toHaveBeenCalledWith(requestEnvelope, {
      ...values,
      projectId: '6',
    });
  });
});
