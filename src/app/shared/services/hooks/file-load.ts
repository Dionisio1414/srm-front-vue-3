import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useNotification from '@/app/shared/services/hooks/notifications';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { FileInner } from '@/@types/additional';

interface FileLoad {
  onLoad: (fileData: FileInner) => Promise<void>;
}

function fileLoad(
  loadCallback: (guid: string, fileGuid: string) => Promise<{ _tmp_url: string }>
): FileLoad {
  const route = useRoute();
  const { t } = useI18n();
  const { onSuccess, onError } = useNotification();

  const onLoad = async (fileData: FileInner) => {
    try {
      const response = await loadCallback(route.params.guid as string, fileData.fileGuid);

      window.open(response._tmp_url, '_blank')?.focus();
      onSuccess(t('order.files.successLoad', { fileName: fileData.fileName }));
    } catch (error) {
      onError(error as CustomError);
    }
  };

  return { onLoad };
}

export default fileLoad;
