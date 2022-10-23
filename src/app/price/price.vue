<template>
  <base-template :tabs="BASE_TABS" :exact="false" :default-navigation="false">
    <template #title>
      {{ $t(`price.titles.price`) }}
    </template>

    <template #default>
      <tab-menu :model="priceTabs" exact class="mb-5" />

      <router-view />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import TabMenu from 'primevue/tabmenu';

import { PRICE_TABS, BASE_TABS } from '@/app/price/shared/config/tabs-constants';

import BaseTemplate from '@/app/shared/components/base-template.vue';

const { t } = useI18n();

const priceTabs = computed(() => PRICE_TABS.map((tab) => ({ ...tab, label: t(tab.label) })));
</script>
