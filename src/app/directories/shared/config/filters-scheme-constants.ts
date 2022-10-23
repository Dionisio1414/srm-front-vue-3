import { FilterMatchMode } from 'primevue/api';

type FiltersConstants = {
  global: { value: null | string; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export type { FiltersConstants };

export { FILTERS_CONSTANTS };
