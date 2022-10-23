import { RouteRecordRaw } from 'vue-router';

const priceRoutes: RouteRecordRaw[] = [
  {
    path: '/price',
    name: 'price',
    redirect: '/price/prices-list',
    component: () => import(/* webpackChunkName: "price" */ '../../price.vue'),
    meta: {
      title: 'Price',
    },

    children: [
      {
        path: 'prices-list',
        name: 'prices-list',
        component: () =>
          import(/* webpackChunkName: "prices-list" */ '../../views/prices-list.vue'),
        meta: {
          title: 'Prices list',
        },
      },

      {
        path: ':guid',
        name: 'price-item',
        component: () => import(/* webpackChunkName: "price-item" */ '../../views/price-item.vue'),
        meta: {
          title: 'Price',
        },
      },

      {
        path: 'price-create',
        name: 'price-create',
        component: () =>
          import(/* webpackChunkName: "price-create" */ '../../views/price-create.vue'),
        meta: {
          title: 'Create price',
        },
      },
    ],
  },
];

export default priceRoutes;
