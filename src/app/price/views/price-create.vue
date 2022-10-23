<template>
  <form class="m-3" novalidate @submit.prevent="onSubmit">
    <base-information
      :data="baseInfo"
      :is-loading="isLoading"
      @update-data="updateBaseData($event)"
    />

    <div class="flex justify-content-center mt-5">
      <prime-button
        :label="$t('price.buttons.save')"
        type="submit"
        :loading="isLoading"
        class="p-button-success w-10rem mx-2"
      />

      <prime-button
        :label="$t('price.buttons.cancel')"
        type="button"
        :disabled="isLoading"
        class="p-button-danger w-10rem mx-2"
        @click="onReset"
      />
    </div>

    <block-ui :blocked="isLoading">
      <price-table
        v-model:selected="selectedUnits"
        :data="priceInfo.data"
        class="mt-2"
        @add-price="addPrice(selectedUnits)"
        @delete-price="deletePrice($event)"
        @update-data="updatePriceData($event)"
      />
    </block-ui>
  </form>
</template>

<script lang="ts" setup>
import { ref, toRef } from 'vue';

import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';

import PrimeButton from 'primevue/button';
import BlockUi from 'primevue/blockui';

import useNotification from '@/app/shared/services/hooks/notifications';
import useCreateData from '@/app/price/shared/services/hooks/create-data';
import useSelectedUnit from '@/app/price/shared/services/hooks/selected-unit';

import { createPrice } from '@/app/price/shared/services/api';
import { customValidator } from '@/app/price/shared/config/validation-schemes';

import BaseInformation from '@/app/price/shared/components/price-create/base-info.vue';
import PriceTable from '@/app/price/shared/components/price-create/price-table.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { PriceFormData } from '@/@types/form-data';

const { t } = useI18n();
const { onSuccess, onError } = useNotification();

const isLoading = ref(false);

const {
  baseInfo,
  priceInfo,
  addPrice,
  updateBaseData,
  updatePriceData,
  updateUnits,
  deletePrice,
  resetData,
} = useCreateData();

const { selectedUnits } = useSelectedUnit(toRef(baseInfo, 'way_ids'), updateUnits);

const vv = useVuelidate();

const onReset = () => {
  resetData();
  vv.value.$reset();
};

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid && !customValidator(priceInfo.data).length) {
    isLoading.value = true;

    const formData: PriceFormData = {
      ...baseInfo,
      forwarder_price_expance_list: priceInfo.data,
    };

    try {
      await createPrice(formData);

      onSuccess(t('price.messages.success'));
      resetData();
    } catch (error) {
      onError(error as CustomError);
    } finally {
      vv.value.$reset();
      isLoading.value = false;
    }
  } else {
    onError({
      response: {
        status: 400,
        data: { message: t('price.messages.validationError'), errors: [] },
      },
    });
  }
};
</script>
