<template>
  <div class="grid" :class="[isLoading ? 'pointer-events-none opacity-50' : '']">
    <div class="col-3">
      <supply-info-card>
        <template #title>
          {{ $t('supply.supplyInfo.totalQty') }}
        </template>

        <template #value>
          {{ supply.total?.amount }}
        </template>
      </supply-info-card>
    </div>

    <div class="col-3">
      <supply-info-card>
        <template #title>
          {{ $t('supply.supplyInfo.totalSku') }}
        </template>

        <template #value>
          {{ supply?.totalSku }}
        </template>
      </supply-info-card>
    </div>

    <div class="col-3">
      <supply-info-card>
        <template #title>
          {{ $t('supply.supplyInfo.payments') }}
        </template>

        <template #value>
          {{ supply.total?.usd ? formatCurrency(supply.total.usd) : formatCurrency(0) }}
        </template>
      </supply-info-card>
    </div>

    <div class="col-3">
      <supply-info-card :date="supply.cargoReadyDate" editable @change-date="changeDate">
        <template #title>
          {{ $t('supply.supplyInfo.crd') }}
        </template>

        <template #value>
          {{
            supply.cargoReadyDate
              ? supply.cargoReadyDate.replaceAll('-', '.')
              : supply.cargoReadyDate
          }}
        </template>
      </supply-info-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { formatCurrency } from '@/app/shared/services/helpers/table-helpers';
import { changeCargoReadyDate } from '@/app/supply/shared/services/api';

import SupplyInfoCard from '@/app/supply/shared/components/supply-info/supply-info-card.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

const emit = defineEmits(['update-supply']);

const route = useRoute();
const supplyStore = useSupplyStore();
const { t } = useI18n();
const { onError, onSuccess } = useNotification();

const isLoading = ref(false);

const supply = computed(() => supplyStore.supply);

const changeDate = async (cargoReadyDate: string): Promise<void> => {
  try {
    isLoading.value = true;

    await changeCargoReadyDate(route.params.guid as string, cargoReadyDate);

    onSuccess(t('supply.supplyInfo.supplyCrdUpdated'));
    emit('update-supply');
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};
</script>
