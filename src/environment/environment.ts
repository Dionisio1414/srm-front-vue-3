const {
  VUE_APP_BASE_URL,
  VUE_APP_API_TIMEOUT,
  VUE_APP_API_BASE_URL,
  VUE_APP_CI_COMMIT_TAG,
  NODE_ENV = '',
} = process.env;

const environment: string = NODE_ENV.toLowerCase();
const baseUrl: string = VUE_APP_BASE_URL;
const apiTimeout = Number(VUE_APP_API_TIMEOUT);
const apiBaseUrl: string = VUE_APP_API_BASE_URL;
const commitTag: string = VUE_APP_CI_COMMIT_TAG;

export { environment, apiTimeout, baseUrl, apiBaseUrl, commitTag };
