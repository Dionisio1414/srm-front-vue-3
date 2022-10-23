import type { TableField } from '@/@types/table';

const SHIPMENTS_FIELDS: TableField[] = [
  { title: 'shipments.table.ways', name: 'way', default: true },
  { title: 'shipments.table.supplier', name: 'supplier', default: true },
  { title: 'shipments.table.forwarder', name: 'forwarder', default: true },
  { title: 'shipments.table.incoterm', name: 'shipmentLoadingType', default: true },
  { title: 'shipments.table.ports', name: 'pointOfLoading', default: true },
  { title: 'shipments.table.weight', name: 'weight', default: true },
  { title: 'shipments.table.volume', name: 'volume', default: true },
  {
    title: 'shipments.table.tu',
    name: 'tu',
    default: true,
    key: 'transportUnits',
  },
  {
    title: 'shipments.table.size',
    name: 'size',
    default: true,
    key: 'transportUnits',
  },
  {
    title: 'shipments.table.amount',
    name: 'amount',
    default: true,
    key: 'transportUnits',
  },
  { title: 'shipments.table.crd', name: 'cargoReadyDate', default: true },
];

const STORAGE_KEY = 'SHIPMENTS_COLUMNS';

export { SHIPMENTS_FIELDS, STORAGE_KEY };
