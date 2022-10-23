import { RouteRecordRaw } from 'vue-router';

const shipmentsRoutes: RouteRecordRaw[] = [
  {
    path: '/shipments',
    name: 'shipments',
    redirect: '/shipments/active',
    component: () => import(/* webpackChunkName: "shipments" */ '../../shipments.vue'),

    children: [
      {
        path: 'active',
        name: 'shipments-active',
        component: () =>
          import(/* webpackChunkName: "shipments-active" */ '../../views/shipments-active.vue'),
        meta: {
          title: 'Shipments',
          statusId: 2,
        },
      },

      {
        path: 'pre-booking',
        name: 'shipments-pre-booking',
        component: () =>
          import(
            /* webpackChunkName: "shipments-pre-booking" */ '../../views/shipments-pre-booking.vue'
          ),
        meta: {
          title: 'Shipments',
          statusId: 1,
        },
      },
    ],
  },
];

export default shipmentsRoutes;
