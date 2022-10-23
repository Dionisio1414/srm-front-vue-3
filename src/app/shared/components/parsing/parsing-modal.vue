<template>
  <prime-dialog
    v-model:visible="modalVisibility"
    :header="
      type.includes('compare')
        ? comparisons
          ? $t('parsing.titles.compare')
          : $t('parsing.titles.main')
        : type === 'supply'
        ? $t('parsing.titles.supplyUpdate')
        : $t('parsing.titles.supply')
    "
    :draggable="false"
    :modal="true"
    :close-on-escape="false"
    style="width: 60%"
    @hide="$emit('close-modal')"
  >
    <message
      v-if="comparisonMessage && type.includes('compare')"
      :severity="isError ? 'error' : comparisons ? 'warn' : 'success'"
      @close="
        () => {
          comparisonMessage = '';
          isError = false;
        }
      "
    >
      {{ comparisonMessage }}
    </message>

    <template v-if="!comparisons">
      <parsing-file :disabled="isLoading" @change-file="changeFile" @remove-file="removeFile" />

      <form @submit.prevent="">
        <div class="flex justify-content-between">
          <div class="col-6 pr-3 pl-0">
            <general-fields
              :data="formData.general_fields"
              :disabled="isLoading"
              :type="type"
              @update-data="updateData"
            />

            <custom-fields
              v-if="type.includes('compare')"
              :data="formData.custom_fields"
              :disabled="isLoading"
              @update-data="updateData"
            />
          </div>

          <div class="col-6 pr-0 pl-3">
            <row-fields
              :start-row="formData.start_row"
              :end-row="formData.end_row"
              :supplier="supplier"
              :file-type="fileType"
              :disabled="isLoading"
              :type="type"
              @update-data="updateData"
              @update-supplier="supplier = $event"
              @update-file-type="fileType = $event"
            />
          </div>
        </div>
      </form>
    </template>

    <parsing-results
      v-else-if="comparisons && type.includes('compare')"
      :data="comparisons"
      :is-supply="type === 'compareSupply'"
      :supply-number="supplyNumber"
      :file-name="fileData.get('filename') || ''"
      :general-key="type.includes('compare') && type === 'compare' ? 'from_order' : 'from_supply'"
    />

    <template v-if="!comparisons" #footer>
      <div class="flex justify-content-center mt-5">
        <prime-button
          type="button"
          :label="$t('parsing.buttons.cancel')"
          :disabled="isLoading"
          class="p-button-danger p-button-outlined w-15rem mx-3"
          @click="$emit('close-modal')"
        />

        <prime-button
          v-if="type.includes('compare')"
          type="button"
          :label="$t('parsing.buttons.compare')"
          :loading="isLoading"
          :disabled="!fileData"
          class="p-button-success p-button-outlined w-15rem mx-3"
          @click="onCompare"
        />

        <prime-button
          v-if="type === 'supplier' || type === 'supplies'"
          type="button"
          :label="$t('parsing.buttons.createSupply')"
          :loading="isLoading"
          :disabled="!fileData"
          class="p-button-success p-button-outlined w-15rem mx-3"
          @click="onCreateSupply('create')"
        />

        <prime-button
          v-if="type === 'supply'"
          type="button"
          :label="$t('parsing.buttons.replaceProducts')"
          :loading="isLoading"
          :disabled="!fileData"
          class="p-button-success p-button-outlined w-15rem mx-3"
          @click="onCreateSupply('replace')"
        />

        <prime-button
          v-if="type === 'supply'"
          type="button"
          :label="$t('parsing.buttons.addProducts')"
          :loading="isLoading"
          :disabled="!fileData"
          class="p-button-success p-button-outlined w-15rem mx-3"
          @click="onCreateSupply('add')"
        />
      </div>
    </template>
  </prime-dialog>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, Ref } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';

import PrimeDialog from 'primevue/dialog';
import Message from 'primevue/message';
import PrimeButton from 'primevue/button';

import useOrderStore from '@/app/order/shared/store/order-store';
import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { compareData } from '@/app/shared/config/parsing/parsing-form-data';
import {
  loadCompareFile,
  compare,
  addSupplyFromFile,
  replaceSupplyProducts,
  addSupplyProducts,
  loadSupplyCompareFile,
  supplyCompare,
} from '@/app/shared/services/api/parsing-api';

import ParsingFile from '@/app/shared/components/parsing/parsing-file.vue';
import GeneralFields from '@/app/shared/components/parsing/fields/general-fields.vue';
import CustomFields from '@/app/shared/components/parsing/fields/custom-fields.vue';
import RowFields from '@/app/shared/components/parsing/fields/row-fields.vue';
import ParsingResults from '@/app/shared/components/parsing/parsing-results.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { ParsingFields, CompareData, ParsingType, SupplierShort } from '@/@types/additional';

