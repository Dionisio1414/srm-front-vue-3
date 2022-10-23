<template>
  <div class="flex">
    <router-link
      v-for="(tab, index) in tabs"
      :key="index"
      :to="tab.to"
      class="no-underline"
      style="margin-right: 1.25rem"
      v-slot="{ isActive, isExactActive }"
    >
      <prime-button
        :label="$t(tab.label)"
        :style="(isExact ? isExactActive : isActive) ? '' : 'opacity: 0.5'"
        style="padding: 0.375rem 0.875rem"
      />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import PrimeButton from 'primevue/button';

import type { BaseTabs } from '@/@types/additional';

defineProps({
  tabs: { type: Array as PropType<BaseTabs[]>, required: true },
  isExact: { type: Boolean, default: () => true },
});
</script>
