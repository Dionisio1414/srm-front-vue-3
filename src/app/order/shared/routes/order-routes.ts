import { RouteRecordRaw } from 'vue-router';

const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/order/:guid',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '../../order.vue'),
    meta: {
      title: 'Order',
    },
  },

  {
    path: '/draft/:guid',
    name: 'draft',
    component: () => import(/* webpackChunkName: "draft" */ '../../order.vue'),
    meta: {
      title: 'Draft',
    },
  },

  {
    path: '/planned/:guid',
    name: 'planned',
    component: () => import(/* webpackChunkName: "planned" */ '../../order.vue'),
    meta: {
      title: 'Planned',
    },
  },
];

export default orderRoutes;
