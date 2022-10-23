import type { TableField } from '@/@types/table';

const FORWARDERS_FIELDS: TableField[] = [
  { title: 'forwarder.table.name', name: 'name', default: true },
  { title: 'forwarder.table.legalAddress', name: 'legal_address', default: true },
  { title: 'forwarder.table.countries', name: 'service.countries', default: true },
  { title: 'forwarder.table.ports', name: 'service.point_of_loading', default: true },
  { title: 'forwarder.table.ways', name: 'service.ways', default: true },
  { title: 'forwarder.table.phone', name: 'phone', default: true },
  { title: 'forwarder.table.deletedAt', name: 'deleted', default: true, key: 'deleted_at' },
];

const STORAGE_KEY = 'FORWARDERS_COLUMNS';

export { FORWARDERS_FIELDS, STORAGE_KEY };
