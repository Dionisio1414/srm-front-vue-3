import { Ref, ref } from 'vue';

import { useClipboard } from '@vueuse/core';

interface CopyData {
  cm: Ref<{ show: (event: Event) => void }>;
  copyData: (data: string) => void;
  onRowContextMenu: (event: { originalEvent: Event }) => void;
}

function copyData(): CopyData {
  const cm = ref();
  const dataToCopy = ref('');

  const { copy } = useClipboard({ source: dataToCopy });

  const copyData = (data: string) => {
    dataToCopy.value = data;
    copy();
  };

  const onRowContextMenu = (event: { originalEvent: Event }) => {
    cm.value.show(event.originalEvent);
  };

  return { cm, copyData, onRowContextMenu };
}

export default copyData;
