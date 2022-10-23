import { ref, computed, Ref, ComputedRef } from 'vue';

import useInfoStore from '@/app/shared/store/info-store';
import useNotifications from '@/app/shared/services/hooks/notifications';

import type { InfoState, InfoData } from '@/app/shared/store/info-store';

type GetData<T> = {
  isLoading: Ref<boolean>;
  data: ComputedRef<InfoData[]>;
  getData: (params?: T) => void;
};

function getData<T>(key: keyof InfoState, callback: (params?: T) => Promise<void>): GetData<T> {
  const infoStore = useInfoStore();
  const { onCustomError } = useNotifications();

  const isLoading = ref(false);
  const data = computed(() => infoStore[key]);

  const getData = (params?: T) => {
    isLoading.value = Boolean(!data.value.length);

    (params ? callback(params) : callback())
      .catch((error) => onCustomError(error))
      .finally(() => {
        isLoading.value = false;
      });
  };

  return {
    isLoading,
    data,
    getData,
  };
}

export type { GetData };
export default getData;
