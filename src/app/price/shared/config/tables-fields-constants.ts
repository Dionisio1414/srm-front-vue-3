import type { TableField } from '@/@types/table';

const PRICES_FIELDS: TableField[] = [
  { title: 'price.table.forwarder', name: 'forwarder.guid', default: true },
  { title: 'price.table.ways', name: 'ways', default: true },
  { title: 'price.table.tariff', name: 'tariff.id', default: true },
  { title: 'price.table.active', name: 'is_active', default: true },
  { title: 'price.table.relevantDates', name: 'relevant_date_from', default: true },
];

const STORAGE_KEYS = 'PRICES_COLUMNS';

export { PRICES_FIELDS, STORAGE_KEYS };
