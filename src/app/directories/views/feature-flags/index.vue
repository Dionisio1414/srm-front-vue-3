<template>
  <directories-layout :tabs="FEATURE_FLAGS_TABS">
    <router-view />
  </directories-layout>
</template>

<script lang="ts" setup>
import { FEATURE_FLAGS_TABS } from '@/app/directories/shared/config/tabs-constants';

import DirectoriesLayout from '@/app/directories/shared/components/directories-layout.vue';
</script>
