<template>
  <progress-bar
    v-if="supplyStore.filesLoading || disabled"
    mode="indeterminate"
    class="absolute"
    style="top: 0; right: 0; left: 1rem; z-index: 1110; height: 0.5rem"
  />

  <block-ui :blocked="supplyStore.filesLoading || disabled">
    <panel :header="$t('supply.files.title')" class="shadow-2" style="border-radius: 0.6rem">
      <tab-view @tab-change="onChangeTab($event.index)">
        <tab-panel
          v-for="(tab, index) in FILES_TABS"
          :key="index"
          :header="$t(`supply.files.${tab.type}`)"
        >
          <template v-if="STATUSES_FOR_CHANGE.includes(supplyStore.supply.status?.id)">
            <template
              v-if="
                (tab.type === 'photo' && !supplyStore.supply.factory?.isReliableSupplier) ||
                tab.type !== 'photo'
              "
            >
              <file-upload
                v-if="!clearInstance"
                multiple
                custom-upload
                :accept="tab.fileTypes"
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
            </template>

            <template v-else>
              <div class="field-checkbox mt-4 mb-0">
                <checkbox :model-value="supplyStore.supply.factory?.isReliableSupplier" binary />

                <label class="ml-3">
                  {{ $t('supply.files.reliable') }}
                </label>
              </div>
            </template>
          </template>

          <template v-if="!updated">
            <supply-file
              v-for="(file, index) in supplyStore.files[type]"
              :key="index"
              :type="tab.type"
              :file-data="file"
            />
          </template>
        </tab-panel>
      </tab-view>
    </panel>
  </block-ui>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';

import { useRoute } from 'vue-router';

import ProgressBar from 'primevue/progressbar';
import BlockUi from 'primevue/blockui';
import Panel from 'primevue/panel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useFilesLoad from '@/app/shared/services/hooks/files-load';
import useForceUpdate from '@/app/shared/services/hooks/force-update';

import FILES_TABS from '@/app/supply/shared/config/tabs-constants';
import { STATUSES_FOR_CHANGE } from '@/app/supply/shared/config/history-statuses-constants';

import SupplyFile from '@/app/supply/shared/components/supply-files/supply-file.vue';

import type { SupplyFiles } from '@/@types/additional';

const route = useRoute();
const supplyStore = useSupplyStore();
const { onSuccess, onError } = useNotification();
const { updated, forceUpdate } = useForceUpdate();

const type: Ref<keyof SupplyFiles> = ref('ci');

const onChangeTab = (index: number) => {
  type.value = FILES_TABS[index].type as keyof SupplyFiles;
};

const onLoad = (formData: FormData): Promise<void> =>
  supplyStore
    .addFile(route.params.guid as string, type.value, formData)
    .then(() => onSuccess(`File ${formData.get('filename')} load`))
    .catch((error) => onError(error));

const { disabled, clearInstance, onUploader } = useFilesLoad(onLoad);

const getFiles = async (type: keyof SupplyFiles) => {
  await supplyStore.getFiles(route.params.guid as string, type);

  forceUpdate();
};

getFiles(type.value);

watch(type, (type) => {
  getFiles(type);
});
</script>
