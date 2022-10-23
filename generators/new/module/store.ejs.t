---
to: 'src/app/<%= name %>/shared/store/<%= name %>-store.ts'
---

import { defineStore } from 'pinia';

interface <%= name[0].toUpperCase() + name.slice(1) %>State {
  
}

const useForwardersStore = defineStore('forwarders', {
  state: () => ({

  }) as <%= name[0].toUpperCase() + name.slice(1) %>State,

  getters: {},

  actions: {},
});

export default use<%= name[0].toUpperCase() + name.slice(1) %>Store;
export type { <%= name[0].toUpperCase() + name.slice(1) %>State };
