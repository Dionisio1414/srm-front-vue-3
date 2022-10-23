import { FilterMatchMode } from 'primevue/api';

type FiltersConstants = {
  status: { value: null | string; matchMode: string | undefined };
};

const FILTERS_CONSTANTS: FiltersConstants = {
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
};

export { FILTERS_CONSTANTS, FiltersConstants };
