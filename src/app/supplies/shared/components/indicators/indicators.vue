<template>
  <div class="flex flex-wrap gap-2">
    <template v-for="(file, key, index) in files" :key="index">
      <template v-if="file">
        <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

        <indicators-item :type="key" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import IndicatorsItem from '@/app/supplies/shared/components/indicators/indicators-item.vue';

import { SuppliesFiles } from '@/@types/supplies';

defineProps({
  files: { type: Object as PropType<SuppliesFiles>, required: true },
});
</script>
