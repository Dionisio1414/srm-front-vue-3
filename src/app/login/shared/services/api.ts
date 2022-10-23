import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/login/shared/config/api-constants';

import type { User, AuthData } from '@/@types/authorization';

async function getUser<T = User>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_USER);

  return response.data;
}

async function loginUser<T = AuthData>(payload: { login: string; password: string }): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.LOGIN, payload);

  return response.data;
}

export { getUser, loginUser };
