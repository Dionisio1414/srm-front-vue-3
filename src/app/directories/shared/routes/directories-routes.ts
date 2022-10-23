import { RouteRecordRaw } from 'vue-router';

const directoriesRoutes: RouteRecordRaw[] = [
  {
    path: '/directories',
    name: 'directories',
    redirect: '/directories/general',
    component: () => import(/* webpackChunkName: "directories" */ '../../directories.vue'),
    meta: {
      title: 'Directory & Settings',
    },

    children: [
      {
        path: 'general',
        name: 'directories-general',
        redirect: '/directories/general/countries',
        component: () =>
          import(/* webpackChunkName: "directories-general" */ '../../views/general/index.vue'),

        children: [
          {
            path: 'countries',
            name: 'directories-general-countries',
            component: () =>
              import(
                /* webpackChunkName: "directories-general-countries" */ '../../views/general/countries.vue'
              ),
          },

          {
            path: 'exporters',
            name: 'directories-general-exporters',
            component: () =>
              import(
                /* webpackChunkName: "directories-general-exporters" */ '../../views/general/exporters.vue'
              ),
          },
        ],
      },

      {
        path: 'forwarder',
        name: 'directories-forwarder',
        redirect: '/directories/forwarder/reasons',
        component: () =>
          import(/* webpackChunkName: "directories-forwarder" */ '../../views/forwarder/index.vue'),

        children: [
          {
            path: 'reasons',
            name: 'directories-forwarder-reasons',
            component: () =>
              import(
                /* webpackChunkName: "directories-forwarder-reasons" */ '../../views/forwarder/reasons.vue'
              ),
          },
        ],
      },

      {
        path: 'shipments',
        name: 'directories-shipments',
        redirect: '/directories/shipments/loading-types',
        component: () =>
          import(/* webpackChunkName: "directories-shipments" */ '../../views/shipments/index.vue'),

        children: [
          {
            path: 'loading-types',
            name: 'directories-shipments-loading-types',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-loading-types" */ '../../views/shipments/loading-types.vue'
              ),
          },

          {
            path: 'transport-units',
            name: 'directories-shipments-transport-units',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-transport-units" */ '../../views/shipments/transport-units.vue'
              ),
          },

          {
            path: 'sizes',
            name: 'directories-shipments-sizes',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-sizes" */ '../../views/shipments/sizes.vue'
              ),
          },

          {
            path: 'statuses',
            name: 'directories-shipments-statuses',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-statuses" */ '../../views/shipments/statuses.vue'
              ),
          },

          {
            path: 'ways',
            name: 'directories-shipments-ways',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-ways" */ '../../views/shipments/ways.vue'
              ),
          },

          {
            path: '',
            name: 'directories-shipments-items',
            component: () =>
              import(
                /* webpackChunkName: "directories-shipments-items" */ '../../views/shipments/ports.vue'
              ),
          },
        ],
      },

      {
        path: 'feature-flags',
        name: 'directories-feature-flags',
        redirect: '/directories/feature-flags/list',
        component: () =>
          import(
            /* webpackChunkName: "directories-forwarder" */ '../../views/feature-flags/index.vue'
          ),

        children: [
          {
            path: 'list',
            name: 'directories-feature-flags-items',
            component: () =>
              import(
                /* webpackChunkName: "directories-forwarder-reasons" */ '../../views/feature-flags/feature-flags-items.vue'
              ),
          },
        ],
      },
    ],
  },
];

export default directoriesRoutes;
