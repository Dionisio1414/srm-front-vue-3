import { FilterMatchMode } from 'primevue/api';

import type { SupplierShort } from '@/@types/additional';

type FiltersConstants = {
  way: { value: null | number | string; matchMode: string | undefined };
  supplier: { value: SupplierShort | SupplierShort[] | null; matchMode: string | undefined };
  forwarder: { value: SupplierShort | SupplierShort[] | null; matchMode: string | undefined };
  shipmentLoadingType: { value: null | number | string; matchMode: string | undefined };
  pointOfLoading: { value: null | number | string; matchMode: string | undefined };
  cargoReadyDate: { value: null | number | string; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  way: { value: null, matchMode: FilterMatchMode.EQUALS },
  supplier: { value: null, matchMode: FilterMatchMode.EQUALS },
  forwarder: { value: null, matchMode: FilterMatchMode.EQUALS },
  shipmentLoadingType: { value: null, matchMode: FilterMatchMode.EQUALS },
  pointOfLoading: { value: null, matchMode: FilterMatchMode.EQUALS },
  cargoReadyDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
};

export type { FiltersConstants };
export { FILTERS_CONSTANTS };
