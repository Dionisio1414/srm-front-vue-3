import { computed, ComputedRef } from 'vue';
import uniq from 'lodash.uniq';

import { useRouter } from 'vue-router';

import useLoginStore from '@/app/login/shared/store/login-store';

function getName(history: string[]): string | undefined {
  const uniqHistory: string[] = uniq(history);
  const index = uniqHistory.lastIndexOf('/login');

  if (index > -1 && uniqHistory[index - 1]) {
    return uniqHistory[index - 1];
  }

  return undefined;
}

interface UseRedirect {
  isLoading: ComputedRef<boolean>;
  callback: () => void;
}

function useRedirect(): UseRedirect {
  const loginStore = useLoginStore();
  const router = useRouter();

  const history = computed(() => loginStore.routeHistory);
  const isLoading = computed(() => loginStore.isLoading);
  const isLogistics = computed(() => loginStore.user.login === 'logistics');

  const callback = async () => {
    const path = getName(history.value);

    if (path) {
      await router.push({ path });
    } else {
      await router.push({ name: isLogistics.value ? 'forwarders' : 'orders' });
    }

    loginStore.clearRouteHistory();
  };

  return { isLoading, callback };
}

export { getName, useRedirect };
