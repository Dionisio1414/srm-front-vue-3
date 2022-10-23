<template>
  <div class="grid align-items-start p-5 m-0">
    <divider align="left">
      <span class="text-xl">{{ $t('forwarder.titles.baseInfo') }}</span>
    </divider>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoName"> *{{ $t('forwarder.info.name') }}: </label>

      <input-text
        id="baseInfoName"
        :model-value="data.name || ''"
        aria-describedby="baseInfoName-help"
        class="my-1"
        :class="vv.name.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.info.name')"
        @input="updateData('name', $event)"
      />

      <small id="baseInfoName-help" :class="vv.name.$error ? 'p-error' : ''">
        {{ errorMessage(vv.name.$errors) }}
      </small>
    </div>

    <div class="p-field-checkbox col-3 flex align-items-center mt-5">
      <input-switch id="BaseInfoIsActive" v-model="isActiveModel" />

      <label for="BaseInfoIsActive">
        {{ $t('forwarder.info.isActive') }}
      </label>
    </div>

    <div v-if="!data.is_active" class="p-field flex flex-column col-3">
      <label for="baseInfoReason"> *{{ $t('forwarder.info.reason') }}: </label>

      <dropdown
        id="baseInfoReason"
        :model-value="data.reason_id"
        :options="infoStore.reasons"
        option-label="alias"
        option-value="id"
        aria-describedby="baseInfoReason-help"
        class="my-1"
        :class="vv.reason_id.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.info.reason')"
        @change="updateData('reason_id', $event)"
      >
        <template #value="{ value, placeholder }">
          <template v-if="value">
            {{
              $t(
                `forwarder.reasons.${
                  infoStore.reasons.find((reason) => reason.id === value)?.alias
                }`
              )
            }}
          </template>

          <template v-else>
            {{ placeholder }}
          </template>
        </template>

        <template #option="{ option }">
          {{ $t(`forwarder.reasons.${option.alias}`) }}
        </template>
      </dropdown>

      <small id="baseInfoReason-help" :class="vv.reason_id.$error ? 'p-error' : ''">
        {{ errorMessage(vv.reason_id.$errors) }}
      </small>
    </div>
    <div
      v-if="!data.is_active && isOtherReason(data.reason_id)"
      class="p-field flex flex-column col-3"
    >
      <label for="baseInfoReasonComment"> *{{ $t('forwarder.service.reasonComment') }}: </label>

      <prime-textarea
        id="baseInfoReasonComment"
        :model-value="data.reason_comment || ''"
        aria-describedby="baseInfoReasonComment-help"
        rows="3"
        class="my-1"
        :class="vv.reason_comment.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.service.reasonComment')"
        style="resize: none"
        @input="updateData('reason_comment', $event)"
      />

      <small id="baseInfoReasonComment-help" :class="vv.reason_comment.$error ? 'p-error' : ''">
        {{ errorMessage(vv.reason_comment.$errors) }}
      </small>
    </div>

    <divider />

    <div class="p-field flex flex-column col-3">
      <label> *{{ $t('forwarder.service.ways') }}: </label>

      <div class="flex flex-wrap align-items-center">
        <div v-for="way of infoStore.ways" :key="way.id" class="p-field-checkbox my-3 mr-3">
          <checkbox
            :id="`baseInfoWay-${way.id}`"
            v-model="waysModel"
            :value="way.id"
            :class="vv.way_ids.$error ? 'p-invalid' : ''"
          />
          <label :for="`baseInfoWay-${way.id}`">{{ way.name }}</label>
        </div>
      </div>

      <small :class="vv.way_ids.$error ? 'p-error' : ''">
        {{ errorMessage(vv.way_ids.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoCountries"> *{{ $t('forwarder.service.countries') }}: </label>

      <multi-select
        id="baseInfoCountries"
        :model-value="data.country_ids"
        :options="infoStore.countries"
        filter
        option-label="name"
        option-value="id"
        aria-describedby="baseInfoCountries-help"
        class="my-1"
        :class="vv.country_ids.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.service.countries')"
        :disabled="!infoStore.countries.length"
        panel-class="base-info-panel"
        @change="updateData('country_ids', $event)"
      />

      <small id="baseInfoCountries-help" :class="vv.country_ids.$error ? 'p-error' : ''">
        {{ errorMessage(vv.country_ids.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-6">
      <label for="baseInfoReasonComment"> {{ $t('forwarder.service.areas') }}: </label>

      <prime-textarea
        id="baseInfoReasonComment"
        :model-value="data.area_notes || ''"
        aria-describedby="baseInfoReasonComment-help"
        rows="4"
        class="my-1"
        :class="vv.area_notes.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.service.areas')"
        style="resize: none"
        @input="updateData('area_notes', $event)"
      />

      <small id="baseInfoReasonComment-help" :class="vv.area_notes.$error ? 'p-error' : ''">
        {{ errorMessage(vv.area_notes.$errors) }}
      </small>
    </div>

    <div
      v-for="port in infoStore.ports"
      :key="port.countryId"
      class="p-field flex flex-column col-3"
    >
      <label for="baseInfoPoints"> {{ port.countryName }}: </label>

      <multi-select
        id="baseInfoPoints"
        :model-value="data.point_of_loading_ids"
        :options="port.ports"
        filter
        option-label="name"
        option-value="id"
        aria-describedby="baseInfoPoints-help"
        class="my-1"
        :class="vv.point_of_loading_ids.$error ? 'p-invalid' : ''"
        :placeholder="$t('placeholders.portOfLoading')"
        :disabled="!infoStore.countries.length"
        panel-class="base-info-panel"
        @change="updateData('point_of_loading_ids', $event)"
      >
        <template #value="{ value, placeholder }">
          <template v-if="!getPortsValue(value, port).length">{{ placeholder }}</template>
          <template v-else>{{ getPortsValue(value, port).join(', ') }}</template>
        </template>
      </multi-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';

import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import PrimeTextarea from 'primevue/textarea';

import useInfoStore from '@/app/shared/store/info-store';
import useNotifications from '@/app/shared/services/hooks/notifications';

import errorMessage from '@/app/shared/utils/error-message';
import { baseInfoScheme } from '@/app/forwarders/shared/config/validation-schemes/base-info-scheme';

import type { ForwarderBaseInfo } from '@/@types/form-data';
import type { Port } from '@/@types/additional';

const props = defineProps({
  data: { type: Object as PropType<ForwarderBaseInfo>, required: true },
});

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();
const { onError } = useNotifications();

const isOtherReason = (id: number): boolean => {
  const current = infoStore.reasons.find((item) => item.id === id);

  return current?.alias === 'other';
};

const vv = useVuelidate(baseInfoScheme(props.data, isOtherReason), toRefs(props.data));

const updateData = (
  key: keyof ForwarderBaseInfo,
  { target, value }: { target?: HTMLInputElement; value: unknown }
): void => {
  emit('update-data', { key, value: target?.value || value });

  vv.value[key].$model = target?.value || value;
};

const isActiveModel = computed({
  get() {
    return props.data.is_active;
  },

  set(value: boolean) {
    updateData('is_active', { value });
    vv.value.is_active.$model = value;
  },
});

const waysModel = computed({
  get() {
    return props.data.way_ids;
  },

  set(value: number[]) {
    updateData('way_ids', { value });
    vv.value.way_ids.$model = value;
  },
});

watch(
  () => props.data.is_active,
  (value) => {
    if (value) {
      updateData('reason_id', { value: null });
      vv.value.reason_id.$model = null;

      updateData('reason_comment', { value: null });
      vv.value.reason_comment.$model = null;

      vv.value.$reset();
    }
  }
);

watch(
  () => props.data.reason_id,
  (value) => {
    if (value != 4) {
      updateData('reason_comment', { value: null });
      vv.value.reason_comment.$model = null;

      vv.value.$reset();
    }
  }
);

infoStore.getReasons().catch((error) => onError(error));
infoStore.getWays().catch((error) => onError(error));

const getPortsValue = (value: number[], item: Port): string[] => {
  const ports = item.ports.map((port) => port.id);
  const portIds = value.filter((id: number) => ports.includes(id));

  return item.ports.reduce((values: string[], port) => {
    if (portIds.includes(port.id)) values.push(port.name);

    return values;
  }, []);
};
</script>
