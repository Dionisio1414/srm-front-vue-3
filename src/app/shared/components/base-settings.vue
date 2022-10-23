<template>
  <sidebar
    v-model:visible="sidebarVisibility"
    position="right"
    :show-close-icon="false"
    class="settings-sidebar overflow-hidden"
    style="width: 45.625rem; border-top-left-radius: 3.125rem; border-bottom-left-radius: 3.125rem"
  >
    <div class="settings-sidebar-content">
      <h2 class="mt-0 text-4xl uppercase" style="margin-bottom: 6.75rem">
        {{ $t('directories.settingsButton') }}
      </h2>

      <form novalidate @submit.prevent="onSave">
        <div class="flex align-items-center justify-content-between" style="margin-top: 1.75rem">
          <label for="" class="text-2xl font-bold uppercase">
            {{ $t('directories.labels.name') }}
          </label>

          <input-text
            :model-value="user.name"
            readonly
            class="flex-shrink-0"
            style="width: 15.625rem"
            v-tooltip="{
              value: $t('messages.inDeveloping'),
            }"
          />
        </div>

        <div class="flex align-items-center justify-content-between" style="margin-top: 1.75rem">
          <label for="" class="text-2xl font-bold uppercase">
            {{ $t('directories.labels.email') }}
          </label>

          <input-text
            :model-value="user.email || ''"
            class="flex-shrink-0"
            readonly
            style="width: 15.625rem"
            v-tooltip="{
              value: $t('messages.inDeveloping'),
            }"
          />
        </div>

        <div class="flex align-items-center justify-content-between" style="margin-top: 1.75rem">
          <label for="" class="text-2xl font-bold uppercase">
            {{ $t('directories.labels.password') }}
          </label>

          <input-text
            :model-value="''"
            class="flex-shrink-0"
            readonly
            style="width: 15.625rem"
            v-tooltip="{
              value: $t('messages.inDeveloping'),
            }"
          />
        </div>

        <divider class="my-5" />

        <div class="flex align-items-center justify-content-between">
          <label for="" class="text-2xl font-bold uppercase">
            {{ $t('directories.labels.mode') }}
          </label>

          <dropdown
            v-model="settings.scheme"
            option-label="label"
            option-value="value"
            :options="THEME_CONSTANTS"
            class="flex-shrink-0"
            style="width: 15.625rem"
          >
            <template #value="{ value }">
              <template v-if="value">
                {{ $t(`directories.settings.${value}`) }}
              </template>
            </template>

            <template #option="{ option }">
              {{ $t(`directories.settings.${option.value}`) }}
            </template>
          </dropdown>
        </div>

        <div class="flex align-items-center justify-content-between" style="margin-top: 1.75rem">
          <label for="" class="text-2xl font-bold uppercase">
            {{ $t('directories.labels.language') }}
          </label>

          <dropdown
            v-model="settings.language"
            option-label="label"
            option-value="value"
            :options="LANGUAGE_CONSTANTS"
            class="flex-shrink-0"
            style="width: 15.625rem"
          >
            <template #value="{ value }">
              <template v-if="value">
                {{ $t(`directories.settings.${value}`) }}
              </template>
            </template>

            <template #option="{ option }">
              {{ $t(`directories.settings.${option.value}`) }}
            </template>
          </dropdown>
        </div>

        <prime-button
          :label="$t('directories.labels.save')"
          type="submit"
          class="w-full"
          style="margin-top: 2.875rem"
        />
      </form>
    </div>

    <prime-image
      :src="`/images/settings-gear${scheme === 'dark' ? '-dark' : ''}.svg`"
      alt="Settings gear background element"
      class="absolute top-0 right-0 pointer-events-none"
      image-style="height: 11.625rem"
    />

    <prime-image
      :src="`/images/settings-background${scheme === 'dark' ? '-dark' : ''}.svg`"
      alt="Settings background element"
      class="block w-full mt-auto pointer-events-none"
      image-class="block w-full"
    />
  </sidebar>
</template>

<script lang="ts" setup>
import { computed, WritableComputedRef, reactive, nextTick } from 'vue';

import { useI18n } from 'vue-i18n';
import { useLocalStorage } from '@vueuse/core';

import vTooltip from 'primevue/tooltip';

import Sidebar from 'primevue/sidebar';
import PrimeImage from 'primevue/image';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import PrimeButton from 'primevue/button';

import useLoginStore from '@/app/login/shared/store/login-store';

import { i18n, setI18nLanguage } from '@/plugins/i18n';
import { THEME_CONSTANTS, LANGUAGE_CONSTANTS } from '@/app/shared/config/settings-constants';

const props = defineProps({
  visibility: { type: Boolean, required: true },
});

const emit = defineEmits(['change-visibility']);

const loginStore = useLoginStore();

const { locale } = useI18n({ useScope: 'global' });
const scheme = useLocalStorage('ui-color-scheme', 'light');

const settings = reactive({
  scheme: scheme.value,
  language: locale.value,
});

const user = computed(() => loginStore.user);
const sidebarVisibility: WritableComputedRef<boolean> = computed({
  get() {
    return props.visibility;
  },
  set(value) {
    emit('change-visibility', value);
  },
});

const onSave = async () => {
  scheme.value = settings.scheme;
  locale.value = settings.language;

  await nextTick();

  setI18nLanguage(i18n, settings.language as string);
  document.dispatchEvent(new Event('change:ui-color-scheme'));

  emit('change-visibility', false);
};
</script>

<style>
.settings-sidebar .p-sidebar-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0 !important;
}

.settings-sidebar-content {
  padding: 5rem 6rem 2.5rem;
}

.settings-sidebar .p-sidebar-header {
  display: none;
}
</style>
