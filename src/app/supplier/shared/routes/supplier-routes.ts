import { RouteRecordRaw } from 'vue-router';

const supplierRoutes: RouteRecordRaw[] = [
  {
    path: '/supplier/:guid',
    name: 'supplier',
    redirect: { name: 'supplier-list' },
    component: () => import(/* webpackChunkName: "supplier" */ '../../supplier.vue'),

    children: [
      {
        path: '',
        name: 'supplier-list',
        component: () =>
          import(/* webpackChunkName: "supplier-orders" */ '../../views/supplier-list.vue'),
        meta: {
          title: 'Supplier orders',
        },
      },

      {
        path: 'swh',
        name: 'supplier-swh',
        component: () =>
          import(/* webpackChunkName: "supplier-swh" */ '../../views/supplier-swh.vue'),
        meta: {
          title: 'Supplier SWH',
        },
      },

      {
        path: 'supplies',
        name: 'supplier-supplies',
        component: () =>
          import(/* webpackChunkName: "supplier-supplies" */ '../../views/supplier-supplies.vue'),
        meta: {
          title: 'Supplier supplies',
        },
      },

      {
        path: 'shipments',
        name: 'supplier-shipments',
        component: () =>
          import(/* webpackChunkName: "supplier-shipments" */ '../../views/supplier-shipments.vue'),
        meta: {
          title: 'Supplier shipments',
        },
      },
    ],
  },
];

export default supplierRoutes;
