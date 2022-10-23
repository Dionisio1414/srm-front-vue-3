import { FilterMatchMode } from 'primevue/api';

import type { OrderStatus, SupplierShort } from '@/@types/additional';
import type { SupplyStatus } from '@/@types/supply';

type FiltersConstants = {
  proformaInvoiceDate: { value: null | string; matchMode: string | undefined };
  estimatedProductionEndDate: { value: null | string; matchMode: string | undefined };
  status: { value: null | OrderStatus[]; matchMode: string | undefined };
  company: { value: null | string | number; matchMode: string | undefined };
  category: { value: SupplierShort | null; matchMode: string | undefined };
  responsible: { value: null | string[] | number[]; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  proformaInvoiceDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  estimatedProductionEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  company: { value: null, matchMode: FilterMatchMode.EQUALS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
  responsible: { value: null, matchMode: FilterMatchMode.EQUALS },
};

type SupplierInnerFiltersConstants = {
  global: { value: null | string; matchMode: string | undefined };
  'categoryName.en': { value: null | string; matchMode: string | undefined };
  'brand.name': { value: null | string; matchMode: string | undefined };
};

const SUPPLIER_INNER_FILTERS_CONSTANTS: SupplierInnerFiltersConstants = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'categoryName.en': { value: null, matchMode: FilterMatchMode.IN },
  'brand.name': { value: null, matchMode: FilterMatchMode.IN },
};

type SupplierSuppliesFiltersConstants = {
  status: { value: null | SupplyStatus[]; matchMode: string | undefined };
};

const SUPPLIER_SUPPLIES_FILTERS_CONSTANTS = {
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
};

export type { FiltersConstants, SupplierInnerFiltersConstants, SupplierSuppliesFiltersConstants };
export { FILTERS_CONSTANTS, SUPPLIER_INNER_FILTERS_CONSTANTS, SUPPLIER_SUPPLIES_FILTERS_CONSTANTS };
