import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/supplies/shared/config/api-constants';

import type { Supplies } from '@/@types/supplies';
import type { Sort, Filter } from '@/@types/table';

async function getSuppliesList<T = { data: Supplies[]; items_count: number }>(
  params: Sort & Filter
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SUPPLIES, { params });

  return Promise.resolve(response.data);
}

export { getSuppliesList };
