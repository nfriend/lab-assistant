import { getProject } from '../../src/util/get-project';

describe('get-project', () => {
  let result: any;

  const rpMock: any = {
    get() {
      return Promise.resolve(result);
    },
  };

  test('when the project exists', async () => {
    result = {
      statusCode: 200,
      body: {
        id: '1234',
      },
    };

    const project = await getProject(rpMock, '1234');

    expect(project).toEqual(result.body);
  });

  test('when the project does not exist', async () => {
    result = {
      statusCode: 404,
    };

    const project = await getProject(rpMock, '1234');

    expect(project).toBeUndefined();
  });
});
