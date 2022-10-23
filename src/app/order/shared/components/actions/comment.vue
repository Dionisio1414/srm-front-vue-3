<template>
  <prime-dialog
    v-if="$can('create', 'Order.comment')"
    v-model:visible="modalState"
    modal
    :header="$t('order.titles.commentModal')"
    style="width: 40rem"
  >
    <form id="commentForm" @submit.prevent="onSubmit">
      <div class="grid align-items-start">
        <label for="comment" class="col-fixed w-10rem mt-2 text-lg">
          {{ translate(status.alias, 'popupTheme') }}
        </label>

        <div class="col">
          <prime-textarea
            id="comment"
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
        :label="translate(status.alias, 'popupCancelTitle')"
        class="p-button-outlined p-button-danger"
        @click="onClose()"
      />
      <prime-button
        form="commentForm"
        :loading="isLoading"
        :disabled="vv.$invalid"
        :label="translate(status.alias, 'popupOkTitle')"
        type="submit"
        class="p-button-success"
      />
    </template>
  </prime-dialog>

  <prime-button
    v-if="$can('create', 'Order.comment')"
    class="p-button-outlined p-button-success mt-2 mr-2"
    :label="translate(status.alias, 'openPopupButtonText')"
    @click="onOpen()"
  />
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import PrimeDialog from 'primevue/dialog';
import PrimeTextarea from 'primevue/textarea';
import PrimeButton from 'primevue/button';

import useTranslation from '@/app/order/shared/services/hooks/translations';
import useModal from '@/app/shared/services/hooks/modal';

import { commentSchema } from '@/app/order/shared/config/validation-schemes';

import type { StatusHistoryStatus } from '@/@types/order';

const props = defineProps({
  isLoading: { type: Boolean, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
});

const emit = defineEmits(['change-comment', 'rollback-status']);

const { getCommentTranslate: translate } = useTranslation();
const { modalState, onOpen, onClose } = useModal();

const state = reactive({ comment: '' });

const vv = useVuelidate(commentSchema, state, { $stopPropagation: true });

const clearState = () => {
  state.comment = '';
  vv.value.$reset();
};

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    emit('change-comment', {
      statusId: props.status.id,
      comment: state.comment,
      callback: () => {
        clearState();
        onClose();
      },
    });
  }
};
</script>
