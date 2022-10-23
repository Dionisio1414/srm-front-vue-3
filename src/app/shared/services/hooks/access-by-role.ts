import { computed, Ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import useLoginStore from '@/app/login/shared/store/login-store';
import useNotFound from '@/app/shared/services/hooks/not-found';

import {
  ERROR_STATUSES,
  ORDER_PAGES,
  CLEAR_FILTERS_PAGES,
} from '@/app/shared/config/access-by-role';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

interface AccessByRole {
  modalVisibility: Ref<boolean>;
  errorCallback: (error: CustomError) => void;
}

function accessByRole(clearFilter?: () => void): AccessByRole {
  const route = useRoute();
  const router = useRouter();
  const loginStore = useLoginStore();
  const { modalVisibility, notFoundHandler } = useNotFound();

  const pageType = computed(() => route.name);

  const errorCallback = (error: CustomError) => {
    const status = error?.response?.status;

    if (ERROR_STATUSES.includes(status)) {
      if (!loginStore.userHasRole('logistics_manager')) router.push({ name: 'orders-list' });
      else router.push({ name: 'forwarders' });
    } else {
      if (ORDER_PAGES.includes(pageType.value as string)) notFoundHandler();
      else if (CLEAR_FILTERS_PAGES.includes(pageType.value as string) && clearFilter) clearFilter();
    }
  };

  return { modalVisibility, errorCallback };
}

export default accessByRole;
