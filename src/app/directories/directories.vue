<template>
  <base-template :tabs="AWS_TABS" :exact="false" show-settings :default-navigation="false">
    <template #title>
      {{ $t(`directories.titles.${$route.name}`) }}
    </template>

    <template #default>
      <router-view />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import BaseTemplate from '@/app/shared/components/base-template.vue';

import { AWS_TABS } from './shared/config/tabs-constants';
</script>
