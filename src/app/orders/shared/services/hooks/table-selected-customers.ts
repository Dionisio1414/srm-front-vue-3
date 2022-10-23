import { ref, watch, Ref, ComputedRef, WritableComputedRef, computed } from 'vue';

import { useRoute } from 'vue-router';
import useOrdersStore from '@/app/orders/shared/store/orders-store';

import type { ListOrder } from '@/@types/order';

interface TableSelectedCustomers {
  selectedCustomers: WritableComputedRef<ListOrder[]>;
  isChecked: Ref<boolean>;
  showActions: ComputedRef<boolean>;
  disabledCheckbox: ComputedRef<boolean>;
  isPlanned: ComputedRef<boolean>;
  checkboxToggleHandler: () => void;
  resetActions: () => void;
}

const tableSelectedCustomers = (): TableSelectedCustomers => {
  const route = useRoute();
  const store = useOrdersStore();

  const isChecked = ref(false);
  const isAllChecked = ref(false);

  const selectedCustomers = computed({
    get() {
      return store.selectedCustomers;
    },

    set(value: ListOrder[]) {
      store.$patch((state) => (state.selectedCustomers = value));
    },
  });
  const showActions = computed(
    () => selectedCustomers.value.length > 1 && route.path === '/planned'
  );
  const disabledCheckbox = computed(() => !!store.planned.length);
  const isPlanned = computed(() => route.path === '/planned');

  const checkboxToggleHandler = () => {
    isChecked.value = !isChecked.value;
    isAllChecked.value = !isAllChecked.value;
  };

  const resetActions = () => {
    isChecked.value = false;
    isAllChecked.value = false;
    store.$patch((state) => (state.selectedCustomers = []));
  };

  if (isPlanned.value) {
    watch(
      () => isChecked.value,
      (checked) => {
        if ((checked && isAllChecked.value) || (checked && !isAllChecked.value)) {
          store.$patch((state) => (state.selectedCustomers = state.planned));
        }

        if (!checked && !isAllChecked.value) {
          store.$patch((state) => (state.selectedCustomers = []));
        }
      },
      { immediate: true }
    );

    watch(
      () => store.selectedCustomers,
      (value) => {
        if (value.length === store.planned.length && store.planned.length) {
          isChecked.value = true;
          isAllChecked.value = true;
        } else {
          isChecked.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      () => isPlanned.value,
      (value) => (!value ? resetActions() : false),
      { immediate: true }
    );
  }

  return {
    selectedCustomers,

    isChecked,
    showActions,
    isPlanned,
    disabledCheckbox,

    checkboxToggleHandler,
    resetActions,
  };
};

export default tableSelectedCustomers;