const props = defineProps({
  visibility: { type: Boolean, required: true },
  type: {
    type: String as PropType<ParsingType>,
    required: true,
  },
});

const emit = defineEmits(['close-modal', 'callback']);

const route = useRoute();
const { t } = useI18n();
const orderStore = useOrderStore();
const supplyStore = useSupplyStore();
const { onSuccess, onError } = useNotification();

const orderNumber = computed(() => orderStore.order.orderNumber);
const supplyNumber = computed(() => supplyStore.supply.supplyNumber);

const isLoading = ref(false);
const formData: Ref<ParsingFields> = ref(cloneDeep(compareData(props.type)));

const modalVisibility = computed({
  get() {
    return props.visibility;
  },
  set() {
    emit('close-modal');
  },
});

const fileData: Ref<FormData | null> = ref(null);
const isError = ref(false);
const supplier: Ref<SupplierShort> = ref({} as SupplierShort);
const fileType = ref();
const comparisons: Ref<CompareData | null> = ref(null);
const comparisonMessage = ref('');

const vv = useVuelidate();

const updateData = ({ key, value }: { key: string; value: never }) => {
  const clone = cloneDeep(formData.value);
  set(clone, key, value);

  formData.value = clone;
};

const changeFile = (file: File) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('filename', file.name);

  fileData.value = formData;
};

const removeFile = () => {
  fileData.value = null;
};

const formatCompareResults = (comparisons: CompareData): CompareData => {
  const key =
    props.type.includes('compare') && props.type === 'compare' ? 'from_order' : 'from_supply';

  const clone = cloneDeep(comparisons);
  const general = cloneDeep(comparisons.general_fields);

  general.forEach((item, index) => {
    if (!item.from_file.article_no) {
      general[index].from_file.article_no = general[index][key].article_no || null;
    } else if (!item[key].article_no) {
      general[index][key].article_no = general[index].from_file.article_no;
    }
  });

  clone.general_fields = general;

  return clone;
};

const onCompare = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    isLoading.value = true;

    const fileName = fileData.value?.get('filename');

    try {
      let data;

      if (props.type === 'compare') {
        await loadCompareFile(route.params.guid as string, fileData.value);

        data = await compare(route.params.guid as string, formData.value);
      } else {
        const file = await loadSupplyCompareFile(route.params.guid as string, 'ci', fileData.value);

        data = await supplyCompare(
          route.params.guid as string,
          formData.value,
          file.supply_file_guid
        );
      }

      if (data.is_match) {
        comparisons.value = null;
        comparisonMessage.value = t(
          `parsing.${props.type === 'compare' ? 'haveNotDifferences' : 'haveNotSupplyDifferences'}`,
          {
            name: fileName,
            number: props.type === 'compare' ? orderNumber.value : supplyNumber.value,
          }
        );
      } else {
        comparisons.value = formatCompareResults(data);
        comparisonMessage.value = t(
          `parsing.${props.type === 'compare' ? 'haveDifferences' : 'haveSupplyDifferences'}`,
          {
            name: fileName,
            number: props.type === 'compare' ? orderNumber.value : supplyNumber.value,
          }
        );
      }
    } catch (error) {
      onError(error as CustomError);
      isError.value = true;
      comparisonMessage.value = t('parsing.haveError', {
        name: fileName,
        number: orderNumber.value,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const createFormData = (): FormData => {
  const data = new FormData();

  const supplierGuid =
    props.type === 'supplies'
      ? supplier.value.value
      : props.type === 'supply'
      ? supplyStore.supply.factory.guid
      : (route.params.guid as string);

  data.set('supplier_guid', supplierGuid);
  data.set('start_row', String(formData.value.start_row));
  data.set('end_row', String(formData.value.end_row));

  Object.entries(formData.value.general_fields).forEach(([key, value]) => {
    data.set(`general_fields[${key === 'price_usd' ? 'price' : key}]`, value);
  });

  data.set('file', fileData.value?.get('file') as Blob);
  data.set('file_type_id', fileType.value);

  return data;
};

const onCreateSupply = async (type: 'create' | 'replace' | 'add') => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    isLoading.value = true;

    try {
      if (type === 'create') {
        await addSupplyFromFile(createFormData());
      } else if (type === 'replace') {
        await replaceSupplyProducts(route.params.guid as string, createFormData());
      } else {
        await addSupplyProducts(route.params.guid as string, createFormData());
      }

      emit('callback');
      emit('close-modal');
      onSuccess(t(type === 'create' ? 'parsing.successMessage' : 'parsing.successUpdateMessage'));
    } catch (error) {
      onError({
        response: {
          status: 400,
          data: {
            message: t(type === 'create' ? 'parsing.errorMessage' : 'parsing.errorUpdateMessage'),
            errors: [],
          },
        },
      });
    } finally {
      isLoading.value = false;
    }
  }
};
</script>
