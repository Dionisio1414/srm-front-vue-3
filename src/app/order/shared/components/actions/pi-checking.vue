<template>
  <prime-dialog
    v-if="$can('create', 'Order.files.pi')"
    v-model:visible="modalState"
    modal
    :header="translate(alias, 'piUploadTitle')"
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
          <p>{{ $t('order.files.attachFile') }}</p>
        </template>
      </file-upload>
    </block-ui>
  </prime-dialog>

  <prime-button
    v-if="$can('create', 'Order.files.pi')"
    class="p-button-outlined mt-2 mr-2"
    :class="`p-button-${script.class}`"
    :label="translate(alias, script.alias)"
    @click="onOpen()"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import { useRoute } from 'vue-router';

import PrimeDialog from 'primevue/dialog';
import BlockUi from 'primevue/blockui';
import FileUpload from 'primevue/fileupload';
import PrimeButton from 'primevue/button';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTranslation from '@/app/order/shared/services/hooks/translations';
import useModal from '@/app/shared/services/hooks/modal';
import useFilesLoad from '@/app/shared/services/hooks/files-load';

import type { StatusHistoryScenario, StatusHistoryStatus } from '@/@types/order';

const props = defineProps({
  alias: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
  script: { type: Object as PropType<StatusHistoryScenario>, required: true },
});

const emit = defineEmits(['change-status']);

const route = useRoute();
const orderStore = useOrderStore();
const { onSuccess, onError } = useNotification();
const { getScenarioTranslate: translate } = useTranslation();
const { modalState, onOpen, onClose } = useModal();

const onLoad = async (guid: string, formData: FormData) => {
  await orderStore
    .addFile(guid, 'pi', formData)
    // TODO: translate
    .then(() => onSuccess(`${formData.get('filename')} load`))
    .catch((error) => onError(error));
};

const { disabled, clearInstance, onUploader } = useFilesLoad(
  onLoad.bind(null, route.params.guid as string),
  () => {
    onClose();
    emit('change-status', { statusId: props.script.id });
  }
);
</script>
