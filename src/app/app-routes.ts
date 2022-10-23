import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import loginRoutes from '@/app/login/shared/routes/login-routes';
import ordersRoutes from '@/app/orders/shared/routes/orders-routes';
import supplierRoutes from '@/app/supplier/shared/routes/supplier-routes';
import orderRoutes from '@/app/order/shared/routes/order-routes';
import forwardersRoutes from '@/app/forwarders/shared/routes/forwarders-routes';
import shipmentsRoutes from '@/app/shipments/shared/routes/shipments-routes';
import directoriesRoutes from '@/app/directories/shared/routes/directories-routes';
import priceRoutes from '@/app/price/shared/routes/price-routes';
import supplyRoutes from '@/app/supply/shared/routes/supply-routes';
import suppliesRoutes from '@/app/supplies/shared/routes/supplies-routes';
import supplierMailsRoutes from '@/app/supplier-mails/shared/routes/supplier-mails-routes';

import accessMiddleware from '@/app/shared/services/middleware/access-middleware';
import setPageTitleMiddleware from '@/app/shared/services/middleware/page-title-middleware';

const appRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'page-not-found',
    component: () =>
      import(/* webpackChunkName: "page-not-found" */ '@/app/shared/components/page-not-found.vue'),
    meta: {
      title: 'Page not found',
    },
  },
];

const routes: RouteRecordRaw[] = [
  ...appRoutes,
  ...loginRoutes,
  ...ordersRoutes,
  ...supplierRoutes,
  ...orderRoutes,
  ...forwardersRoutes,
  ...shipmentsRoutes,
  ...directoriesRoutes,
  ...priceRoutes,
  ...supplyRoutes,
  ...suppliesRoutes,
  ...supplierMailsRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(accessMiddleware);
router.beforeEach(setPageTitleMiddleware);

export default router;
