import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/shipments/shared/config/api-constants';

import type { Shipments } from '@/@types/shipment';
import type { ShipmentsFilter, PageFilter, Filter } from '@/@types/table';
import type { ShipmentsNew } from '@/@types/form-data';

async function getShipments<T = { data: Shipments[]; items_count: number }>(
  params: (ShipmentsFilter & PageFilter) | (Filter & PageFilter)
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SHIPMENTS, { params });

  return response.data;
}

async function createShipment<T = Shipments>(shipment: ShipmentsNew): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(ApiConstants.CREATE_SHIPMENTS, {
    ...shipment,
  });

  return response.data;
}

async function changeStatus<T = { changeShipmentStatus: boolean }>(
  guid: string,
  status: string | number
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.put(
    ApiConstants.CHANGE_STATUS.replace('{guid}', guid),
    { status_id: status }
  );

  return response.data;
}

export { getShipments, createShipment, changeStatus };
