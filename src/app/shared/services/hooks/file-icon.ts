import { computed, ComputedRef, Ref } from 'vue';

import ICON_CONSTANTS from '@/app/order/shared/config/icon-constants';

interface FileIcon {
  icon: ComputedRef<{ type: string; color: string }>;
}

function fileIcon(fileMimeType: Ref<string>): FileIcon {
  const icon = computed(() => {
    switch (fileMimeType.value) {
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return ICON_CONSTANTS.EXCEL;
      case 'image/png':
      case 'image/jpeg':
      case 'image/gif':
        return ICON_CONSTANTS.IMAGE;
      case 'application/pdf':
        return ICON_CONSTANTS.PDF;
      case 'application/zip':
        return ICON_CONSTANTS.FOLDER;
      default:
        return ICON_CONSTANTS.FILE;
    }
  });

  return { icon };
}

export default fileIcon;
