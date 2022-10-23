import { computed, ComputedRef, onBeforeUnmount, Ref, ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { generateLabels } from '@/app/order/shared/services/api';

import type { FileStatus } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

interface FilesController {
  isGenerateLabels: Ref<boolean>;
  isGeneratePi: Ref<boolean>;
  piFileStatus: ComputedRef<FileStatus | undefined>;
  labelFileStatus: ComputedRef<FileStatus | undefined>;
  generatePiAccept: ComputedRef<boolean>;
  generateLabelsHandler: () => Promise<void>;
  generatePiHandler: () => void;
  getOrderFiles: () => void;
  getSeverity: (status: 'generating' | 'generated' | 'error') => 'error' | 'info' | 'success';
}

function filesController(): FilesController {
  const route = useRoute();
  const { t } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();
  const orderStore = useOrderStore();
  const { onError, onCustomError } = useNotification();

  const timeoutId = ref();
  const isGenerateLabels = ref(false);
  const isGeneratePi = ref(false);

  const piFileStatus = computed(() => orderStore.piFileStatus);
  const labelFileStatus = computed(() => orderStore.labelFileStatus);
  const generatePiAccept = computed(() => orderStore.generatePiAccept);

  const getOrderFiles = (hideLoader = false) => {
    orderStore.getFiles(route.params.guid as string, hideLoader).catch((error) => onError(error));
  };

  const generateLabelsHandler = async () => {
    try {
      isGenerateLabels.value = true;

      await generateLabels(route.params.guid as string);

      orderStore.getFileStatus(route.params.guid as string);
    } catch (error) {
      if ((error as CustomError).response.status === 500) {
        onCustomError({
          response: {
            status: 500,
            data: {
              errors: [],
              message: t('order.files.errorGenerateLabel', {
                guid: orderStore.order.orderNumber,
              }),
            },
          },
        });
      } else {
        onError(error as CustomError);
      }
    } finally {
      isGenerateLabels.value = false;
    }
  };

  const generatePi = async () => {
    try {
      isGeneratePi.value = true;

      await orderStore.generatePi(orderStore.order.guid);
    } catch (error) {
      onError(error as CustomError);
    } finally {
      isGeneratePi.value = false;
    }
  };

  const generatePiHandler = () => {
    confirm.require({
      header: t('order.files.generatePi.header'),
      message: t('order.files.generatePi.message'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('order.files.buttons.accept'),
      rejectLabel: t('order.files.buttons.cancel'),
      accept: generatePi,
    });
  };

  const getFilesStatus = () => {
    orderStore.getFileStatus(route.params.guid as string);
  };

  const getSeverity = (
    status: 'generating' | 'generated' | 'error'
  ): 'error' | 'info' | 'success' => {
    switch (status) {
      case 'error':
        return 'error';

      case 'generating':
        return 'info';

      case 'generated':
        return 'success';

      default:
        return 'success';
    }
  };

  const fileStatusHandler = (status?: FileStatus, previous?: FileStatus) => {
    if (status?.status === 'generating') {
      if (timeoutId.value) clearTimeout(timeoutId.value);

      timeoutId.value = setTimeout(getFilesStatus, 10000);
    } else if (status?.status === 'generated' && previous?.status !== 'generated') {
      getOrderFiles(true);
    } else if (status?.status === 'error') {
      toast.add({
        severity: 'error',
        detail: status.type === 'order_label' ? status.message : t('messages.errorLimitMessage'),
        life: 5000,
      });
    }
  };

  watch(piFileStatus, fileStatusHandler);
  watch(labelFileStatus, fileStatusHandler);

  onBeforeUnmount(() => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
  });

  return {
    isGenerateLabels,
    isGeneratePi,
    piFileStatus,
    labelFileStatus,
    generatePiAccept,
    generateLabelsHandler,
    generatePiHandler,
    getOrderFiles,
    getSeverity,
  };
}

export default filesController;
