<template>
  <directories-layout :tabs="tabs">
    <router-view />
  </directories-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import { SHIPMENTS_TABS } from '@/app/directories/shared/config/tabs-constants';

import DirectoriesLayout from '@/app/directories/shared/components/directories-layout.vue';

const route = useRoute();

const tabs = computed(() =>
  SHIPMENTS_TABS.map((tab) => ({ ...tab, to: { name: tab.to.name, query: route.query } }))
);
</script>
