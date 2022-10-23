import type { TableField } from '@/@types/table';

const ORDERS_FIELDS: TableField[] = [
  { title: 'orders.table.supplier', name: 'factory.name', default: true },
  { title: 'orders.table.order', name: 'orderNumber', default: true },
  { title: 'orders.table.piNumber', name: 'proformaInvoiceNumber', default: false },
  { title: 'orders.table.piDate', name: 'proformaInvoiceDate', default: false },
  { title: 'orders.table.responsible', name: 'responsible.name', default: true },
  { title: 'orders.table.company', name: 'company.name', default: false },
  { title: 'orders.table.eped', name: 'estimatedProductionEndDate', default: false },
  { title: 'orders.table.category', name: 'category', default: false },
  { title: 'orders.table.articles', name: 'articles', default: true },
  { title: 'orders.table.pieces', name: 'pieces', default: false },
  { title: 'orders.table.ready', name: 'orderExecution', default: false },
  { title: 'orders.table.sum', name: 'total.usd', default: false },
  { title: 'orders.table.status', name: 'status.id', default: true },
];

const DRAFTS_FIELDS: TableField[] = [
  { title: 'orders.table.supplier', name: 'factory.name', default: true },
  { title: 'orders.table.order', name: 'orderNumber', default: true },
  { title: 'orders.table.piNumber', name: 'proformaInvoiceNumber', default: false },
  { title: 'orders.table.piDate', name: 'proformaInvoiceDate', default: false },
  { title: 'orders.table.created', name: 'createdAt', default: false },
  { title: 'orders.table.responsible', name: 'responsible.name', default: true },
  { title: 'orders.table.sum', name: 'total.usd', default: false },
  { title: 'orders.table.status', name: 'status.id', default: true },
];

const PLANNED_FIELDS: TableField[] = [
  { title: 'orders.table.supplier', name: 'factory.name', default: true },
  { title: 'orders.table.order', name: 'orderNumber', default: true },
  { title: 'orders.table.piNumber', name: 'proformaInvoiceNumber', default: false },
  { title: 'orders.table.piDate', name: 'proformaInvoiceDate', default: false },
  { title: 'orders.table.created', name: 'createdAt', default: false },
  { title: 'orders.table.responsible', name: 'responsible.name', default: true },
  { title: 'orders.table.sum', name: 'total.usd', default: false },
];

enum STORAGE_KEYS {
  ORDERS_COLUMNS = 'ORDERS_COLUMNS',
  DRAFTS_COLUMNS = 'DRAFTS_COLUMNS',
  PLANNED_COLUMNS = 'PLANNED_COLUMNS',
}

export { ORDERS_FIELDS, DRAFTS_FIELDS, PLANNED_FIELDS, STORAGE_KEYS };
