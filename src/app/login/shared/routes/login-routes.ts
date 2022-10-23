import { RouteRecordRaw } from 'vue-router';

const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../../login.vue'),
    meta: {
      title: 'Login',
    },
  },
];

export default loginRoutes;
