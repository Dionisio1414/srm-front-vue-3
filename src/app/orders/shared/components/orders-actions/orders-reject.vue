<template>
  <prime-dialog
    v-model:visible="modalState"
    modal
    :header="$t('orders.actions.reject.popupHeader')"
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
            :options="statusReasons"
            option-label="alias"
            option-value="id"
            :placeholder="$t('order.placeholders.reason')"
            class="my-2 w-full"
            :class="vv.reasonId.$error ? 'p-invalid' : ''"
          >
            <template #value="{ value, placeholder }">
              <template v-if="value">
                {{
                  $t(`order.reasons.${statusReasons.find((reason) => reason.id === value)?.alias}`)
                }}
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
            :placeholder="$t('orders.actions.reject.commentPlaceholder')"
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
        :label="$t('orders.actions.reject.popupCancel')"
        class="p-button-outlined p-button-danger"
        @click="onClose()"
      />

      <prime-button
        form="rejectForm"
        :label="$t('orders.actions.reject.popupConfirm')"
        type="submit"
        :disabled="vv.$invalid"
        class="p-button-success"
      />
    </template>
  </prime-dialog>

  <prime-button
    class="p-button-outlined p-button-danger"
    :label="$t('orders.actions.reject.rejectLabel')"
    :disabled="loading"
    @click="onOpen()"
  />
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import PrimeDialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import PrimeTextarea from 'primevue/textarea';
import PrimeButton from 'primevue/button';

import useModal from '@/app/shared/services/hooks/modal';

import { rejectSchema } from '@/app/order/shared/config/validation-schemes';
import { Reason } from '@/@types/additional';

defineProps({
  statusReasons: { type: Array as PropType<Reason[]>, required: true },
  loading: { type: Boolean, required: true },
});

const emit = defineEmits(['change-status']);

const { modalState, onOpen, onClose } = useModal();

const state = reactive({ reasonId: null, comment: '' });

const vv = useVuelidate(rejectSchema, state, { $stopPropagation: true });

const clearState = () => {
  state.reasonId = null;
  state.comment = '';
  vv.value.$reset();
};

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    emit('change-status', {
      status_id: 8,
      reason_id: state.reasonId,
      comment: state.comment,
    });

    clearState();
    onClose();
  }
};
</script>
