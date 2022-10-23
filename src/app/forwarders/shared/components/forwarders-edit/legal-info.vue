<template>
  <panel toggleable v-model:collapsed="isCollapsed" :header="$t('forwarder.titles.legalInfo')">
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

    <form novalidate @submit.prevent="onSubmit">
      <legal-info-item
        v-for="(data, index) in formData.data"
        :key="index"
        :index="index"
        :data="data"
        :is-readonly="isReadonly"
        :is-loading="isLoading"
        :can-delete="formData.data.length > 1"
        @update-data="updateData"
        @delete-data="deleteLegalInformation"
      />

      <div v-if="!isReadonly || isLoading" class="flex justify-content-end mt-3">
        <prime-button
          :label="$t('forwarder.buttons.cancel')"
          type="button"
          :disabled="isLoading"
          class="p-button-danger mr-3 text-base"
          @click="onCancel"
        />

        <prime-button
          type="button"
          :label="$t('forwarder.buttons.addLegalInfo')"
          class="mr-3 text-base"
          :disabled="isLoading"
          @click="addLegalInfo"
        />

        <prime-button
          :label="$t('forwarder.buttons.saveChanges')"
          type="submit"
          :loading="isLoading"
          class="p-button-success text-base"
        />
      </div>
    </form>
  </panel>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from 'vue';

import { useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import cloneDeep from 'lodash.clonedeep';

import Panel from 'primevue/panel';
import PrimeButton from 'primevue/button';

import useNotification from '@/app/shared/services/hooks/notifications';

import { updateLegalInfo } from '@/app/forwarders/shared/services/api';
import {
  customValidator,
  legalStructure,
} from '@/app/forwarders/shared/config/validation-schemes/legal-scheme';

import LegalInfoItem from '@/app/forwarders/shared/components/forwarders-edit/legal-info-item.vue';

import type { ForwarderItemLegal } from '@/@types/forwarder';
import type { ForwarderLegal } from '@/@types/form-data';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

const props = defineProps({
  data: { type: Array as PropType<ForwarderItemLegal[]>, required: true },
});

const emit = defineEmits(['update-data']);

const route = useRoute();
const vv = useVuelidate();
const { onSuccess, onError } = useNotification();

const createFormData = (data: ForwarderItemLegal[]): ForwarderLegal[] =>
  data.map((legal) => ({
    guid: legal.guid,
    iban: legal.bank_details.iban,
    id_legal: legal.id_legal,
    is_active: legal.is_active,
    is_primary: legal.is_primary,
    legal_address: legal.legal_address,
    legal_name: legal.legalName,
    swift_code: legal.bank_details.swift_code,
    the_payee: legal.bank_details.the_payee,
    vat_id: legal.bank_details.vat_id,
    zip_code: legal.zip_code,
  }));

const formData: { data: ForwarderLegal[] } = reactive({
  data: cloneDeep(createFormData(props.data)),
});

const isLoading = ref(false);
const isReadonly = ref(true);
const isCollapsed = ref(false);

const onSubmit = async () => {
  vv.value.$touch();

  const customErrors = customValidator(formData.data);

  if (!vv.value.$invalid && !customErrors.length) {
    isLoading.value = true;

    try {
      const data = await updateLegalInfo(route.params.guid as string, formData.data);

      onSuccess(data.message);
    } catch (error: unknown) {
      onError(error as CustomError);
    } finally {
      emit('update-data');
      isReadonly.value = true;
      isLoading.value = false;
    }
  }

  if (customErrors.length) {
    const errorObj = {
      response: {
        status: 400,
        data: { message: '', errors: [customErrors] },
      },
    };

    onError(errorObj);
  }
};

const deleteLegalInformation = async (index: number): Promise<void> => {
  const clone = cloneDeep(formData.data);

  clone.splice(index, 1);
  formData.data = clone;
};

const addLegalInfo = () => {
  const clone = cloneDeep(legalStructure);
  const dataClone = cloneDeep(formData.data);

  clone.guid = '';
  clone.is_primary = false;
  clone.is_active = false;

  dataClone.push(clone);

  formData.data = dataClone;
};

const updateData = ({
  index,
  key,
  value,
}: {
  index: number;
  key: keyof ForwarderLegal;
  value: never;
}) => {
  const clone = cloneDeep(formData.data[index]);
  const dataClone = cloneDeep(formData.data);

  clone[key] = value;
  dataClone[index] = clone;

  formData.data = dataClone;
};

const onCancel = () => {
  isReadonly.value = true;
  emit('update-data');
};

watch(
  () => props.data,
  (data) => {
    const formattedData = createFormData(cloneDeep(data));

    formData.data = formattedData;
  }
);
</script>
