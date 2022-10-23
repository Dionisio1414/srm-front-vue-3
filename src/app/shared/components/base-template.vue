<template>
  <div class="flex align-items-center px-4">
    <div v-if="isBack" class="mr-5">
      <prime-button
        type="button"
        class="p-button-sm flex align-items-center justify-content-center p-0"
        style="width: 2.1875rem; height: 1.5625rem"
        @click="$emit('back')"
      >
        <font-awesome-icon icon="arrow-left" />
      </prime-button>
    </div>

    <h1 class="m-0 text-5xl uppercase">
      <slot name="title" />
    </h1>

    <base-tabs
      v-if="tabs.length && !defaultNavigation"
      :tabs="items"
      :is-exact="exact"
      style="margin-left: 4.6875rem"
    />

    <div v-if="$slots['side-element']" class="ml-auto">
      <slot name="side-element" />
    </div>

    <div v-if="$slots['filters']" class="flex flex-wrap" style="margin-left: 4.6875rem">
      <slot name="filters" />
    </div>

    <div v-if="$slots['actions'] && showActions" class="ml-auto">
      <slot name="actions" />
    </div>

    <prime-button
      v-if="showSettings"
      :label="$t('directories.settingsButton')"
      class="ml-auto"
      style="padding: 0.375rem 0.875rem"
      @click="settingsVisibility = true"
    />
  </div>

  <tab-menu
    v-if="tabs.length && defaultNavigation"
    :model="items"
    :exact="exact"
    class="mt-4 mb-2 mx-4"
  />

  <div class="p-4">
    <slot name="default" />
  </div>

  <base-settings
    :visibility="settingsVisibility"
    @change-visibility="($event) => (settingsVisibility = $event)"
  />
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useI18n } from 'vue-i18n';

import TabMenu from 'primevue/tabmenu';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import BaseTabs from '@/app/shared/components/base-tabs.vue';
import BaseSettings from '@/app/shared/components/base-settings.vue';

import type { BaseTabs as TBaseTabs } from '@/@types/additional';

library.add(faArrowLeft);

const props = defineProps({
  tabs: { type: Array as PropType<TBaseTabs[]>, default: () => [] },
  exact: { type: Boolean, default: () => true },
  isBack: { type: Boolean, default: () => false },
  showSettings: { type: Boolean, default: () => false },
  showActions: { type: Boolean, default: () => false },
  defaultNavigation: { type: Boolean, default: () => true },
});

defineEmits(['back']);

const { t } = useI18n();

const settingsVisibility = ref(false);

const items = computed(() => props.tabs.map((tab) => ({ ...tab, label: t(tab.label) })));
</script>
