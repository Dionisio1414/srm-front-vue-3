<template>
  <block-ui :blocked="loading">
    <order-template>
      <template #left>
        <h2 class="m-0 text-2xl uppercase">{{ order.factory?.jurName }}</h2>

        <p
          v-if="order.factory?.legalAddress || order.factory?.address"
          class="m-0 mt-4 text-xl font-bold uppercase"
        >
          {{ order.factory.legalAddress || order.factory.address }}
        </p>

        <p v-if="order.factory?.phone" class="m-0 mt-4 text-xl">
          <b class="uppercase">{{ $t('order.factoryInformation.phone') }}</b>
          <span class="ml-2 text-lg">{{ order.factory.phone }}</span>
        </p>

        <p v-if="order.factory?.vatNumber" class="m-0 mt-4 text-xl">
          <b class="uppercase">{{ $t('order.factoryInformation.vatNumber') }}</b>
          <span class="ml-2 text-lg">{{ order.factory.vatNumber }}</span>
        </p>

        <p v-if="info?.proformaInvoice?.incoterms" class="m-0 mt-4 text-xl">
          <b class="uppercase">{{ $t('order.factoryInformation.termsOfDelivery') }}</b>
          <span class="ml-2 text-lg">{{ info.proformaInvoice.incoterms }}{{ city }}</span>
        </p>
      </template>

      <template #right>
        <div class="-mt-2">
          <div v-if="$can('view', 'Order.pi.number')" class="flex flex-column">
            <label for="piNumber" class="text-lg">{{ $t('order.labels.piNumber') }}</label>

            <div class="p-inputgroup my-2 shadow-1" style="border-radius: 0.6rem">
              <input-text
                id="piNumber"
                :model-value="data.pi_number.replace(`-${order.orderNumber}`, '')"
                :class="{ 'p-invalid': vv.pi_number.$error && editingAllowed }"
                :disabled="!editingAllowed || disabled"
                :placeholder="$t('order.placeholders.piNumber')"
                v-tooltip="{
                  value: errorMessage(vv.pi_number.$errors),
                  disabled: !errorMessage(vv.pi_number.$errors) || !editingAllowed,
                }"
                @keypress="isLetterHandler"
                @input="updateData('pi_number', $event?.target?.value + `-${order.orderNumber}`)"
              />

              <span class="p-inputgroup-addon w-6rem text-xl"> -{{ order.orderNumber }} </span>
            </div>
          </div>

          <div v-if="$can('view', 'Order.pi.date')" class="flex flex-column mt-3">
            <label for="piDate" class="text-lg">{{ $t('order.labels.piDate') }}</label>

            <div class="p-inputgroup my-2 shadow-1" style="border-radius: 0.375rem">
              <calendar
                id="piDate"
                :model-value="formatDate(data.pi_date)"
                :manual-input="false"
                date-format="yy-mm-dd"
                :placeholder="$t('order.placeholders.piDate')"
                :disabled="!editingAllowed || disabled"
                :input-class="[
                  'min-w-0 w-full',
                  { 'p-invalid': vv.pi_date.$error && editingAllowed },
                ]"
                v-tooltip="{
                  value: errorMessage(vv.pi_date.$errors),
                  disabled: !errorMessage(vv.pi_date.$errors) || !editingAllowed,
                }"
                @date-select="updateData('pi_date', formatDate($event))"
              />

              <span class="p-inputgroup-addon w-6rem text-xl">
                <font-awesome-icon :icon="['far', 'calendar']" size="lg" />
              </span>
            </div>
          </div>

          <div class="flex flex-column mt-3 mb-2">
            <label for="pltTime" class="text-lg">{{ $t('order.labels.pltTime') }}:</label>

            <div class="p-inputgroup my-2 shadow-1" style="border-radius: 0.6rem">
              <input-text
                id="pltTime"
                :model-value="data.max_lead_time"
                :class="{ 'p-invalid': vv.max_lead_time.$error && editingAllowed }"
                :disabled="!editingAllowed || disabled"
                :placeholder="$t('order.placeholders.pltTime')"
                maxlength="4"
                v-tooltip="{
                  value: errorMessage(vv.max_lead_time.$errors),
                  disabled: !errorMessage(vv.max_lead_time.$errors) || !editingAllowed,
                }"
                @keypress="isDigitHandler"
                @input="updateData('max_lead_time', +$event.target.value)"
              />
              <span class="p-inputgroup-addon w-6rem text-xl">
                {{ $t('order.labels.days') }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </order-template>

    <divider />

    <order-template>
      <template #left>
        <h3 class="m-0 text-xl uppercase">{{ $t('order.labels.buyer') }}:</h3>

        <h2 class="m-0 mt-3 text-2xl uppercase">Ridex GmbH</h2>

        <p class="m-0 mt-3 text-xl font-bold uppercase">Josef-Orlopp-Strasse 55, 10365 Berlin</p>

        <p class="m-0 mt-3 text-xl">
          <b class="uppercase">{{ $t('order.factoryInformation.phone') }}</b>
          <span class="ml-2 text-lg">+49 30 588 49 588</span>
        </p>
      </template>

      <template #right>
        <h3 class="m-0 text-xl uppercase">{{ $t('order.labels.shipperExporter') }}:</h3>

        <dropdown
          :model-value="data.exporter_id"
          filter
          show-clear
          :options="exporters"
          option-label="name"
          option-value="guid"
          class="mt-2 w-full shadow-1"
          :class="{ 'p-invalid': vv.exporter_id.$error && editingAllowed }"
          panel-class="w-10rem"
          :placeholder="$t('order.placeholders.shipperExporter')"
          :disabled="!editingAllowed || disabled"
          v-tooltip="{
            value: errorMessage(vv.exporter_id.$errors),
            disabled: !errorMessage(vv.exporter_id.$errors) || !editingAllowed,
          }"
          @change="updateData('exporter_id', $event.value)"
        >
          <template #value="{ value, placeholder }">
            <template v-if="value">{{ getExporterName(value) }}</template>
            <template v-else>{{ placeholder }}</template>
          </template>
        </dropdown>
      </template>
    </order-template>
  </block-ui>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, PropType, watch } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

