<template>
  <block-ui :blocked="blocked">
    <div
      class="file-item flex align-items-center p-3 mt-4 cursor-pointer"
      @click="onLoad(fileData)"
    >
      <font-awesome-icon :icon="['far', icon.type]" size="xl" :class="icon.color" />

      <span
        class="w-10 pr-3 ml-3 text-lg text-overflow-ellipsis overflow-hidden white-space-nowrap"
      >
        {{ fileData.fileName }}
      </span>

      <button
        type="button"
        class="flex align-items-center justify-content-center ml-1"
        style="color: currentColor"
        @click.stop="onRemove(fileData)"
      >
        <font-awesome-icon
          :icon="['far', 'circle-xmark']"
          size="xl"
          style="color: var(--red-classic)"
        />
      </button>
    </div>
  </block-ui>
</template>

<script lang="ts" setup>
import { PropType, toRef } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilePdf,
  faFileExcel,
  faFileZipper,
  faFile,
  faFileImage,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';

import BlockUi from 'primevue/blockui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useFileIcon from '@/app/shared/services/hooks/file-icon';
import useFileDelete from '@/app/shared/services/hooks/file-delete';
import useFileLoad from '@/app/shared/services/hooks/file-load';

import { getFileLink } from '@/app/supply/shared/services/api';

import type { FileInner, SupplyFiles } from '@/@types/additional';

library.add(faFilePdf, faFileExcel, faFileImage, faFileZipper, faFile, faCircleXmark);

const props = defineProps({
  type: { type: String as PropType<keyof SupplyFiles>, required: true },
  fileData: { type: Object as PropType<FileInner>, required: true },
});

const supplyStore = useSupplyStore();

const { icon } = useFileIcon(toRef(props.fileData, 'fileMime_Type'));

const removeFile = async (fileData: FileInner) =>
  supplyStore.deleteFile(props.type, fileData.guid as string);

const { blocked, onRemove } = useFileDelete(removeFile);

const { onLoad } = useFileLoad(getFileLink);
</script>
