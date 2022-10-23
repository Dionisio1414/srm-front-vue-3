<template>
  <prime-dialog
    v-if="$can('create', 'Order.files.prepayment')"
    v-model:visible="modalState"
    modal
    :header="$t('order.titles.attachOrder')"
    style="width: 40rem"
  >
    <block-ui :blocked="disabled">
      <file-upload
        v-if="!clearInstance"
        multiple
        custom-upload
        accept="
          .pdf, .csv, image/*,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        "
        :show-cancel-button="false"
        :max-file-size="20000000"
        :file-limit="3"
        :choose-label="$t('order.files.buttons.choose')"
        :upload-label="$t('order.files.buttons.upload')"
        :cancel-label="$t('order.files.buttons.cancel')"
        :invalid-file-size-message="
          $i18n.locale === 'en'
            ? '{0}: invalid file size, file size should be smaller than {1}.'
            : '{0}: неверный размер файла, размер файла должен быть меньше {1}.'
        "
        :invalid-file-limit-message="
          $i18n.locale === 'en'
            ? 'Maximum number of files exceeded, limit is {0} at most.'
            : 'Превышено максимальное количество файлов, ограничение не более {0}.'
        "
        @uploader="onUploader"
      >
        <template #empty>
          <p>{{ $t('order.files.dragAndDrop') }}</p>
        </template>
      </file-upload>
    </block-ui>
  </prime-dialog>

  <prime-button
    v-if="$can('create', 'Order.files.prepayment')"
    class="p-button-outlined p-button-success mt-2 mr-2"
    :label="$t('order.titles.attachOrder')"
    @click="onOpen()"
  />

  <prime-button
    v-if="$can('create', 'Order.files.prepayment')"
    class="p-button-outlined p-button-success mt-2 mr-2"
    :label="$t('order.titles.moveToProduction')"
    @click="changeStatus"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import PrimeDialog from 'primevue/dialog';
import BlockUi from 'primevue/blockui';
import FileUpload from 'primevue/fileupload';
import PrimeButton from 'primevue/button';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useModal from '@/app/shared/services/hooks/modal';
import useFilesLoad from '@/app/shared/services/hooks/files-load';

import { HISTORY_STATUSES } from '@/app/order/shared/config/history-statuses-constants';

import type { StatusHistoryStatus } from '@/@types/order';

defineProps({
  isLoading: { type: Boolean, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
});

const emit = defineEmits(['change-status']);

const route = useRoute();
const { t } = useI18n();
const orderStore = useOrderStore();
const { onSuccess, onError } = useNotification();
const { modalState, onOpen, onClose } = useModal();

const changeStatus = () => {
  emit('change-status', { statusId: HISTORY_STATUSES.STATUS_PRODUCTION_GREEN });
};

const onLoad = async (guid: string, formData: FormData): Promise<void> => {
  await orderStore
    .addFile(guid, 'prepayment', formData)
    .then(() => onSuccess(t('order.messages.fileLoad', { name: formData.get('filename') })))
    .catch((error) => onError(error));
};

const { disabled, clearInstance, onUploader } = useFilesLoad(
  onLoad.bind(null, route.params.guid as string),
  () => {
    onClose();
    changeStatus();
  }
);
</script>
