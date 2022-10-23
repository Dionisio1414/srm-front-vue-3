import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/supply/shared/config/api-constants';

import type { Supply, SupplyProducts, StatusHistory, SupplyOrders } from '@/@types/supply';
import type { ActiveSwhProduct } from '@/@types/product';
import type { FileInner, SupplyFiles } from '@/@types/additional';
import type { MessageResponse } from '@/@types/request';

async function getSupply<T = Supply>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_SUPPLY.replace('{guid}', guid)
  );

  return response.data;
}

async function getProducts<T = SupplyProducts[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.SUPPLY_PRODUCTS.replace('{guid}', guid)
  );

  return Promise.resolve(response.data);
}

async function deleteProduct<T = { message: string; success: boolean }>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_SUPPLY_PRODUCT.replace('{guid}', guid)
  );

  return Promise.resolve(response.data);
}

async function addProducts<T = { message: string; success: boolean; supplyNumber: number }>({
  products,
  guid,
}: {
  products: ActiveSwhProduct[];
  guid: string;
}): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.SET_SUPPLY_PRODUCTS.replace('{guid}', guid),
    { products }
  );

  return Promise.resolve(response.data);
}

async function getFiles<T = { items: FileInner[] }>(
  guid: string,
  type: keyof SupplyFiles
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FILES.replace('{guid}', guid).replace('{typeFiles}', type)
  );

  return response.data;
}

async function addFile<T = { message: string; success: boolean }>(
  guid: string,
  type: keyof SupplyFiles,
  formData: FormData
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.ADD_FILE.replace('guid', guid).replace('{fileType}', type),
    formData
  );

  return response.data;
}

async function deleteFile<T = { message: string; success: boolean }>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_FILE.replace('{guid}', guid)
  );

  return response.data;
}

async function getFileLink<T = { _tmp_url: string }>(guid: string, fileGuid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FILE_LINK.replace('{guid}', guid).replace('{fileGuid}', fileGuid)
  );

  return response.data;
}

async function getStatusHistory<T = StatusHistory[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_STATUS_HISTORY.replace('{guid}', guid)
  );

  return response.data;
}

async function changeStatus<T = { changeSupplyStatus: boolean }>(
  guid: string,
  statusId: number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_STATUS.replace('{guid}', guid),
    { statusId }
  );

  return response.data;
}

async function changeCargoReadyDate<T = MessageResponse>(
  guid: string,
  cargoReadyDate: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_CARGO_READY_DATE.replace('{guid}', guid),
    { cargoReadyDate }
  );

  return response.data;
}

async function getSupplyOrders<T = SupplyOrders>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_SUPPLY_ORDERS.replace('{guid}', guid)
  );

  return response.data;
}

async function rollbackStatus<T = { changeSupplyStatus: boolean }>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.ROLLBACK_STATUS.replace('{guid}', guid)
  );

  return response.data;
}

export {
  getSupply,
  getProducts,
  deleteProduct,
  addProducts,
  getFiles,
  addFile,
  deleteFile,
  getFileLink,
  getStatusHistory,
  changeStatus,
  changeCargoReadyDate,
  getSupplyOrders,
  rollbackStatus,
};
