import { defineStore } from 'pinia';

import {
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
  getLoadingTypes,
  getShipmentsStatuses,
  getUnitSizes,
  getUnitTypes,
  getUnitTypesSizes,
  getStatusReasons,
  getDeliveryTypes,
  getSupplyStatuses,
  getFeatureFlags,
  getSuppliesOrders,
} from '@/app/shared/services/api/info-api';

import { STATUSES } from '@/app/supplier/shared/config/statuses-constants';
import {
  ACTIVE_PRODUCTIONS_STATUS,
  DRAFT_STATUSES,
  ORDER_STATUSES,
} from '@/app/orders/shared/config/statuses-constants';

import type {
  Company,
  OrderStatus,
  Member,
  Way,
  Country,
  PortItem,
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
  StatusReasons,
  DeliveryPorts,
  SupplyStatus,
  FeatureFlag,
} from '@/@types/additional';
import type { SuppliesOrders } from '@/@types/supplies';

type InfoData =
  | Company
  | Member
  | OrderStatus
  | Way
  | Country
  | Port
  | LoadingType
  | UnitSize
  | UnitType
  | Currency
  | ExpanseField
  | UnitTypeSize
  | Exporter
  | Reason
  | Tariff
  | ShipmentsStatus
  | StatusReasons
  | DeliveryPorts
  | FeatureFlag
  | SuppliesOrders;

interface InfoState {
  statuses: OrderStatus[];
  members: Member[];
  companies: Company[];
  exporters: Exporter[];

  ways: Way[];
  countries: Country[];
  ports: Port[];
  reasons: Reason[];
  statusReasons: StatusReasons[];

  forwarderWays: Way[];
  forwarderReasons: Reason[];
  forwarderTariffs: Tariff[];
  forwarderExpanseFields: ExpanseField[];

  allCountries: Country[];
  currencies: Currency[];

  loadingTypes: LoadingType[];
  shipmentsStatuses: ShipmentsStatus[];
  unitSizes: UnitSize[];
  unitTypes: UnitType[];
  unitTypesSizes: UnitTypeSize[];

  deliveryPorts: DeliveryPorts[];

  supplyStatuses: SupplyStatus[];

  featureFlags: FeatureFlag[];

  suppliesOrders: SuppliesOrders[];
}

const statusesFilter = (statuses: number[], type: number, status: OrderStatus): boolean =>
  statuses.includes(status.id) && status.type === type;

const useInfoStore = defineStore('info', {
  state: () =>
    ({
      statuses: [],
      members: [],
      companies: [],
      exporters: [],

      ways: [],
      countries: [],
      ports: [],
      reasons: [],
      statusReasons: [],

      forwarderWays: [],
      forwarderReasons: [],
      forwarderTariffs: [],
      forwarderExpanseFields: [],

      allCountries: [],
      currencies: [],

      loadingTypes: [],
      shipmentsStatuses: [],
      unitSizes: [],
      unitTypes: [],
      unitTypesSizes: [],

      deliveryPorts: [],

      supplyStatuses: [],

      featureFlags: [],

      suppliesOrders: [],
    } as InfoState),

  getters: {
    supplierStatuses(state) {
      return state.statuses.filter((status) => STATUSES.includes(status.id));
    },

    productionStatuses(state) {
      return state.statuses.filter((status) => ACTIVE_PRODUCTIONS_STATUS.includes(status.id)) || [];
    },

    ordersStatuses(state) {
      return state.statuses.filter(statusesFilter.bind(null, ORDER_STATUSES, 2));
    },

    draftsStatuses(state) {
      return state.statuses.filter(statusesFilter.bind(null, DRAFT_STATUSES, 1));
    },

    wayName(state) {
      return (id: number) => state.ways.find((way) => way.id === id)?.name || '';
    },

    portName(state) {
      const ports = state.ports.reduce((ports, port) => {
        ports.push(...port.ports);

        return ports;
      }, [] as PortItem[]);

      return (id: number) => ports.find((port) => port.id === id)?.name || '';
    },

    loadingTypeName(state) {
      return (id: number) => state.loadingTypes.find((type) => type.id === id)?.type || '';
    },

    forwarderCountries(state) {
      return (id: number) =>
        state.allCountries.find((country) => country.id === id) || ({} as Country);
    },

    deliveryPortsAllowed(state) {
      return (id: number) => state.deliveryPorts.filter((item) => item.delivery_type_id === id);
    },
  },

  actions: {
    async getStatuses() {
      this.statuses = await getStatuses();
    },

    async getCompanies() {
      this.companies = await getCompanies();
    },

    async getMembers() {
      this.members = await getMembers();
    },

    async getExporters() {
      this.exporters = await getExporters();
    },

    async getWays() {
      this.ways = await getWays();
    },

    async getCountries(params?: { way_ids: number[] }) {
      this.countries = await getCountries(params);
    },

    async getPorts(params?: { way_ids: number[]; country_ids: number[] }) {
      this.ports = await getPorts(params);
    },

    async getReasons() {
      this.reasons = await getReasons();
    },

    async getForwarderWays(guid: string) {
      this.forwarderWays = await getForwarderWays(guid);
    },

    async getForwarderReasons() {
      this.forwarderReasons = await getForwarderReasons();
    },

    async getForwarderTariffs() {
      this.forwarderTariffs = await getForwarderTariffs();
    },

    async getForwarderExpanseFields(wayIds: number[] | null) {
      this.forwarderExpanseFields = await getForwarderExpanseFields(wayIds);
    },

    async getAllCountries() {
      this.allCountries = await getAllCountries();
    },

    async getCurrencies() {
      this.currencies = await getCurrencies();
    },

    async getLoadingTypes(wayIds?: number[] | null) {
      this.loadingTypes = await getLoadingTypes(wayIds || null);
    },

    async getShipmentsStatuses() {
      this.shipmentsStatuses = await getShipmentsStatuses();
    },

    async getUnitSizes(wayIds?: number[] | null) {
      this.unitSizes = await getUnitSizes(wayIds || null);
    },

    async getUnitTypes(wayIds?: number[] | null) {
      this.unitTypes = await getUnitTypes(wayIds || null);
    },

    async getUnitTypesSizes(wayIds: number[] | null) {
      this.unitTypesSizes = await getUnitTypesSizes(wayIds);
    },

    async getStatusReasons(statusId: number) {
      this.statusReasons = await getStatusReasons(statusId);
    },

    async getDeliveryPorts() {
      this.deliveryPorts = await getDeliveryTypes();
    },

    async getSupplyStatuses() {
      this.supplyStatuses = await getSupplyStatuses();
    },

    async getFeatureFlags() {
      this.featureFlags = await getFeatureFlags();
    },

    async getSuppliesOrders({ supplyGuids }: { supplyGuids: string[] }) {
      this.suppliesOrders = await getSuppliesOrders(supplyGuids);
    },

    resetData(key: keyof InfoState, data: never) {
      this[key] = data;
    },
  },

  persist: {
    paths: [
      'reasons',
      'allCountries',
      'exporters',
      'countries',
      'ports',
      'ways',
      'loadingTypes',
      'unitSizes',
      'shipmentsStatuses',
      'unitTypes',
    ],
  },
});

export default useInfoStore;
export type { InfoState, InfoData };
