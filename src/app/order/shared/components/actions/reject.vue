<template>
  <prime-dialog
    v-model:visible="modalState"
    modal
    :header="translate(alias, 'popupTheme')"
    style="width: 40rem"
  >
    <form id="rejectForm" @submit.prevent="onSubmit">
      <div class="grid align-items-center">
        <label for="rejectReason" class="col-fixed w-10rem text-lg">
          {{ $t('order.labels.reason') }}:
        </label>

        <div class="col">
          <dropdown
            id="rejectReason"
            v-model="vv.reasonId.$model"
            :options="reasons"
            option-label="alias"
            option-value="id"
            :placeholder="$t('order.placeholders.reason')"
            class="my-2 w-full"
            :class="vv.reasonId.$error ? 'p-invalid' : ''"
          >
            <template #value="{ value, placeholder }">
              <template v-if="value">
                {{ $t(`order.reasons.${reasons.find((reason) => reason.id === value)?.alias}`) }}
              </template>

              <template v-else>
                {{ placeholder }}
              </template>
            </template>

            <template #option="{ option }">
              {{ $t(`order.reasons.${option.alias}`) }}
            </template>
          </dropdown>
        </div>
      </div>

      <div class="grid align-items-start">
        <label for="rejectComment" class="col-fixed w-10rem mt-2 text-lg">
          {{ $t('order.labels.comment') }}:
        </label>

        <div class="col">
          <prime-textarea
            id="rejectComment"
            v-model="vv.comment.$model"
            auto-resize
            rows="5"
            :placeholder="translate(status.alias, 'popupPlaceholder')"
            class="w-full mb-2"
            :class="vv.comment.$error ? 'p-invalid' : ''"
          />
          <div>
            <span :class="vv.comment.$error && vv.comment.$dirty ? 'p-error' : ''">
              {{ vv.comment.$model.length }}
            </span>
            /
            {{ vv.comment.maxLength.$params.max }}
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <prime-button
        :label="translate(alias, 'popupCancelTitle')"
        class="p-button-outlined p-button-danger"
        @click="onClose()"
      />

      <prime-button
        form="rejectForm"
        :label="translate(alias, 'popupOkTitle')"
        type="submit"
        :loading="isLoading"
        :disabled="vv.$invalid"
        class="p-button-success"
      />
    </template>
  </prime-dialog>

  <prime-button
    class="p-button-outlined p-button-danger mt-2 mr-2"
    :label="translate(alias, script.alias)"
    @click="onOpen()"
  />
</template>

<script lang="ts" setup>
import { computed, PropType, reactive } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import PrimeDialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import PrimeTextarea from 'primevue/textarea';
import PrimeButton from 'primevue/button';

import useTranslation from '@/app/order/shared/services/hooks/translations';
import useModal from '@/app/shared/services/hooks/modal';

import { rejectSchema } from '@/app/order/shared/config/validation-schemes';

import type { StatusHistoryScenario, StatusHistoryStatus } from '@/@types/order';

const props = defineProps({
  alias: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
  script: { type: Object as PropType<StatusHistoryScenario>, required: true },
});

const emit = defineEmits(['change-status']);

const { getScenarioTranslate: translate } = useTranslation();
const { modalState, onOpen, onClose } = useModal();

const state = reactive({ reasonId: null, comment: '' });

const vv = useVuelidate(rejectSchema, state, { $stopPropagation: true });

const reasons = computed(() => props.script.reasons);

const clearState = () => {
  state.reasonId = null;
  state.comment = '';
  vv.value.$reset();
};

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    emit('change-status', {
      statusId: props.script.id,
      reasonId: state.reasonId,
      comment: state.comment,
      callback: () => {
        clearState();
        onClose();
      },
    });
  }
};
</script>
