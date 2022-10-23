import { ref, watch, Ref } from 'vue';

import cloneDeep from 'lodash.clonedeep';
import debounce from 'lodash.debounce';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import type { ItemState } from '@/app/shared/store/tables-store';
import type { Filter, ShipmentsFilter, PricesFilter, Sort } from '@/@types/table';
import type { SupplierShort } from '@/@types/additional';

type FiltersScheme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: { value: any; matchMode: string | undefined };
};
type OnFilterPayload = { filters: FiltersScheme };

type SchemeCallback = ((payload: FiltersScheme) => void) | undefined;
type SortCallback = ((payload: Sort) => void) | undefined;
type FilterCallback = ((payload: Filter & ShipmentsFilter & PricesFilter) => void) | undefined;
type PageCallback = ((payload: { page: number; perPage: number }) => void) | undefined;

type Callbacks = [SchemeCallback, SortCallback, FilterCallback, PageCallback, FilterCallback];

function formatSchemeDate(scheme: FiltersScheme) {
  const clone = cloneDeep(scheme);

  Object.entries(clone).forEach(([key, data]) => {
    const { value } = data;

    if (key.toLowerCase().includes('date')) {
      if (typeof value === 'string') clone[key].value = new Date(value);
      if (Array.isArray(value)) {
        clone[key].value = value.map((date) => (date ? new Date(date) : date));
      }
    }
  });

  return clone;
}
interface TableFilters {
  filters: Ref<FiltersScheme>;
  searchString: Ref<string>;

  onSort: ($event: { sortField: string; sortOrder: number }) => void;
  onFilter: ($event: OnFilterPayload) => void;
  onPageChange: ($event: { page: number; rows: number }) => void;
  onSearch: (searchString: string, immediately?: boolean) => void;
}

function tableFilters(filtersState: ItemState, callbacks: Callbacks): TableFilters {
  const [schemeCallback, sortCallback, filterCallback, pageCallback, searchCallback] = callbacks;

  const filters = ref(formatSchemeDate(filtersState.scheme));
  const searchString = ref(filtersState.filters.search || '');

  const onSort = ({
    sortField,
    sortOrder,
  }: {
    sortField: string | null;
    sortOrder: number | null;
  }): void => {
    const orderBy: string | null = sortOrder === null ? null : sortOrder === 1 ? 'desc' : 'asc';
    if (sortCallback) sortCallback({ sortKey: sortField, orderBy });
  };

  const onFilter = ({ filters }: OnFilterPayload): void => {
    const storeFilters = cloneDeep(filtersState.filters);

    if (filters.proformaInvoiceDate && storeFilters) {
      if (filters.proformaInvoiceDate.value) {
        const [start, end] = filters.proformaInvoiceDate.value;
        const searchDate = `${formatDate(start)} to ${end ? formatDate(end) : formatDate(start)}`;

        storeFilters.searchDate = searchDate;
      } else {
        storeFilters.searchDate = null;
      }
    }

    if (filters.status) {
      const ids: number[] = filters.status?.value?.map?.((item: { id: number }) => item.id) || [];
      storeFilters.statusIds = cloneDeep(ids);
    }

    if (filters.way) {
      storeFilters.way = filters.way?.value ? filters.way?.value : null;
    }

    if (filters.supplier) {
      storeFilters.supplier = filters.supplier?.value ? filters.supplier.value.value : null;
    }

    if (filters.forwarder) {
      storeFilters.forwarder = filters.forwarder?.value ? filters.forwarder.value.value : null;
    }

    if (filters.shipmentLoadingType) {
      storeFilters.loadingTypeId = filters.shipmentLoadingType?.value
        ? filters.shipmentLoadingType.value
        : null;
    }

    if (filters.pointOfLoading) {
      storeFilters.pointOfLoading = filters.pointOfLoading?.value
        ? filters.pointOfLoading?.value
        : null;
    }

    if (filters.cargoReadyDate) {
      const [start, end] = filters.cargoReadyDate.value || [];
      const startDate = start ? formatDate(start) : null;
      const endDate = end ? formatDate(end) : null;

      storeFilters.cargoReadyDateBegin = startDate;
      storeFilters.cargoReadyDateEnd = endDate;
    }

    if (filters.factory) {
      const isArray = Array.isArray(filters.factory?.value);
      let value;

      if (isArray && filters.factory?.value !== null) {
        value = filters.factory?.value.length
          ? filters.factory.value.map((item: SupplierShort): string => item.value)
          : null;
      } else {
        value = filters.factory?.value ? [filters.factory.value.value] : null;
      }

      storeFilters.factory = value;
    }

    if (filters.responsible) {
      storeFilters.responsibleIds = filters.responsible?.value || [];
    }

    if (filters.estimatedProductionEndDate) {
      if (filters.estimatedProductionEndDate.value) {
        const [start, end] = filters.estimatedProductionEndDate.value;
        const searchDate = `${formatDate(start)} to ${end ? formatDate(end) : formatDate(start)}`;

        storeFilters.estimatedProductionEndDate = searchDate;
      } else {
        storeFilters.estimatedProductionEndDate = null;
      }
    }

    if (filters.company) {
      storeFilters.companyId = filters.company?.value ? filters.company?.value : null;
    }

    if (filters.category) {
      storeFilters.categoryCode = filters.category?.value ? filters.category.value.label : null;
    }

    if (filters.forwarderGuids) {
      storeFilters.forwarderGuids = filters.forwarderGuids?.value
        ? filters.forwarderGuids.value.map((item: SupplierShort): string => item.value)
        : null;
    }

    if (filters.wayIds) {
      storeFilters.wayIds = filters.wayIds?.value ? filters.wayIds.value : null;
    }

    if (filters.tariffIds) {
      storeFilters.tariffIds = filters.tariffIds?.value ? filters.tariffIds.value : null;
    }

    if (filters.loadingTypeIds) {
      storeFilters.loadingTypeIds = filters.loadingTypeIds?.value
        ? filters.loadingTypeIds.value
        : null;
    }

    if (filters.isActive) {
      storeFilters.isActive = filters.isActive.value;
    }

    if (filterCallback) filterCallback(storeFilters);
  };

  const onPageChange = ({ page, rows }: { page: number; rows: number }): void => {
    const payload = { page: page + 1, perPage: rows };

    if (pageCallback) pageCallback(payload);
  };

  const onSearch = debounce((value: string, immediately = false): void => {
    const storeFilters = cloneDeep(filtersState.filters);

    storeFilters.search = value.trim();
    searchString.value = value.trim();

    if (searchCallback) {
      if (immediately) {
        searchCallback(storeFilters);
      } else if (!immediately && (searchString.value.length > 2 || searchString.value === '')) {
        searchCallback(storeFilters);
      }
    }
  }, 700);

  watch(
    () => filters.value,
    (filters) => {
      if (schemeCallback) {
        schemeCallback(filters);
      }
    },
    { deep: true }
  );

  return {
    filters,
    searchString,
    onSort,
    onFilter,
    onPageChange,
    onSearch,
  };
}

export type { Callbacks, FiltersScheme };
export default tableFilters;
