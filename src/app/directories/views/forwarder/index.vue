<template>
  <directories-layout :tabs="FORWARDER_TABS">
    <router-view />
  </directories-layout>
</template>

<script lang="ts" setup>
import { FORWARDER_TABS } from '@/app/directories/shared/config/tabs-constants';

import DirectoriesLayout from '@/app/directories/shared/components/directories-layout.vue';
</script>
