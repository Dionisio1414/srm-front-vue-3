import { computed, ComputedRef, Ref, ref } from 'vue';

import { useRoute } from 'vue-router';

import groupBy from 'lodash.groupby';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { OrderLog, ProductLog, ProductsHistory } from '@/@types/order';

interface GetHistory {
  isLoading: Ref<boolean>;
  changes: ComputedRef<OrderLog[]>;
  productsChanges: ComputedRef<ProductsHistory>;
  formatChangeHistory: (data: ProductLog[]) => ProductsHistory;
  getChangesHistory: (type: 'order' | 'products') => Promise<void>;
}

function getHistory(): GetHistory {
  const route = useRoute();
  const orderStore = useOrderStore();
  const { onError } = useNotification();

  const formatChangeHistory = (data: ProductLog[]): ProductsHistory =>
    groupBy(data, 'product_guid');

  const isLoading = ref(false);
  const changes = computed(() => orderStore.changesHistory);
  const productsChanges = computed(() => formatChangeHistory(orderStore.productsChangesHistory));

  const getChangesHistory = async (type: 'order' | 'products'): Promise<void> => {
    isLoading.value = true;

    const action =
      type === 'order' ? orderStore.getChangesHistory : orderStore.getProductsChangesHistory;

    try {
      await action(route.params.guid as string);
    } catch (error) {
      onError(error as CustomError);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    changes,
    productsChanges,
    formatChangeHistory,
    getChangesHistory,
  };
}

export default getHistory;
