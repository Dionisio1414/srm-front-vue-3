<template>
  <panel toggleable v-model:collapsed="isCollapsed" :header="$t('forwarder.titles.serviceInfo')">
    <template #icons>
      <button
        v-if="isReadonly"
        class="p-panel-header-icon p-link p-mr-2"
        type="button"
        @click="
          () => {
            isReadonly = false;
            isCollapsed = false;
          }
        "
      >
        <span class="pi pi-pencil"></span>
      </button>
    </template>

    <template #default>
      <form novalidate class="flex flex-column" @submit.prevent="onSubmit">
        <template v-if="isReadonly">
          <div class="my-2">
            <b>{{ $t('forwarder.service.ways') }}:</b>
            {{ data.ways?.map((way: { name: string }) => way.name)?.join(', ') }}
          </div>

          <div class="my-2">
            <b>{{ $t('forwarder.service.countries') }}:</b>
            {{ data.countries?.map((country: { name: string }) => country.name)?.join(', ') }}
          </div>

          <div class="my-2">
            <b>{{ $t('forwarder.service.ports') }}:</b>
            {{ data.point_of_loading?.map((port: { name: string }) => port.name)?.join(', ') }}
          </div>
        </template>

        <template v-else>
          <div class="grid align-items-center">
            <label for="edit-serviceWays" class="col-fixed w-10rem">
              *{{ $t('forwarder.service.ways') }}:
            </label>

            <div
              class="col flex flex-wrap align-items-center"
              v-tooltip="{
                value: errorMessage(vv.way_ids.$errors),
                disabled: !errorMessage(vv.way_ids.$errors),
              }"
            >
              <div v-for="way of infoStore.ways" :key="way.id" class="p-field-checkbox my-3 mr-3">
                <checkbox
                  :id="`edit-serviceWays-${way.id}`"
                  v-model="vv.way_ids.$model"
                  :value="way.id"
                  :disabled="isLoading"
                  :class="vv.way_ids.$error ? 'p-invalid' : ''"
                />

                <label :for="`edit-serviceWays-${way.id}`">{{ way.name }}</label>
              </div>
            </div>
          </div>

          <div class="grid align-items-center">
            <label for="edit-serviceCountries" class="col-fixed w-10rem">
              *{{ $t('forwarder.service.countries') }}:
            </label>

            <div
              class="col w-6"
              v-tooltip="{
                value: errorMessage(vv.country_ids.$errors),
                disabled: !errorMessage(vv.country_ids.$errors),
              }"
            >
              <multi-select
                id="edit-serviceCountries"
                v-model="vv.country_ids.$model"
                filter
                :options="infoStore.countries"
                option-label="name"
                option-value="id"
                class="w-full"
                :class="vv.country_ids.$error ? 'p-invalid' : ''"
                :placeholder="$t('forwarder.service.countries')"
                :disabled="!infoStore.countries.length || isLoading"
                panel-class="base-info-panel"
              />
            </div>
          </div>

          <divider v-if="infoStore.ports.length" align="left">
            <span class="text-md">{{ $t('forwarder.table.ports') }}</span>
          </divider>

          <div
            v-for="port in infoStore.ports"
            :key="port.countryId"
            class="grid align-items-center"
          >
            <label :for="`edit-servicePort-${port.countryId}`" class="col-fixed w-10rem">
              {{ port.countryName }}:
            </label>

            <div class="col w-6">
              <multi-select
                :id="`edit-servicePort-${port.countryId}`"
                v-model="vv.point_of_loading_ids.$model"
                filter
                :options="port.ports"
                option-label="name"
                option-value="id"
                class="w-full"
                :class="vv.point_of_loading_ids.$error ? 'p-invalid' : ''"
                :placeholder="$t('placeholders.portOfLoading')"
                :disabled="!infoStore.countries.length || isLoading"
                panel-class="base-info-panel"
              >
                <template #value="{ value, placeholder }">
                  <template v-if="!getPortsValue(value, port).length">{{ placeholder }}</template>
                  <template v-else>{{ getPortsValue(value, port).join(', ') }}</template>
                </template>
              </multi-select>
            </div>
          </div>
        </template>

        <divider align="left">
          <span class="text-md">{{ $t('forwarder.service.areas') }}</span>
        </divider>

        <div class="grid align-items-center">
          <label for="edit-serviceAreas" class="col-fixed w-10rem">
            {{ $t('forwarder.service.areas') }}:
          </label>

          <div class="col">
            <prime-textarea
              id="edit-serviceAreas"
              v-model="vv.area_notes.$model"
              rows="2"
              class="w-full"
              :class="vv.area_notes.$error ? 'p-invalid' : ''"
              :placeholder="$t('forwarder.service.areas')"
              :readonly="isReadonly || isLoading"
              style="resize: none"
              v-tooltip="{
                value: errorMessage(vv.area_notes.$errors),
                disabled: !errorMessage(vv.area_notes.$errors),
              }"
            />
          </div>
        </div>

        <div v-if="!isReadonly || isLoading" class="flex justify-content-end mt-3">
          <prime-button
            :label="$t('forwarder.buttons.cancel')"
            type="button"
            :disabled="isLoading"
            class="p-button-danger mr-3 text-base"
            @click="onCancel"
          />

          <prime-button
            :label="$t('forwarder.buttons.saveChanges')"
            type="submit"
            :loading="isLoading"
            class="p-button-success text-base"
          />
        </div>
      </form>
    </template>
  </panel>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

import { useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core';

import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import vTooltip from 'primevue/tooltip';
import Panel from 'primevue/panel';
import Checkbox from 'primevue/checkbox';
import MultiSelect from 'primevue/multiselect';
import Divider from 'primevue/divider';
import PrimeTextarea from 'primevue/textarea';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { updateServiceInfo } from '@/app/forwarders/shared/services/api';

import errorMessage from '@/app/shared/utils/error-message';
import { serviceScheme } from '@/app/forwarders/shared/config/validation-schemes/service-scheme';

import type { Port } from '@/@types/additional';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

const props = defineProps({
  notes: { type: String, required: true },
  data: { type: Object, required: true },
});

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();
const route = useRoute();
const { onSuccess, onError } = useNotification();

const formData = reactive({
  area_notes: props.notes,
  country_ids: props.data.countries?.map((item: { id: number }) => item.id) || [],
  point_of_loading_ids: props.data.point_of_loading?.map((item: { id: number }) => item.id) || [],
  way_ids: props.data.ways?.map((item: { id: number }) => item.id) || [],
});

const vv = useVuelidate(serviceScheme, formData);

const isReadonly = ref(true);
const isLoading = ref(false);
const isCollapsed = ref(false);

const resetData = (resetPorts = true, resetCountries = true): void => {
  if (resetPorts) {
    infoStore.$patch((state) => {
      state.ports = [];
    });
  }
  if (resetCountries) {
    infoStore.$patch((state) => {
      state.countries = [];
    });
  }
};

const updateData = (isWays = true): void => {
  if (isWays) {
    const countries = infoStore.countries.map((country) => country.id);
    const countryIds = cloneDeep(formData.country_ids).filter((id: number) =>
      countries.includes(id)
    );

    formData.country_ids = countryIds;
  } else {
    const ports = infoStore.ports.map((port) => port.ports);
    const portIds = ports.reduce((ports: number[], port) => {
      ports.push(...port.map((item) => item.id));

      return ports;
    }, []);

    const availablePorts = formData.point_of_loading_ids.filter((pointId: number) =>
      portIds.includes(pointId)
    );

    formData.point_of_loading_ids = availablePorts;
  }
};

watch(
  () => formData.way_ids,
  async (value, oldValue) => {
    if (isEqual(value, oldValue)) return;

    if (value.length) {
      await infoStore.getCountries({ way_ids: value }).catch((error) => onError(error));
    } else {
      resetData();
    }

    updateData();
  },
  { deep: true, immediate: true }
);

watch(
  () => formData.country_ids,
  async (value, oldValue) => {
    const wayIds = infoStore.ways.map((way) => way.id);

    if (isEqual(value, oldValue)) return;

    if (value.length) {
      infoStore.getPorts({ way_ids: wayIds, country_ids: value }).catch((error) => onError(error));
    } else {
      resetData(true, false);
    }

    updateData(false);
  },
  { deep: true, immediate: true }
);

infoStore.getWays().catch((error) => onError(error));

resetData();

const getPortsValue = (value: number[], item: Port): string[] => {
  const ports = item.ports.map((port) => port.id);
  const portIds = value.filter((id: number) => ports.includes(id));

  return item.ports.reduce((values: string[], port) => {
    if (portIds.includes(port.id)) values.push(port.name);

    return values;
  }, []);
};

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    isLoading.value = true;

    try {
      const data = await updateServiceInfo(route.params.guid as string, formData);

      onSuccess(data.message);
    } catch (error: unknown) {
      onError(error as CustomError);
    } finally {
      emit('update-data');
      isReadonly.value = true;
      isLoading.value = false;
    }
  }
};

const onCancel = () => {
  isReadonly.value = true;
  emit('update-data');
};
</script>
