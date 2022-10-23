import { RouteRecordRaw } from 'vue-router';

const ordersRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'orders',
    redirect: '/orders',
    component: () => import(/* webpackChunkName: "orders" */ '../../orders.vue'),

    children: [
      {
        path: 'orders',
        name: 'orders-list',
        component: () =>
          import(/* webpackChunkName: "orders-list" */ '../../views/orders-list.vue'),
        meta: {
          title: 'Orders list',
        },
      },

      {
        path: 'drafts',
        name: 'drafts-list',
        component: () =>
          import(/* webpackChunkName: "drafts-list" */ '../../views/drafts-list.vue'),
        meta: {
          title: 'Drafts list',
        },
      },

      {
        path: 'planned',
        name: 'planned-list',
        component: () =>
          import(/* webpackChunkName: "planned-list" */ '../../views/planned-list.vue'),
        meta: {
          title: 'Planned list',
        },
      },
    ],
  },
];

export default ordersRoutes;
