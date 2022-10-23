import { RouteLocationNormalized, RouteRecordName } from 'vue-router';

import pinia from '@/app/app-store';

import useLoginStore from '@/app/login/shared/store/login-store';

import { getUser } from '@/app/login/shared/services/api';

const accessMiddleware = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: (params?: { name: RouteRecordName }) => void
): Promise<void> => {
  const loginStore = useLoginStore(pinia);

  loginStore.updateRouteHistory(to.path);

  if (to.name !== 'login') {
    try {
      await getUser();

      return next();
    } catch (error) {
      return next({ name: 'login' });
    }
  }

  return next();
};

export default accessMiddleware;
