import type { TableField } from '@/@types/table';

const GENERAL_COUNTRIES_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.country',
    name: 'value',
    default: true,
    key: 'name',
  },
];

const GENERAL_EXPORTERS_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'guid',
  },

  {
    title: 'directories.table.exporter',
    name: 'value',
    default: true,
    key: 'name',
  },
];

const FORWARDER_REASONS_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.reason',
    name: 'value',
    default: true,
    key: 'description',
  },
];

const PORT_PORTS_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'countryId',
  },

  {
    title: 'directories.table.countryName',
    name: 'value',
    default: true,
    key: 'countryName',
  },

  {
    title: 'directories.table.port',
    name: 'ports',
    default: true,
    key: 'ports',
  },
];

const PORT_PORTS_INNER_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.port',
    name: 'value',
    default: true,
    key: 'name',
  },
];

const PORT_COUNTRIES_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.country',
    name: 'value',
    default: true,
    key: 'name',
  },
];

const PORT_WAYS_FIELDS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.way',
    name: 'value',
    default: true,
    key: 'name',
  },
];

const SHIPMENTS_LOADING_TYPES: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.loadingType',
    name: 'value',
    default: true,
    key: 'type',
  },
];

const SHIPMENTS_TRANSPORT_UNITS: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.transportUnits',
    name: 'value',
    default: true,
    key: 'type',
  },
];

const SHIPMENTS_SIZES: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.size',
    name: 'value',
    default: true,
    key: 'value',
  },
];

const SHIPMENTS_STATUSES: (TableField & { key: string })[] = [
  {
    title: 'directories.table.id',
    name: 'id',
    default: true,
    key: 'id',
  },

  {
    title: 'directories.table.status',
    name: 'value',
    default: true,
    key: 'alias',
  },
];

const FEATURE_FLAGS_FIELDS: (TableField & { key: string })[] = [
  { title: 'directories.table.feature', name: 'feature', default: true, key: 'feature' },
  {
    title: 'directories.table.description',
    name: 'description',
    default: true,
    key: 'description',
  },
  { title: 'directories.table.active', name: 'active', default: true, key: 'is_enabled' },
];

enum STORAGE_KEYS {
  GENERAL_COUNTRIES_COLUMNS = 'GENERAL_COUNTRIES_COLUMNS',
  GENERAL_EXPORTERS_COLUMNS = 'GENERAL_EXPORTERS_COLUMNS',
  FORWARDER_REASONS_COLUMNS = 'FORWARDER_REASONS_COLUMNS',
  PORT_PORTS_COLUMNS = 'PORT_PORTS_COLUMNS',
  PORT_PORTS_INNER_COLUMNS = 'PORT_PORTS_INNER_COLUMNS',
  PORT_COUNTRIES_COLUMNS = 'PORT_COUNTRIES_COLUMNS',
  PORT_WAYS_COLUMNS = 'PORT_WAYS_COLUMNS',
  SHIPMENTS_LOADING_TYPES_COLUMNS = 'SHIPMENTS_LOADING_TYPES_COLUMNS',
  SHIPMENTS_TRANSPORT_UNITS_COLUMNS = 'SHIPMENTS_TRANSPORT_UNITS_COLUMNS',
  SHIPMENTS_SIZES_COLUMNS = 'SHIPMENTS_SIZES_COLUMNS',
  SHIPMENTS_STATUSES_COLUMNS = 'SHIPMENTS_STATUSES_COLUMNS',
  FEATURE_FLAGS_COLUMNS = 'FEATURE_FLAGS_COLUMNS',
}

export {
  GENERAL_COUNTRIES_FIELDS,
  GENERAL_EXPORTERS_FIELDS,
  FORWARDER_REASONS_FIELDS,
  PORT_PORTS_FIELDS,
  PORT_PORTS_INNER_FIELDS,
  PORT_COUNTRIES_FIELDS,
  PORT_WAYS_FIELDS,
  SHIPMENTS_LOADING_TYPES,
  SHIPMENTS_TRANSPORT_UNITS,
  SHIPMENTS_SIZES,
  SHIPMENTS_STATUSES,
  FEATURE_FLAGS_FIELDS,
  STORAGE_KEYS,
};
