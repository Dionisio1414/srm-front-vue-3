import type { TableField } from '@/@types/table';

const SUPPLIER_FIELDS: TableField[] = [
  { title: 'supplier.table.order', name: 'orderNumber', default: true },
  { title: 'supplier.table.piNumber', name: 'proformaInvoiceNumber', default: false },
  { title: 'supplier.table.piDate', name: 'proformaInvoiceDate', default: false },
  { title: 'supplier.table.created', name: 'createdAt', default: false },
  { title: 'supplier.table.responsible', name: 'responsible.name', default: false },
  { title: 'supplier.table.company', name: 'company.name', default: false },
  { title: 'supplier.table.eped', name: 'estimatedProductionEndDate', default: false },
  { title: 'supplier.table.category', name: 'category', default: false },
  { title: 'supplier.table.articles', name: 'articles', default: true },
  { title: 'supplier.table.pieces', name: 'pieces', default: false },
  // { title: 'supplier.table.ready', name: 'orderExecution', default: false },
  { title: 'supplier.table.sum', name: 'total.usd', default: false },
  { title: 'supplier.table.status', name: 'status.id', default: true },
];

const SUPPLIER_INNER_FIELDS: TableField[] = [
  { title: 'supplier.innerTable.nr', name: 'id', default: false },
  { title: 'supplier.innerTable.description', name: 'categoryName.en', default: true },
  { title: 'supplier.innerTable.comment', name: 'comment', default: false },
  { title: 'supplier.innerTable.category', name: 'categoryCode', default: false },
  { title: 'supplier.innerTable.brand', name: 'brand.name', default: true },
  { title: 'supplier.innerTable.articleNr', name: 'article.no', default: true },
  { title: 'supplier.innerTable.fid', name: 'fid', default: false },
  { title: 'supplier.innerTable.qty', name: 'quantity', default: true },
  { title: 'supplier.innerTable.priceUsd', name: 'price.usd', default: true },
  { title: 'supplier.innerTable.priceEur', name: 'price.eur', default: true },
  { title: 'supplier.innerTable.amount', name: 'price.total_usd', default: false },
  { title: 'supplier.innerTable.moq', name: 'minimalOrderQuantity', default: false },
  { title: 'supplier.innerTable.oem', name: 'article.oe', default: false },
  { title: 'supplier.innerTable.emn', name: 'emarkNumber', default: false },
  { title: 'supplier.innerTable.ec', name: 'emarkCountry', default: false },
  { title: 'supplier.innerTable.pcs', name: 'pcsInBox', default: false },
];

const SUPPLIER_SHIPMENTS_FIELDS: TableField[] = [
  { title: 'shipments.table.ways', name: 'wayIds', default: true },
  { title: 'shipments.table.status', name: 'status.alias', default: true },
  { title: 'shipments.table.forwarder', name: 'forwarder.name', default: true },
  { title: 'shipments.table.incoterm', name: 'shipmentLoadingType.type', default: true },
  { title: 'shipments.table.ports', name: 'pointOfLoading', default: true },
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

const SUPPLIER_SWH_FIELDS: TableField[] = [
  { title: 'supplier.swhTable.order', name: 'order_number', default: true },
  { title: 'supplier.swhTable.article', name: 'article_id', default: true },
  { title: 'supplier.swhTable.description', name: 'article_no', default: true },
  { title: 'supplier.swhTable.category', name: 'category_name.name_en', default: true },
  { title: 'supplier.swhTable.amount', name: 'quantity', default: true },
  { title: 'supplier.swhTable.price', name: 'price.price_usd', default: true },
  { title: 'supplier.swhTable.moq', name: 'moq', default: true },
  { title: 'supplier.swhTable.qty', name: 'all_quantity', default: true },
];

const SUPPLIER_SUPPLIES_FIELDS: TableField[] = [
  {
    title: 'supplier.suppliesTable.supply',
    name: 'supplyNumber',
    default: true,
    sortKey: 'number',
  },
  {
    title: 'supplier.suppliesTable.crd',
    name: 'cargoReadyDate',
    default: true,
    sortKey: 'cargo_ready_date',
  },
  {
    title: 'supplier.suppliesTable.files',
    name: 'files',
    default: true,
    sortKey: 'files',
  },
  {
    title: 'supplier.suppliesTable.price',
    name: 'total.usd',
    default: true,
    sortKey: 'total_price_usd',
  },
  {
    title: 'supplier.suppliesTable.amount',
    name: 'total.amount',
    default: true,
    sortKey: 'total_amount',
  },
  {
    title: 'supplier.suppliesTable.ordersSrm',
    name: 'orderNumbers',
    default: true,
    sortKey: 'orders_numbers',
  },
  {
    title: 'supplier.suppliesTable.status',
    name: 'status',
    default: true,
    sortKey: 'status_id',
  },
];

enum STORAGE_KEYS {
  SUPPLIER_COLUMNS = 'SUPPLIER_COLUMNS',
  SUPPLIER_INNER_COLUMNS = 'SUPPLIER_INNER_COLUMNS',
  SHIPMENTS_COLUMNS = 'SHIPMENTS_COLUMNS',
  SUPPLIER_SWH_COLUMNS = 'SUPPLIER_SWH_COLUMNS',
  SUPPLIER_SUPPLIES_COLUMNS = 'SUPPLIER_SUPPLIES_COLUMNS',
}

export {
  SUPPLIER_FIELDS,
  SUPPLIER_INNER_FIELDS,
  SUPPLIER_SHIPMENTS_FIELDS,
  SUPPLIER_SWH_FIELDS,
  SUPPLIER_SUPPLIES_FIELDS,
  STORAGE_KEYS,
};
