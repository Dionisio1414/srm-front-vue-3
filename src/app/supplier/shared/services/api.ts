import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/supplier/shared/config/api-constants';

import type { Shipments } from '@/@types/shipment';
import type { ListOrder, OrderFactory } from '@/@types/order';
import type { Sort, Filter, PageFilter, ShipmentsFilter } from '@/@types/table';
import type {
  ActiveProduct,
  ActiveSwhProduct,
  SupplierProduct,
  SwhProduct,
  SupplyProduct,
} from '@/@types/product';

async function getOrders<T = { data: ListOrder[]; items_count: number }>(
  params: Sort & Filter & ShipmentsFilter & PageFilter
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_ORDERS, { params });

  return response.data;
}

async function getProducts<T = { items: SupplierProduct[]; totalUsd: number }>(
  guid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_PRODUCTS.replace('{guid}', guid)
  );

  return response.data;
}

async function getShipments<T = { data: Shipments[]; items_count: number }>(
  params: PageFilter & { supplier: null | string }
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SHIPMENTS, { params });

  return response.data;
}

async function getSwh<T = { data: SwhProduct[]; items_count: number }>(
  guid: string,
  params: PageFilter & { search: string | null }
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_SWH.replace('{guid}', guid),
    { params }
  );

  return response.data;
}

async function moveToSwh<T = { message: string; success: boolean }>(params: {
  products: ActiveProduct[];
}): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.MOVE_TO_SWH, params);

  return response.data;
}

async function moveToSupply<T = { message: string; success: boolean; supplyNumber: number }>(
  guid: string,
  params: ActiveSwhProduct[]
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.MOVE_TO_SUPPLY, {
    supplierGuid: guid,
    products: params,
  });

  return response.data;
}

async function getFactoryInfo<T = OrderFactory>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FACTORY_SHORT_INFO.replace('{guid}', guid)
  );

  return response.data;
}

async function getSupplies<T = { data: SupplyProduct[]; items_count: number }>(
  guid: string,
  params: PageFilter & Sort & Filter & ShipmentsFilter
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_SUPPLIES.replace('{guid}', guid),
    { params: { ...params, supplier: [guid] } }
  );

  return response.data;
}

async function changeReliableMark<T = { isReliableSupplierChanged: boolean }>(
  guid: string,
  isReliableSupplier: boolean
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_RELIABLE_MARK.replace('{guid}', guid),
    { isReliableSupplier }
  );

  return response.data;
}

async function deleteSwhProduct<T = { message: string; success: boolean }>(
  guid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_SWH_PRODUCT.replace('{guid}', guid)
  );

  return response.data;
}

export {
  getOrders,
  getProducts,
  getShipments,
  getSwh,
  moveToSwh,
  moveToSupply,
  getFactoryInfo,
  getSupplies,
  changeReliableMark,
  deleteSwhProduct,
};
