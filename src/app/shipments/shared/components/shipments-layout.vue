<template>
  <tab-menu :model="localizedTabs" exact class="mb-5" />

  <slot name="default" />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import { useI18n } from 'vue-i18n';

import TabMenu from 'primevue/tabmenu';

import type { BaseTabs } from '@/@types/additional';

const props = defineProps({
  tabs: { type: Array as PropType<BaseTabs[]>, default: () => [] },
});

const { t } = useI18n();

const localizedTabs = computed(() => props.tabs.map((tab) => ({ ...tab, label: t(tab.label) })));
</script>
