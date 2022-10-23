import type { TableField } from '@/@types/table';

const SUPPLY_PRODUCTS_FIELDS: TableField[] = [
  { title: 'supplies.articlesListTable.order', name: 'orderNumber', default: true },
  { title: 'supplies.articlesListTable.article', name: 'articleId', default: true },
  { title: 'supplies.articlesListTable.description', name: 'articleNo', default: true },
  { title: 'supplies.articlesListTable.category', name: 'genericArticleId', default: true },
  { title: 'supplies.articlesListTable.amount', name: 'amount', default: true },
  { title: 'supplies.articlesListTable.unitPrice', name: 'unitPriceUsd', default: true },
  { title: 'supplies.articlesListTable.fid', name: 'fid', default: true },
  { title: 'supplies.articlesListTable.moq', name: 'minimalOrderQuantity', default: true },
];

enum STORAGE_KEYS {
  SUPPLY_PRODUCTS_COLUMNS = 'SUPPLY_PRODUCTS_COLUMNS',
}

export { SUPPLY_PRODUCTS_FIELDS, STORAGE_KEYS };
