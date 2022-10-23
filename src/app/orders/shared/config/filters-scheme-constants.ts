import { FilterMatchMode } from 'primevue/api';

import type { OrderStatus, SupplierShort } from '@/@types/additional';

type FiltersConstants = {
  proformaInvoiceDate: { value: null | string; matchMode: string | undefined };
  estimatedProductionEndDate: { value: null | string; matchMode: string | undefined };
  factory: { value: SupplierShort | SupplierShort[] | null; matchMode: string | undefined };
  responsible: { value: null | string[] | number[]; matchMode: string | undefined };
  status: { value: null | OrderStatus[]; matchMode: string | undefined };
  company: { value: null | string | number; matchMode: string | undefined };
  category: { value: SupplierShort | null; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  proformaInvoiceDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  estimatedProductionEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  factory: { value: null, matchMode: FilterMatchMode.EQUALS },
  responsible: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  company: { value: null, matchMode: FilterMatchMode.EQUALS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS },
};

export { FILTERS_CONSTANTS, FiltersConstants };