import vTooltip from 'primevue/tooltip';
import BlockUi from 'primevue/blockui';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useInfoStore from '@/app/shared/store/info-store';
import useOrderStore from '@/app/order/shared/store/order-store';
import useNotifications from '@/app/shared/services/hooks/notifications';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import errorMessage from '@/app/shared/utils/error-message';
import { orderInfoSchema } from '@/app/order/shared/config/validation-schemes';

import OrderTemplate from '@/app/order/shared/components/order-template.vue';

import type { OrderInfoData } from '@/@types/form-data';
import type { InfoPortOfLoading } from '@/@types/order';

library.add(faCalendar);

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<OrderInfoData>, required: true },
  editingAllowed: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();
const orderStore = useOrderStore();
const { onError } = useNotifications();

const loading = ref(false);

const order = computed(() => orderStore.order);
const info = computed(() => orderStore.info);
const exporters = computed(() => infoStore.exporters);

infoStore.getExporters().catch((error) => onError(error));

const isLetterHandler = (e: KeyboardEvent) => !/^[\d\w]+$/.test(e.key) && e.preventDefault();
const isDigitHandler = (e: KeyboardEvent) => !/^\d+$/.test(e.key) && e.preventDefault();

const getExporterName = (id: number): string => {
  const defaultExporter = order.value.exporter;
  const exporter = exporters.value.find((exporter) => exporter.guid === Number(id));

  if (id && defaultExporter?.key === id) {
    return defaultExporter.label;
  }

  if (exporter) {
    return exporter.name;
  }

  return '';
};

const vv = useVuelidate(orderInfoSchema, toRefs(props.data));

const dataWatcher = watch(
  () => props.data,
  (data) => {
    Object.entries(data).forEach(([name, value]) => {
      vv.value[name].$model = value;
    });

    vv.value.$reset();

    dataWatcher();
  }
);

const updateData = (name: keyof OrderInfoData, value: never) => {
  emit('update-data', { name, value });

  vv.value[name].$model = value;
};

const portSortHandler = (a: InfoPortOfLoading, b: InfoPortOfLoading): number => {
  return a.orderBy - b.orderBy;
};

const portFilterHandler = (a: InfoPortOfLoading): boolean => {
  return Boolean(a.port);
};

const mainPort = computed(
  () =>
    Object.values(info.value.portOfLoading).filter(portFilterHandler)?.sort(portSortHandler)?.[0]
);
const city = computed(() =>
  info.value.proformaInvoice.incoterms === 'DAP' || info.value.proformaInvoice.incoterms === 'DDP'
    ? ', Berlin'
    : mainPort.value
    ? `, ${mainPort.value.port}`
    : ''
);
</script>

<style>
.p-dropdown-item {
  white-space: normal;
}
</style>
