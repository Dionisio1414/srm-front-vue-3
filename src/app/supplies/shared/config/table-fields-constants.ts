import type { TableField } from '@/@types/table';

const SUPPLIES_FIELDS: TableField[] = [
  {
    title: 'supplies.suppliesTable.supply',
    name: 'supplyNumber',
    default: true,
    sortKey: 'number',
  },
  {
    title: 'supplies.suppliesTable.supplier',
    name: 'factory.jurName',
    default: true,
    sortKey: 'supplier',
  },
  {
    title: 'supplies.suppliesTable.crd',
    name: 'cargoReadyDate',
    default: true,
    sortKey: 'cargo_ready_date',
  },
  {
    title: 'supplies.suppliesTable.creationDate',
    name: 'createdAt',
    default: true,
    sortKey: 'created_at',
  },
  {
    title: 'supplies.suppliesTable.totalQty',
    name: 'total.amount',
    default: true,
    sortKey: 'total_amount',
  },
  {
    title: 'supplies.suppliesTable.totalSku',
    name: 'totalSku',
    default: true,
    sortKey: 'total_sku',
  },
  {
    title: 'supplies.suppliesTable.indicators',
    name: 'files',
    default: true,
    sortKey: 'files',
  },
  {
    title: 'supplies.suppliesTable.ordersSrm',
    name: 'orderNumbers',
    default: true,
    sortKey: 'orders_numbers',
  },
  {
    title: 'supplies.suppliesTable.status',
    name: 'status',
    default: true,
    sortKey: 'status_id',
  },
];

enum STORAGE_KEYS {
  SUPPLIES_COLUMNS = 'SUPPLIES_COLUMNS',
}

export { SUPPLIES_FIELDS, STORAGE_KEYS };
