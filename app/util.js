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

export const initChangeDetection = (form) => {
  Array.from(form).forEach((el) => (el.dataset.origValue = el.value));
};

export const formHasChanges = (form) => {
  return Array.from(form).some(
    (el) => "origValue" in el.dataset && el.dataset.origValue !== el.value
  );
};
