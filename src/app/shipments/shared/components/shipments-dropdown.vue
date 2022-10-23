<template>
  <dropdown
    :model-value="modelValue"
    :options="filterOptions(options, filterWays)"
    :option-label="type === 'size' ? 'value' : 'type'"
    option-value="id"
    data-key="id"
    :disabled="!filterOptions(options, filterWays).length"
    scroll-height="25rem"
    @change="$emit('update-data', { value: $event.value, wayIds: getWays($event.value, options) })"
  />
</template>

<script lang="ts" setup>
import { PropType, Ref, ref, watch } from 'vue';

import isEqual from 'lodash.isequal';

import Dropdown from 'primevue/dropdown';

import useNotification from '@/app/shared/services/hooks/notifications';

import { getUnitTypes, getUnitSizes, getLoadingTypes } from '@/app/shared/services/api/info-api';

import type { UnitType, UnitSize, LoadingType } from '@/@types/additional';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

type Type = 'loadingType' | 'transportUnit' | 'size';

const props = defineProps({
  modelValue: { type: [String, Number] },
  wayIds: { type: Array as PropType<number[]>, required: true },
  filterWays: { type: Array as PropType<number[]>, required: true },
  type: { type: String as PropType<Type>, required: true },
});

const emit = defineEmits(['update-data']);

const { onError } = useNotification();

type Option = UnitType | UnitSize | LoadingType;
type Options = Option[];

const options: Ref<Options> = ref([]);

const getData = async (type: Type, wayIds: number[]): Promise<void> => {
  try {
    if (type === 'loadingType') {
      const data = await getLoadingTypes(wayIds);
      options.value = data;
    } else if (type === 'transportUnit') {
      const data = await getUnitTypes(wayIds);
      options.value = data;
    } else {
      const data = await getUnitSizes(wayIds);
      options.value = data;
    }
  } catch (error) {
    onError(error as CustomError);
  }
};

const filterOptions = (options: Options, filterWays: number[]) => {
  const filterHandler = (option: Option) => {
    const includesId = (id: number) => filterWays.includes(id);

    return option.way_ids.some(includesId);
  };

  return options.filter(filterHandler);
};

const getWays = (id: number, options: Options): number[] =>
  options.find((option: Option) => option.id === id)?.way_ids || [];

getData(props.type, props.wayIds);

watch(
  () => props.wayIds,
  (wayIds, oldIds) => {
    if (!isEqual(wayIds, oldIds)) {
      getData(props.type, wayIds);
      emit('update-data', null);
    }
  }
);
</script>
