import { Ref, computed, ComputedRef } from 'vue';

type Filters = Ref<{ [key: string]: { value: unknown } }>;

interface TableClearFilters {
  updatedFilter: ComputedRef<(filters: Filters) => boolean>;
}

function staticTableClearFilters(): TableClearFilters {
  const updatedFilter = computed(
    () => (filters: Filters) => !!Object.values(filters).some((item: Filters) => item.value)
  );

  return { updatedFilter };
}

export default staticTableClearFilters;
