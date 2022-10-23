import { AxiosResponse } from 'axios';

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/shared/config/info-api-constants';

import type {
  Company,
  OrderStatus,
  Member,
  Way,
  Country,
  Port,
  LoadingType,
  UnitSize,
  ExpanseField,
  Currency,
  UnitTypeSize,
  UnitType,
  Exporter,
  Reason,
  Tariff,
  ShipmentsStatus,
  Incoterm,
  SupplyStatus,
  FeatureFlag,
  FeatureFlagsParams,
  DeliveryPorts,
} from '@/@types/additional';
import type { SuppliesOrders } from '@/@types/supplies';

async function getStatuses<T = OrderStatus[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_STATUSES);

  return response.data;
}

async function getCompanies<T = Company[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_COMPANIES);

  return response.data;
}

async function getMembers<T = Member[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_MEMBERS);

  return response.data;
}

async function getExporters<T = Exporter[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_EXPORTERS);

  return response.data;
}

async function getWays<T = Way[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_WAYS);

  return response.data;
}

async function getCountries<T = Country[]>(params?: { way_ids: number[] }): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_COUNTRIES, { params });

  return response.data;
}

async function getPorts<T = Port[]>(params?: {
  way_ids: number[];
  country_ids: number[];
}): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_PORTS, { params });

  return response.data;
}

async function getReasons<T = Reason[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_REASONS);

  return response.data;
}

async function getForwarderWays<T = Way[]>(guid: string): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FORWARDER_WAYS.replace('{guid}', guid)
  );

  return response.data;
}

async function getForwarderReasons<T = Reason[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_FORWARDER_REASONS);

  return response.data;
}

async function getForwarderTariffs<T = Tariff[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_FORWARDER_TARIFFS);

  return response.data;
}

async function getForwarderExpanseFields<T = ExpanseField[]>(wayIds: number[] | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_FORWARDER_EXPANSE_FIELDS,
    { params: { way_ids: wayIds } }
  );

  return response.data;
}

async function getAllCountries<T = Country[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_ALL_COUNTRIES);

  return response.data;
}

async function getCurrencies<T = Currency[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_CURRENCIES);

  return response.data;
}

async function getIncoterms<T = Incoterm[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_INCOTERMS);

  return response.data;
}

async function getLoadingTypes<T = LoadingType[]>(wayIds: number[] | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_SHIPMENTS_LOADING_TYPES,
    { params: { wayIds } }
  );

  return response.data;
}

async function getShipmentsStatuses<T = ShipmentsStatus[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SHIPMENTS_STATUSES);

  return response.data;
}

async function getUnitSizes<T = UnitSize[]>(wayIds: number[] | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_DICTIONARY_SIZES, {
    params: { wayIds },
  });

  return response.data;
}

async function getUnitTypes<T = UnitType[]>(wayIds: number[] | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_DICTIONARY_UNIT_TYPES, {
    params: { wayIds },
  });

  return response.data;
}

async function getUnitTypesSizes<T = UnitTypeSize[]>(wayIds: number[] | null): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(
    ApiConstants.GET_DICTIONARY_UNIT_TYPES_SIZES,
    { params: { way_ids: wayIds } }
  );

  return response.data;
}

async function getStatusReasons<T = { message: string; success: true }>(
  statusId: number | string
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_STATUS_REASONS, {
    params: { status_id: statusId },
  });

  return response.data;
}

async function getDeliveryTypes<T = DeliveryPorts[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_DELIVERY_PORTS);

  return response.data;
}

async function getSupplyStatuses<T = SupplyStatus[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SUPPLY_STATUSES);

  return response.data;
}

async function getFeatureFlags<T = FeatureFlag[]>(): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_FEATURE_FLAGS);

  return response.data;
}

async function changeFeatureStatus<T = FeatureFlag>(params: FeatureFlagsParams): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post(
    ApiConstants.CHANGE_FEATURE_STATUS,
    params
  );

  return response.data;
}

async function getSuppliesOrders<T = SuppliesOrders[]>(
  supplyGuids: Array<string | null> = []
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get(ApiConstants.GET_SUPPLIES_ORDERS, {
    params: { supplyGuids },
  });

  return Promise.resolve(response.data);
}

export {
  getStatuses,
  getCompanies,
  getMembers,
  getExporters,
  getWays,
  getCountries,
  getPorts,
  getReasons,
  getForwarderWays,
  getForwarderReasons,
  getForwarderTariffs,
  getForwarderExpanseFields,
  getAllCountries,
  getCurrencies,
  getIncoterms,
  getLoadingTypes,
  getShipmentsStatuses,
  getUnitSizes,
  getUnitTypes,
  getUnitTypesSizes,
  getStatusReasons,
  getDeliveryTypes,
  getSupplyStatuses,
  getFeatureFlags,
  changeFeatureStatus,
  getSuppliesOrders,
};
