<template>
  <component
    :is="multiple ? MultiSelect : Dropdown"
    :options="options"
    :data-key="type === 'category' ? 'label' : 'value'"
    option-label="label"
    :model-value="modelValue"
    :virtual-scroller-options="{
      lazy: true,
      onLazyLoad: onLazyLoad,
      itemSize: 50,
      showLoader: true,
      loading: loading,
      delay: 250,
    }"
    panel-class="hide-select-all-checkbox"
    scroll-height="25rem"
    @change="$emit('update-model-value', $event)"
  >
    <template #header>
      <div class="p-3">
        <input-text
          v-model="searchString"
          :placeholder="$t('placeholders.search')"
          type="text"
          class="w-full"
        />
      </div>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { PropType, Ref, ref, watch } from 'vue';

import debounce from 'lodash.debounce';
import cloneDeep from 'lodash.clonedeep';
import uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';

import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

import useNotification from '@/app/shared/services/hooks/notifications';

import {
  searchSupplier,
  searchForwarders,
  searchStrictForwarders,
  searchCategories,
} from '@/app/shared/services/api/search-api';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { SearchParams, SearchData } from '@/@types/request';
import type { Category, ForwarderShort, SupplierShort, SupplierSearch } from '@/@types/additional';

type Type = 'suppliers' | 'forwarders' | 'forwarders-strict' | 'category';
type SearchResponse =
  | SearchData<Category>
  | SearchData<ForwarderShort>
  | SearchData<SupplierShort>
  | SearchData<SupplierSearch>;

const props = defineProps({
  modelValue: { type: [Object, Array] as PropType<SupplierShort | SupplierShort[]> },
  wayIds: { type: Array as PropType<number[]>, default: () => null },
  multiple: { type: Boolean, default: () => false },
  type: { type: String as PropType<Type>, required: true },
});

const emit = defineEmits(['update-model-value']);

const { onError } = useNotification();

const options: Ref<SupplierShort[]> = ref([]);
const total = ref(0);

const loading = ref(false);
const ended = ref(false);

const page = ref(1);
const perPage = ref(50);
const searchString = ref('');

const getData = async (type: Type, payload: SearchParams): Promise<SearchResponse | undefined> => {
  loading.value = true;

  let data;

  try {
    if (type === 'suppliers') {
      data = await searchSupplier(payload);
    } else if (type === 'forwarders') {
      data = await searchForwarders(payload);
    } else if (type === 'forwarders-strict') {
      data = await searchStrictForwarders(payload);
    } else {
      data = await searchCategories(payload);
    }
  } catch (error) {
    onError(error as CustomError);
  } finally {
    loading.value = false;
  }

  return data;
};

const formatData = (
  data: (SupplierShort | ForwarderShort | Category | SupplierSearch)[]
): SupplierShort[] =>
  data.map((item) => {
    if ('id' in item) {
      return {
        value: String(item.id),
        label: item.code,
        way_ids: item.way_ids || [],
      };
    }

    if ('isMailApproved' in item) {
      return {
        value: item.guid,
        label: item.name,
        way_ids: item.way_ids || [],
      };
    }

    return item;
  });

const setData = (data: SearchResponse, overwrite: boolean, setTotal = true) => {
  if (overwrite) {
    page.value = 1;
    options.value = formatData(data.data || []);
  } else {
    options.value = cloneDeep(
      uniqBy(
        [...options.value, ...formatData(data.data)],
        props.type === 'category' ? 'label' : 'value'
      )
    );
  }

  if (setTotal) total.value = data.items_count || 0;
};

const onLazyLoad = async (event: { last: number }): Promise<void> => {
  const { last } = event;

  const loadingAvailable =
    last >= perPage.value * page.value && !ended.value && last < total.value && !loading.value;

  if (loadingAvailable) {
    page.value += 1;

    const payload = {
      page: page.value,
      perPage: perPage.value,
      query: searchString.value,
      wayIds: props.wayIds ? props.wayIds : null,
    };

    const data = await getData(props.type, payload);

    if (data) setData(data, false);
  }
};

const onSearch = debounce(async (value: string): Promise<void> => {
  page.value = 1;

  const payload = {
    page: page.value,
    perPage: perPage.value,
    query: value || null,
    wayIds: props.wayIds ? props.wayIds : null,
  };

  const data = await getData(props.type, payload);

  if (data) setData(data, true);
}, 700);

const getInitialData = async (): Promise<void> => {
  const payload = {
    page: page.value,
    perPage: perPage.value,
    query: searchString.value,
    wayIds: props.wayIds ? props.wayIds : null,
  };

  const data = await getData(props.type, payload);

  if (data) setData(data, true);
};

const getInitialValue = (
  model: SupplierShort,
  options: SupplierShort[]
): SupplierShort | undefined => options.find((option) => option.label === model.label);

const initWithDefaultValue = async (): Promise<void> => {
  const payload = {
    page: page.value,
    perPage: perPage.value,
    wayIds: props.wayIds ? props.wayIds : null,
  };

  const loadItem = async (model: SupplierShort) =>
    getData(props.type, { ...payload, query: model.label });

  if (Array.isArray(props.modelValue)) {
    const promises = props.modelValue.map(loadItem);
    const data = await Promise.all(promises);

    data.forEach((data, index) => {
      if (data) setData(data, index === 0, false);
    });
  } else {
    const data = await loadItem(props.modelValue || ({} as SupplierShort));

    if (data) setData(data, true, false);
  }

  const data = await getData(props.type, { ...payload, query: searchString.value });

  if (data) setData(data, false);

  if (props.type === 'category') {
    const model = getInitialValue(props.modelValue as SupplierShort, options.value);

    if (model) {
      emit('update-model-value', { value: model, initial: true });
    }
  }
};

if (props.modelValue) {
  initWithDefaultValue();
} else {
  getInitialData();
}

watch(searchString, onSearch);
watch(
  () => props.wayIds,
  (wayIds, oldWayIds) => {
    if (!isEqual(wayIds, oldWayIds)) {
      getInitialData();

      emit('update-model-value', { value: null, label: null });
    }
  }
);
</script>
