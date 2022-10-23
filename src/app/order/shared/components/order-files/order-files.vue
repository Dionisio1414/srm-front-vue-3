<template>
  <progress-bar
    v-if="orderStore.filesLoading || disabled || isGenerateLabels || isGeneratePi"
    mode="indeterminate"
    class="absolute"
    style="top: 0; right: 0; left: 1rem; z-index: 1110; height: 0.5rem"
  />

  <block-ui :blocked="edited || orderStore.filesLoading || disabled || isGenerateLabels">
    <panel :header="$t('order.files.title')">
      <tab-view>
        <tab-panel
          v-if="orderStore.files.generated_pi?.length || piFileStatus || generatePiAccept"
          :header="$t('order.files.generatedPi')"
        >
          <message
            v-if="piFileStatus"
            :closable="false"
            :severity="getSeverity(piFileStatus.status)"
          >
            {{
              $t(`order.fileStatus.${piFileStatus.type}.${piFileStatus.status}`, {
                number: orderStore.order.orderNumber,
              })
            }}
          </message>

          <order-file
            v-for="file in orderStore.files.generated_pi"
            :key="file.guid"
            type="generated_pi"
            :file-data="file"
            :status-id="orderStore.order.status?.id"
          />

          <prime-button
            v-if="generatePiAccept"
            type="button"
            class="mt-5"
            :label="$t('order.files.buttons.generatePi')"
            @click="generatePiHandler"
          />
        </tab-panel>

        <tab-panel v-if="orderStore.files.pi?.length" :header="$t('order.files.pi')">
          <order-file
            v-for="file in orderStore.files.pi"
            :key="file.guid"
            type="pi"
            :file-data="file"
            :status-id="orderStore.order.status?.id"
          />
        </tab-panel>

        <tab-panel
          v-if="
            orderStore.files.prepayment?.length ||
            orderStore.paymentUploadAllowed(orderStore.order.status?.id)
          "
          :header="$t('order.files.prepayment')"
        >
          <file-upload
            v-if="!clearInstance && orderStore.paymentUploadAllowed(orderStore.order.status?.id)"
            multiple
            custom-upload
            accept="
              .pdf, image/*,
              application/vnd.ms-excel,
              application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            "
            :max-file-size="20971520"
            :file-limit="3"
            :choose-label="$t('order.files.buttons.choose')"
            :upload-label="$t('order.files.buttons.upload')"
            :cancel-label="$t('order.files.buttons.cancel')"
            :invalid-file-size-message="
              $i18n.locale === 'en'
                ? '{0}: Invalid file size, file size should be smaller than {1}.'
                : '{0}: неверный размер файла, размер файла должен быть меньше {1}.'
            "
            :invalid-file-limit-message="
              $i18n.locale === 'en'
                ? 'Maximum number of files exceeded, limit is {0} at most.'
                : 'Превышено максимальное количество файлов, ограничение не более {0}.'
            "
            @uploader="onUploader($event, 'prepayment')"
          >
            <template #empty>
              <p>{{ $t('order.files.dragAndDrop') }}</p>
            </template>
          </file-upload>

          <order-file
            v-for="file in orderStore.files.prepayment"
            :key="file.guid"
            type="prepayment"
            :file-data="file"
            :status-id="orderStore.order.status?.id"
          />
        </tab-panel>

        <tab-panel :header="$t('order.files.other')">
          <message
            v-if="labelFileStatus"
            :closable="false"
            :severity="getSeverity(labelFileStatus.status)"
          >
            {{
              $t(`order.fileStatus.${labelFileStatus.type}.${labelFileStatus.status}`, {
                number: orderStore.order.orderNumber,
              })
            }}
          </message>

          <file-upload
            v-if="!clearInstance && $can('create', 'Order.files.other')"
            multiple
            custom-upload
            accept="
              .pdf, .csv, image/*,
              application/vnd.ms-excel,
              application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            "
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
            @uploader="onUploader($event, 'other')"
          >
            <template #empty>
              <p>{{ $t('order.files.dragAndDrop') }}</p>
            </template>
          </file-upload>

          <order-file
            v-for="file in orderStore.files.other"
            :key="file.guid"
            type="other"
            :file-data="file"
            :status-id="orderStore.order.status?.id"
          />

          <prime-button
            type="button"
            class="mt-5"
            :label="$t('order.files.buttons.generateLabels')"
            @click="generateLabelsHandler"
          />
        </tab-panel>
      </tab-view>
    </panel>
  </block-ui>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import Panel from 'primevue/panel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Message from 'primevue/message';
import BlockUi from 'primevue/blockui';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import PrimeButton from 'primevue/button';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useFilesLoad from '@/app/shared/services/hooks/files-load';
import useFilesController from '@/app/order/shared/services/hooks/files-controller';

import OrderFile from './order-file.vue';

defineProps({
  edited: { type: Boolean, required: true },
});

const route = useRoute();
const orderStore = useOrderStore();
const { onSuccess, onError } = useNotification();

const onLoad = (formData: FormData, type?: string) =>
  orderStore
    .addFile(route.params.guid as string, type as 'other' | 'prepayment', formData)
    // TODO: translate
    .then(() => onSuccess(`File ${formData.get('filename')} load`))
    .catch((error) => onError(error));

const {
  isGenerateLabels,
  isGeneratePi,
  piFileStatus,
  labelFileStatus,
  generatePiAccept,
  generateLabelsHandler,
  generatePiHandler,
  getOrderFiles,
  getSeverity,
} = useFilesController();

const { disabled, clearInstance, onUploader } = useFilesLoad(onLoad);

getOrderFiles();
</script>
