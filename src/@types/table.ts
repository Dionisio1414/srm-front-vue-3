interface Sort {
  sortKey?: string | null;
  orderBy?: string | null;
  sort_key?: string | null;
  order?: string | null;
}

interface Filter {
  search?: string | null;
  query?: string | null;
  statusIds?: number[] | null;
  statusType?: 1 | 2 | 3 | '1' | '2' | '3';
  searchDate?: string | null;
  factory?: string[] | number[] | null;
  responsibleIds?: number[] | string[] | null;
  estimatedProductionEndDate?: string | null;
  companyId?: null | string | number;
  categoryCode?: null | string | number;
  is_deleted?: 0 | 1;
}

interface ShipmentsFilter {
  way?: null | number | string;
  statusId?: number | string;
  supplier?: null | number | string | number[] | string[];
  forwarder?: null | number | string;
  loadingTypeId?: null | number | string;
  pointOfLoading?: null | number | string;
  cargoReadyDateBegin?: null | string;
  cargoReadyDateEnd?: null | string;
}

interface PricesFilter {
  forwarderGuids?: null | number[] | string[];
  wayIds?: null | number[] | string[];
  tariffIds?: null | number[] | string[];
  loadingTypeIds?: null | number[] | string[];
  isActive?: 0 | 1 | '0' | '1';
}

interface PageFilter {
  page: number | string;
  perPage?: number | string;
  onPage?: number | string;
  per_page?: number | string;
}

interface TableField {
  title: string;
  name: string;
  default: boolean;
  key?: string;
  sortKey?: string;
}

export type { Sort, Filter, ShipmentsFilter, PricesFilter, PageFilter, TableField };
