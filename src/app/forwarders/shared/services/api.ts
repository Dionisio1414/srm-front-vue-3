import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/forwarders/shared/config/api-constants';

import type { Forwarder, ForwarderItem } from '@/@types/forwarder';
import type {
  ForwarderData,
  ForwarderLegal,
  ForwarderContact,
  ForwarderBaseInfoShort,
  ForwarderServiceInfo,
} from '@/@types/form-data';

async function getForwarders<T = { data: Forwarder[]; items_count: number }>(params: {
  search?: string | null;
  page: number | string;
  per_page: number | string;
}): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_FORWARDERS, { params });

  return response.data;
}

async function getForwarder<T = ForwarderItem>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FORWARDER.replace('{guid}', guid)
  );

  return response.data;
}

async function createForwarder<T = ForwarderData>(formData: T): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.CREATE_FORWARDER, formData);

  return response.data;
}

async function updateLegalInfo<T = { message: string; success: boolean }>(
  guid: string,
  params: ForwarderLegal[]
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.UPDATE_LEGAL_INFO.replace('{guid}', guid),
    { legal_information: params }
  );

  return response.data;
}

async function updateContactInfo<T = { message: string; success: boolean }>(
  guid: string,
  params: ForwarderContact
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.UPDATE_CONTACT_INFO.replace('{guid}', guid),
    params
  );

  return response.data;
}

async function updateServiceInfo<T = { message: string; success: boolean }>(
  guid: string,
  params: ForwarderServiceInfo
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.UPDATE_SERVICE_INFO.replace('{guid}', guid),
    params
  );

  return response.data;
}

async function updateBaseInfo<T = { message: string; success: boolean }>(
  guid: string,
  params: ForwarderBaseInfoShort
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.UPDATE_BASE_INFO.replace('{guid}', guid),
    params
  );

  return response.data;
}

async function deleteForwarder<T = { message: string; success: boolean }>(
  guid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_FORWARDER.replace('{guid}', guid)
  );

  return response.data;
}

export {
  getForwarders,
  getForwarder,
  createForwarder,
  updateLegalInfo,
  updateContactInfo,
  updateServiceInfo,
  updateBaseInfo,
  deleteForwarder,
};
