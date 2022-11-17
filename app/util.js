
/**
 * Get api request params for url
 * @param {*} params
 * @returns
 */
 export const getQueryString = (params) => {
    return Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
  };
