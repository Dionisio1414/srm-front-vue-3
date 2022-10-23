import { computed, ComputedRef, ref } from 'vue';

import { useRoute } from 'vue-router';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import type { Order } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

interface OrderLoader {
  order: ComputedRef<Order>;
  isDraft: ComputedRef<boolean>;
  isPlanned: ComputedRef<boolean>;
  isOrder: ComputedRef<boolean>;

  getInfo: () => Promise<void>;
  getOrder: () => Promise<void>;
  getProducts: () => Promise<void>;
}

function orderLoader(errorCallback: (error: CustomError) => void): OrderLoader {
  const route = useRoute();
  const orderStore = useOrderStore();
  const { onCustomError } = useNotification();

  const infoLoaded = ref(false);

  const order = computed(() => orderStore.order);
  const factoryGuid = computed(() => orderStore.factoryGuid);
  const isDraft = computed(() => orderStore.isDraftOrder);
  const isPlanned = computed(() => orderStore.isPlannedOrder);
  const isOrder = computed(() => orderStore.isOrder);

  const getInfo = async () => {
    await orderStore
      .getInfo(route.params.guid as string, factoryGuid.value)
      .then(() => {
        infoLoaded.value = true;
      })
      .catch((error) => onCustomError(error));
  };

  const getOrder = async () => {
    await orderStore
      .getOrder(route.params.guid as string)
      .catch((error) => onCustomError(error, errorCallback));

    if (!infoLoaded.value) {
      getInfo();
    }
  };

  const getProducts = async () => {
    await orderStore
      .getProducts(route.params.guid as string)
      .catch(() => onCustomError({} as CustomError));
  };

  orderStore.resetData();

  return {
    order,
    isDraft,
    isPlanned,
    isOrder,
    getInfo,
    getOrder,
    getProducts,
  };
}

export default orderLoader;
