import * as requestPromise from 'request-promise';

/**
 * Gets a project object, or returns undefined if the project doesn't exist
 * @param rp A request-promise instance that has been setup to make GitLab.com API requests
 * @param projectId The ID of the project to get
 */
export const getProject = async (rp: typeof requestPromise, projectId: string) => {
  const response = await rp.get(`https://gitlab.com/api/v4/projects/${projectId}`, {
    resolveWithFullResponse: true,
    simple: false,
  });

  if (response.statusCode === 404) {
    return undefined;
  } else {
    return response.body;
  }
};
