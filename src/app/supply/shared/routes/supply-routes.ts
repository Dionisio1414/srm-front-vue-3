import { RouteRecordRaw } from 'vue-router';

const supplyRoutes: RouteRecordRaw[] = [
  {
    path: '/supply/:guid',
    name: 'supply',
    component: () => import(/* webpackChunkName: "supply" */ '../../supply.vue'),
    meta: {
      title: 'Supply',
    },
  },
];

export default supplyRoutes;
