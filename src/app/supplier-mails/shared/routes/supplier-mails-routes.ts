import { RouteRecordRaw } from 'vue-router';

const supplierMailsRoutes: RouteRecordRaw[] = [
  {
    path: '/supplier-mails',
    name: 'supplier-mails',
    component: () => import(/* webpackChunkName: "supplier-mails" */ '../../supplier-mails.vue'),
    meta: {
      title: 'Supplier mails',
    },
  },
];

export default supplierMailsRoutes;
