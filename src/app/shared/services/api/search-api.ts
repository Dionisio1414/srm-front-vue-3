import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/shared/config/search-api-constants';

import type { ForwarderShort, SupplierSearch, Category } from '@/@types/additional';
import type { SearchParams, SearchData } from '@/@types/request';

async function searchForwarders<T = SearchData<ForwarderShort>>(params: SearchParams): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.SEARCH_FORWARDERS, {
    params,
  });

  return response.data;
}

async function searchStrictForwarders<T = SearchData<ForwarderShort>>(
  params: SearchParams
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.SEARCH_STRICT_FORWARDERS, {
    params,
  });

  return response.data;
}

async function searchSupplier<T = SearchData<SupplierSearch>>(params: SearchParams): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.SEARCH_SUPPLIER, {
    params: { ...params, sort_key: 'name', order: 'desc' },
  });

  return response.data;
}

async function searchCategories<T = SearchData<Category>>({
  page,
  perPage,
  query,
}: SearchParams): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.SEARCH_CATEGORIES, {
    params: { page, perPage, ...((query && { search: query }) || {}) },
  });

  return response.data;
}

export { searchForwarders, searchStrictForwarders, searchSupplier, searchCategories };
