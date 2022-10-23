import { FilterMatchMode } from 'primevue/api';

import type { SupplierShort } from '@/@types/additional';

type FiltersConstants = {
  forwarderGuids: { value: SupplierShort | SupplierShort[] | null; matchMode: string | undefined };
  wayIds: { value: null | number[] | string[]; matchMode: string | undefined };
  tariffIds: { value: null | number[] | string[]; matchMode: string | undefined };
  loadingTypeIds: { value: null | number[] | string[]; matchMode: string | undefined };
  isActive: { value: 0 | 1 | '0' | '1'; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  forwarderGuids: { value: null, matchMode: FilterMatchMode.EQUALS },
  wayIds: { value: null, matchMode: FilterMatchMode.EQUALS },
  tariffIds: { value: null, matchMode: FilterMatchMode.EQUALS },
  loadingTypeIds: { value: null, matchMode: FilterMatchMode.EQUALS },
  isActive: { value: 1, matchMode: FilterMatchMode.EQUALS },
};

export type { FiltersConstants };
export { FILTERS_CONSTANTS };
