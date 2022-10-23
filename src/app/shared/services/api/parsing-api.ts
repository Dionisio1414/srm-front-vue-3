import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/shared/config/parsing/parsing-api-constants';

import type { CompareData, ParsingFields } from '@/@types/additional';

async function loadCompareFile<T = never>(guid: string, formData: FormData | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.LOAD_COMPARE_FILE.replace('{guid}', guid),
    formData
  );

  return response.data;
}

async function compare<T = CompareData>(guid: string, formData: ParsingFields): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.COMPARE.replace('{guid}', guid),
    formData
  );

  return response.data;
}

async function addSupplyFromFile<T = never>(formData: FormData): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.ADD_SUPPLY_FROM_FILE,
    formData
  );

  return response.data;
}

async function replaceSupplyProducts<T = never>(guid: string, formData: FormData): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.REPLACE_SUPPLY_PRODUCTS.replace('{guid}', guid),
    formData
  );

  return response.data;
}

async function addSupplyProducts<T = never>(guid: string, formData: FormData): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.ADD_SUPPLY_PRODUCTS.replace('{guid}', guid),
    formData
  );

  return response.data;
}

async function loadSupplyCompareFile<T = { supply_file_guid: string }>(
  guid: string,
  fileType: string,
  formData: FormData | null
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.LOAD_SUPPLY_COMPARE_FILE.replace('{guid}', guid).replace('{fileType}', fileType),
    formData
  );

  return response.data;
}

async function supplyCompare<T = CompareData>(
  guid: string,
  formData: ParsingFields,
  fileGuid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.SUPPLY_COMPARE.replace('{guid}', guid),
    { ...formData, supply_file_guid: fileGuid }
  );

  return response.data;
}

export {
  loadCompareFile,
  compare,
  addSupplyFromFile,
  replaceSupplyProducts,
  addSupplyProducts,
  loadSupplyCompareFile,
  supplyCompare,
};
