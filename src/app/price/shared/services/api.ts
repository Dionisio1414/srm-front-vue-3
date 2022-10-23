import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/price/shared/config/api-constants';

import type { Price } from '@/@types/price';
import type { ForwarderExpanse, PriceFormData } from '@/@types/form-data';
import type { PageFilter, PricesFilter } from '@/@types/table';

async function getPrices<T = { data: Price[]; items_count: number }>(
  params: PageFilter & PricesFilter
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_PRICES, { params });

  return response.data;
}

async function getPrice<T = Price>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_PRICE.replace('{guid}', guid)
  );

  return response.data;
}

async function createPrice(params: PriceFormData): Promise<never> {
  const response: AxiosResponse<never> = await httpClient.post(ApiConstants.CREATE_PRICE, params);

  return response.data;
}

async function movePriceToActive<T = { message: string; success: boolean }>(
  guid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.MOVE_PRICE_TO_ACTIVE.replace('{guid}', guid)
  );

  return response.data;
}

async function movePriceToArchive<T = { message: string; success: boolean }>(
  guid: string,
  params: { reason_id: number; comment: string }
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.MOVE_PRICE_TO_ARCHIVE.replace('{guid}', guid),
    params
  );

  return response.data;
}

async function changeRelevantDate<T = { message: string; success: boolean }>(
  guid: string,
  params: { relevant_date_from: string; relevant_date_to: string }
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_RELEVANT_DATE.replace('{guid}', guid),
    params
  );

  return response.data;
}

async function changePriceExpanse<T = { message: string; success: boolean }>(
  guid: string,
  params: ForwarderExpanse
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_PRICE_EXPANSE.replace('{guid}', guid),
    { expance_fields: [params] }
  );

  return response.data;
}

export {
  createPrice,
  getPrices,
  getPrice,
  movePriceToActive,
  movePriceToArchive,
  changeRelevantDate,
  changePriceExpanse,
};
