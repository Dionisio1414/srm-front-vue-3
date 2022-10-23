<template>
  <div class="flex align-items-start justify-content-between">
    <div>
      <template v-for="(key, index) in editedFields">
        <div
          v-if="checkExtraFields(key)"
          :key="index"
          class="mb-2"
          style="word-break: break-word"
          v-html="
            $t('order.changeMessage', {
              key: $t(`order.${type === 'order' ? 'changesKeys' : 'productsChangesKeys'}.${key}`),
              previousValue: getValue(key, previous) || 'null',
              currentValue: getValue(key, current) || 'null',
            })
          "
        />
        <div
          v-else
          v-for="value in differenceCurrentPorts"
          :key="`${value.port}_${index}`"
          class="mb-2"
          style="word-break: break-word"
          v-html="
            $t('order.changePortMessage', {
              key: $t('order.changesKeys.port_of_loadings'),
              type: value?.deliveryType,
              previousValue: getPortValue(value, 'previous'),
              currentValue: getPortValue(value, 'current'),
            })
          "
        />

        <div
          v-if="key === 'deleted_at'"
          :key="index"
          class="mb-2"
          style="word-break: break-word"
          v-html="$t('order.productsChangesKeys.deleted_at')"
        />
      </template>
    </div>

    <small class="flex-shrink-0 w-9rem text-right" style="margin-top: 0.1rem">
      {{ formatDate(current.created_at, true) }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import objectDifference from '@/app/shared/utils/object-difference';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import type { OrderLog, LogsPortsOfLoading, LogsPortOfLoading } from '@/@types/order';
import cloneDeep from 'lodash.clonedeep';

type PortTypes = 'current' | 'previous';

const EXCLUDED_FIELDS = ['guid', 'user_id', 'aws_country_id', 'created_at'];

const PRODUCTS_EXCLUDED_FIELDS = [
  'guid',
  'product_guid',
  'article_id',
  'article_no',
  'brand_name',
  'brand_no',
  'category_name_de',
  'category_name_en',
  'category_name_ru',
  'name',
  'product_plan_id',
  'tecdoc_id',
  'user_id',
  'created_at',
  'category_code',
  'pcs_in_box',
  'current_oe',
  'price_eur',
];

const props = defineProps({
  type: { type: String as PropType<'order' | 'products'>, default: () => 'order' },
  current: { type: Object as PropType<OrderLog>, required: true },
  previous: { type: Object as PropType<OrderLog>, required: true },
});

const extraPortFields = (type: string, data: OrderLog) => {
  const cloneData = cloneDeep(data);

  if (type === 'order' && !Array.isArray(cloneData.port_of_loadings)) {
    Object.keys(cloneData?.port_of_loadings).forEach((key) => {
      delete cloneData?.port_of_loadings[key as keyof LogsPortsOfLoading].logGuid;
    });

    return { ...data, port_of_loadings: cloneData?.port_of_loadings };
  }

  return data;
};

const differenceCurrentPorts = computed(() => {
  const current = Object.values(cloneDeep(props?.current.port_of_loadings ?? {}));
  const previous = Object.values(cloneDeep(props?.previous.port_of_loadings ?? {}));

  return current?.filter((currentPort) => {
    return !previous.some((previousPort) => currentPort.portGuid === previousPort.portGuid);
  });
});

const differencePreviousPorts = computed(() => {
  const previous = Object.values(cloneDeep(props.previous.port_of_loadings));
  const current = differenceCurrentPorts.value;

  return previous.filter((previousPort) => {
    return current.some(
      (currentPort) => previousPort.deliveryTypeId === currentPort.deliveryTypeId
    );
  });
});

const editedFields = computed(() =>
  objectDifference(
    extraPortFields(props.type, props.current),
    extraPortFields(props.type, props.previous),
    props.type === 'order' ? EXCLUDED_FIELDS : PRODUCTS_EXCLUDED_FIELDS
  )
);

const checkExtraFields = computed(
  () => (key: string) => !!(key !== 'port_of_loadings' && key !== 'deleted_at')
);

const getValue = (key: keyof OrderLog, data: OrderLog) =>
  String(key.includes('date') ? formatDate(data[key] as string) : data[key]);

const getPortValue = (data: LogsPortOfLoading, type: PortTypes) => {
  switch (type) {
    case 'current': {
      return data?.port || 'null';
    }

    case 'previous': {
      return (
        differencePreviousPorts.value.find((item) => item.deliveryTypeId === data.deliveryTypeId)
          ?.port || 'null'
      );
    }

    default: {
      return 'null';
    }
  }
};
</script>
