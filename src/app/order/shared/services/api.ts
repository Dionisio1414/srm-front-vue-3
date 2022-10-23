import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/order/shared/config/api-constants';

import type {
  Order,
  Info,
  StatusHistory,
  OrderLog,
  ProductLog,
  MailsHistory,
  FileStatus,
} from '@/@types/order';
import type { EditedProduct, Product } from '@/@types/product';
import type { OrderFiles, Prepayment, Overpayment } from '@/@types/additional';
import type { OrderFormData } from '@/@types/form-data';
import type { MessageResponse } from '@/@types/request';

async function getOrder<T = Order>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_ORDER.replace('{guid}', guid)
  );

  return response.data;
}

async function getProducts<T = { items: Product[]; totalUsd: number; totalQty: number }>(
  guid: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_PRODUCTS.replace('{guid}', guid)
  );

  return response.data;
}

async function getFiles<T = OrderFiles>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FILES.replace('{guid}', guid)
  );

  return response.data;
}

async function getInfo<T = Info>(guid: string, factoryGuid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_INFO.replace('{guid}', factoryGuid),
    { params: { orderGuid: guid } }
  );

  return response.data;
}

async function getPrepayment<T = Prepayment>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_PREPAYMENT.replace('{guid}', guid)
  );

  return response.data;
}

async function getOverpayment<T = Overpayment>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_OVERPAYMENT.replace('{guid}', guid)
  );

  return response.data;
}

async function setPrepayment<T = { message: string; success: boolean }>(
  guid: string,
  amount: number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.SET_PREPAYMENT.replace('{guid}', guid),
    { amount }
  );

  return response.data;
}

async function calculatePercents<T = { percent: number }>(
  guid: string,
  amount: number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CALCULATE_PREPAYMENT_PERCENTS.replace('{guid}', guid),
    { amount }
  );

  return response.data;
}

async function calculateAmount<T = { amount: number }>(guid: string, percent: number): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CALCULATE_PREPAYMENT_AMOUNT.replace('{guid}', guid),
    { percent }
  );

  return response.data;
}

async function getStatusHistory<T = StatusHistory[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_STATUS_HISTORY.replace('{guid}', guid)
  );

  return response.data;
}

async function getChangesHistory<T = OrderLog[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_CHANGES_HISTORY.replace('{guid}', guid)
  );

  return response.data;
}

async function getProductsChangesHistory<T = ProductLog[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_PRODUCTS_CHANGES_HISTORY.replace('{guid}', guid)
  );

  return response.data;
}

async function getFileLink<T = { _tmp_url: string }>(guid: string, fileGuid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FILE_LINK.replace('{guid}', guid).replace('{fileGuid}', fileGuid)
  );

  return response.data;
}

async function addFile<T = OrderFiles>(
  guid: string,
  type: keyof OrderFiles,
  formData: FormData
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.LOAD_FILE.replace('{guid}', guid).replace('{type}', type),
    formData
  );

  return response.data;
}

async function deleteFile<T = []>(guid: string, fileGuid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_FILE.replace('{guid}', guid).replace('{fileGuid}', fileGuid)
  );

  return response.data;
}

async function setComment<T = StatusHistory>(
  guid: string,
  statusId: number,
  comment: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.SET_COMMENT.replace('{guid}', guid),
    { status_id: statusId, comment }
  );

  return response.data;
}

async function rollbackStatus<T = StatusHistory>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.ROLLBACK_STATUS.replace('{guid}', guid)
  );

  return response.data;
}

async function changeStatus<T = StatusHistory>(
  guid: string,
  statusId: number,
  reasonId?: number,
  comment?: string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_STATUS.replace('{guid}', guid),
    { status_id: statusId, reason_id: reasonId, comment }
  );

  return response.data;
}

async function changeOrder<T = { message: string; success: boolean }>(
  guid: string,
  userId: number,
  statusId: number,
  isAdmin: boolean,
  formData: OrderFormData
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_ORDER.replace('{guid}', guid),
    {
      ...formData.orderInfo,
      ...formData.payData,
      ...formData.bankData,
      ...formData.proformaInvoice,
      ...formData.factoryData,
      ...formData.payDelayInfoData,
      ...formData.termsDeliveryData,
      ...formData.additionalData,

      port_of_loading: [...formData.deliveryPortsData],

      user_id: userId,
      status_id: statusId,
      is_admin: isAdmin,
    }
  );

  return response.data;
}

async function changeProducts<T = { message: string; success: boolean }>(
  guid: string,
  userId: number,
  status: number,
  params: EditedProduct[]
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_PRODUCTS.replace('{guid}', guid),
    { user_id: userId, status_id: status, order_products: params }
  );

  return response.data;
}

async function deleteProducts<T = { message: string; success: boolean }>(
  guid: string,
  guids: string[],
  user_id: number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.delete(
    ApiConstants.DELETE_PRODUCTS.replace('{guid}', guid),
    { params: { order_product_guids: guids, user_id } }
  );

  return response.data;
}

async function generatePi<T = File>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.GENERATE_PI.replace('{guid}', guid)
  );

  return response.data;
}

async function getMailsHistory<T = MailsHistory[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_MAILS_HISTORY.replace('{guid}', guid)
  );

  return response.data;
}

async function generateLabels<T = MessageResponse>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.GENERATE_LABEL.replace('{guid}', guid)
  );

  return response.data;
}

async function getFilesStatus<T = FileStatus[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FILES_STATUSES.replace('{guid}', guid)
  );

  return response.data;
}

export {
  getOrder,
  getProducts,
  getFiles,
  getInfo,
  getPrepayment,
  getOverpayment,
  getStatusHistory,
  getChangesHistory,
  getProductsChangesHistory,
  getFileLink,
  addFile,
  deleteFile,
  setComment,
  rollbackStatus,
  changeStatus,
  setPrepayment,
  calculatePercents,
  calculateAmount,
  changeOrder,
  changeProducts,
  deleteProducts,
  generatePi,
  getMailsHistory,
  generateLabels,
  getFilesStatus,
};
