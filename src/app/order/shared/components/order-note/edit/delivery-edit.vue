<template>
  <li class="my-1">
    <b>{{ $t('order.note.deliveryPort') }}</b>

    <ul class="list-none">
      <li class="flex align-items-center">
        {{ $t('order.deliveryPortTypes.ocean') }}

        <dropdown
          :model-value="modelValuePort(EDeliveryTypes.OCEAN)?.port_guid"
          :options="infoStore.deliveryPorts"
          option-value="guid"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :disabled="disabled"
          showClear
          @change="
            updatePortData({
              port_guid: $event.value,
              port_delivery_type_id: EDeliveryTypes.OCEAN,
            })
          "
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.deliveryPortTypes.air') }}

        <dropdown
          :model-value="modelValuePort(EDeliveryTypes.AIR)?.port_guid"
          :options="infoStore.deliveryPorts"
          option-value="guid"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :disabled="disabled"
          showClear
          @change="
            updatePortData({
              port_guid: $event.value,
              port_delivery_type_id: EDeliveryTypes.AIR,
            })
          "
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.deliveryPortTypes.rail') }}

        <dropdown
          :model-value="modelValuePort(EDeliveryTypes.RAIL)?.port_guid"
          :options="infoStore.deliveryPorts"
          option-value="guid"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :disabled="disabled"
          showClear
          @change="
            updatePortData({
              port_guid: $event.value,
              port_delivery_type_id: EDeliveryTypes.RAIL,
            })
          "
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.deliveryPortTypes.truck') }}

        <dropdown
          :model-value="modelValuePort(EDeliveryTypes.TRUCK)?.port_guid"
          :options="infoStore.deliveryPorts"
          option-value="guid"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :disabled="disabled"
          showClear
          @change="
            updatePortData({
              port_guid: $event.value,
              port_delivery_type_id: EDeliveryTypes.TRUCK,
            })
          "
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.deliveryPortTypes.sea+rw') }}

        <dropdown
          :model-value="modelValuePort(EDeliveryTypes['SEA+RW'])?.port_guid"
          :options="infoStore.deliveryPorts"
          option-value="guid"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :disabled="disabled"
          showClear
          @change="
            updatePortData({
              port_guid: $event.value,
              port_delivery_type_id: EDeliveryTypes['SEA+RW'],
            })
          "
        />
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';

import Dropdown from 'primevue/dropdown';

import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import type { InfoDelivery } from '@/@types/order';
import { EDeliveryTypes } from '@/app/order/shared/config/history-statuses-constants';
import { PortOfLoadingData } from '@/@types/form-data';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<InfoDelivery>, required: true },
  ports: { type: Array as PropType<PortOfLoadingData[]>, required: true },
});

const infoStore = useInfoStore();
const { onError } = useNotification();

const emit = defineEmits(['update-ports-data']);

const modelValuePort = computed(
  () => (id: number) => props.ports.find((item) => item.port_delivery_type_id === id)
);

const updatePortData = (value: PortOfLoadingData, initial = false) => {
  emit('update-ports-data', { value, initial });
};

infoStore.getDeliveryPorts().catch((error) => onError(error));
</script>
