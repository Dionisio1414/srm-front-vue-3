<template>
  <component
    :is="multiple ? MultiSelect : Dropdown"
    :options="options"
    :model-value="modelValue"
    :disabled="isLoading"
    :option-label="label"
    option-value="id"
    @change="$emit('update-model-value', $event)"
  />
</template>

<script lang="ts" setup>
import { computed, PropType, Ref, ref, watch } from 'vue';

import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

import useNotification from '@/app/shared/services/hooks/notifications';

import { getWays, getForwarderTariffs, getIncoterms } from '@/app/shared/services/api/info-api';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { Way, Tariff, Incoterm } from '@/@types/additional';

type DataTypes = 'ways' | 'tariffs' | 'incoterms';

const props = defineProps({
  modelValue: { type: [String, Number, Array] },
  multiple: { type: Boolean, default: () => false },
  type: { type: String as PropType<DataTypes>, required: true },
});

const emit = defineEmits(['update-model-value']);

const { onError } = useNotification();

const options: Ref<Way[] | Tariff[] | Incoterm[]> = ref([]);
const isLoading = ref(false);

const label = computed(() => {
  switch (props.type) {
    case 'tariffs':
      return 'tariff';

    case 'incoterms':
      return 'incoterm';

    default:
      return 'name';
  }
});

const getData = async (type: DataTypes): Promise<void> => {
  isLoading.value = true;

  let data;

  try {
    if (type === 'ways') {
      data = await getWays();
    } else if (type === 'tariffs') {
      data = await getForwarderTariffs();
    } else if (type === 'incoterms') {
      data = await getIncoterms();
    }

    options.value = data || [];
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const getIncotermId = (id: string | number, options: Incoterm[]): string | number => {
  if (typeof id === 'string') {
    const option = options.find((option) => option.incoterm === id);

    return option?.id || id;
  }

  return id;
};

getData(props.type);

const optionsWatcher = watch(options, (options) => {
  if (props.type === 'incoterms') {
    const id = getIncotermId(props.modelValue as string, options as Incoterm[]);

    emit('update-model-value', { value: id, initial: true });
    optionsWatcher();
  }
});
</script>
