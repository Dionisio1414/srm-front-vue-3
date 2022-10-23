import { Ref, ref } from 'vue';

import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';

import useNotification from '@/app/shared/services/hooks/notifications';

import type { FileInner } from '@/@types/additional';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

interface FileDelete {
  blocked: Ref<boolean>;
  onRemove: (fileData: FileInner) => void;
}

function fileDelete(callback: (fileData: FileInner) => Promise<void>): FileDelete {
  const confirm = useConfirm();
  const { t } = useI18n();
  const { onSuccess, onError } = useNotification();

  const blocked = ref(false);

  const removeFile = async (fileData: FileInner): Promise<void> => {
    blocked.value = true;

    try {
      await callback(fileData);

      onSuccess(t('order.files.successDelete', { fileName: fileData.fileName }));
    } catch (error) {
      onError(error as CustomError);
    } finally {
      blocked.value = false;
    }
  };

  const onRemove = (fileData: FileInner): void => {
    confirm.require({
      message: t('order.files.wantDelete'),
      header: t('order.files.deleteHeader'),
      acceptLabel: t('order.files.acceptLabel'),
      rejectLabel: t('order.files.rejectLabel'),
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',

      accept: removeFile.bind(null, fileData),
    });
  };

  return { blocked, onRemove };
}

export default fileDelete;
