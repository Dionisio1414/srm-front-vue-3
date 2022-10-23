import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/orders/shared/config/api-constants';

import type { ListOrder, ChangeStatusPlanned } from '@/@types/order';
import type { StatisticsStatus } from '@/@types/additional';
import type { Sort, Filter } from '@/@types/table';

async function getOrders<T = { data: ListOrder[]; items_count: number }>(
  params: Sort & Filter
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_ORDERS, { params });

  return response.data;
}

async function getStatisticsStatuses<T = StatisticsStatus[]>(params: Sort & Filter): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_ORDER_STATUSES, {
    params,
  });

  return response.data;
}

async function updateResponsible<T = { items: ListOrder[]; status: boolean }>(
  guids: string[],
  userId: number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.UPDATE_RESPONSIBLE, {
    guids,
    userId,
  });

  return response.data;
}

async function changeStatusPlanned<T = { message: string; success: boolean }>(
  payload: ChangeStatusPlanned
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(ApiConstants.CHANGE_ORDER_STATUSES, {
    ...payload,
  });

  return response.data;
}

export { getOrders, getStatisticsStatuses, updateResponsible, changeStatusPlanned };
