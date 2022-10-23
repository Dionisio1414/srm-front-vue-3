import { computed } from 'vue';

import cloneDeep from 'lodash.clonedeep';

import useTablesStore from '@/app/shared/store/tables-store';
import useInfoStore from '@/app/shared/store/info-store';

import { ACTIVE_PRODUCTIONS_STATUS } from '@/app/orders/shared/config/statuses-constants';

interface ProductionStatus {
  setDefaultStatus: () => void;
}

function productionStatus(key: 'supplier' | 'orders' | 'drafts' | 'planned'): ProductionStatus {
  const tablesStore = useTablesStore();
  const infoStore = useInfoStore();

  const statuses = computed(() => tablesStore[key].filters.statusIds || []);
  const scheme = cloneDeep(tablesStore[key].scheme);

  const setDefaultStatus = () => {
    if (!statuses.value.length && key !== 'drafts' && key !== 'planned') {
      scheme.status.value = infoStore.productionStatuses;

      tablesStore.setFilters(key, {
        ...tablesStore[key].filters,
        statusIds: ACTIVE_PRODUCTIONS_STATUS,
      });

      tablesStore.setScheme(key, scheme as never);
    }
  };

  return { setDefaultStatus };
}

export default productionStatus;
