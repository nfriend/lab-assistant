/**
 * Builds a hash of params into a query string
 * (does not prefix with `?`)
 * @param params A hash of params
 */
export const buildUrlParams = (params: { [key: string]: any }): string => {
  return Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
};
