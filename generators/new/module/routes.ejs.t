---
to: 'src/app/<%= name %>/shared/routes/<%= name %>-routes.ts'
---

import { RouteRecordRaw } from 'vue-router';

const <%= name %>Routes: RouteRecordRaw[] = [
  {
    path: '/<%= name %>',
    name: '<%= name %>',
    component: () => import(/* webpackChunkName: "<%= name %>" */ './<%= name %>.vue'),
  },
];

export default <%= name %>Routes;
