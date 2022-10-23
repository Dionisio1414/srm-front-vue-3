import { RouteRecordRaw } from 'vue-router';

const supplyRoutes: RouteRecordRaw[] = [
  {
    path: '/supplies',
    name: 'supplies',
    component: () => import(/* webpackChunkName: "supplies" */ '../../supplies.vue'),
    meta: {
      title: 'Supplies list',
    },
  },
];

export default supplyRoutes;
