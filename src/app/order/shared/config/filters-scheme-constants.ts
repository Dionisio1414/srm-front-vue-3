import { FilterMatchMode } from 'primevue/api';

type FiltersConstants = {
  global: { value: null | string; matchMode: string | undefined };
  'categoryName.en': { value: null | string; matchMode: string | undefined };
  'brand.name': { value: null | string; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'categoryName.en': { value: null, matchMode: FilterMatchMode.IN },
  'brand.name': { value: null, matchMode: FilterMatchMode.IN },
};

export type { FiltersConstants };

export { FILTERS_CONSTANTS };
