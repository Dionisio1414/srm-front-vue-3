import { Ref } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { useLocalStorage } from '@vueuse/core';

import { apiBaseUrl, apiTimeout } from '@/environment/environment';

import type { LoginState } from '@/app/login/shared/store/login-store';

const showLoader = () => {
  const showEvent = new CustomEvent('show:loader');
  document.dispatchEvent(showEvent);
};

const hideLoader = () => {
  const hideEvent = new CustomEvent('hide:loader');
  document.dispatchEvent(hideEvent);
};

const headers = {
  'X-AWP-SDK-Version': 'v0.0.1',
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json',
  'X-CSRF-TOKEN': 'null',
};

const config: AxiosRequestConfig = {
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers,
};

const httpClient = axios.create(config);

const authInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const localStorage = useLocalStorage('login', {} as LoginState);
  const { info } = (localStorage as Ref<LoginState>).value || {};

  if (Object.values(info).length) {
    config.headers = {
      ...headers,
      Authorization: `${info.tokenType} ${info.token}`,
      'X-Awp-Authorization': `${info.tokenType} ${info.token}`,
      'X-Auth-Type': info.authType,
    };
  }

  showLoader();

  return config;
};

httpClient.interceptors.request.use(authInterceptor);

httpClient.interceptors.response.use(
  (response) => {
    hideLoader();

    return response;
  },
  (error) => {
    hideLoader();

    return Promise.reject(error);
  }
);

export default httpClient;
