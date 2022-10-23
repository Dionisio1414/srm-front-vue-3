import { RouteRecordRaw } from 'vue-router';

const forwardersRoutes: RouteRecordRaw[] = [
  {
    path: '/forwarders',
    name: 'forwarders',
    redirect: '/forwarders/forwarders-list',
    component: () => import(/* webpackChunkName: "forwarders" */ '../../forwarders.vue'),
    meta: {
      title: 'Forwarders',
    },

    children: [
      {
        path: '/forwarders/forwarders-list',
        name: 'forwarders-list',
        component: () =>
          import(/* webpackChunkName: "forwarders-list" */ '../../views/forwarders-list.vue'),
        meta: {
          title: 'Forwarders list',
        },
      },

      {
        path: '/forwarders/forwarder/:guid',
        name: 'forwarder-edit',
        component: () =>
          import(/* webpackChunkName: "forwarders-edit" */ '../../views/forwarders-edit.vue'),
        meta: {
          title: 'Edit forwarder',
        },
      },

      {
        path: '/forwarders/forwarder/create',
        name: 'forwarder-create',
        component: () =>
          import(/* webpackChunkName: "forwarders-create" */ '../../views/forwarders-create.vue'),
        meta: {
          title: 'Create forwarder',
        },
      },
    ],
  },
];

export default forwardersRoutes;
