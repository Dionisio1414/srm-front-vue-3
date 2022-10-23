<template>
  <file-upload
    :file-limit="1"
    accept="
      .csv, application/vnd.ms-excel,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    "
    :show-upload-button="false"
    :show-cancel-button="false"
    :disabled="disabled"
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
    @select="onSelect"
    @remove="onRemove"
  >
    <template #empty>
      <p>{{ $t('order.files.dragAndDrop') }}</p>
    </template>
  </file-upload>
</template>

<script lang="ts" setup>
import FileUpload from 'primevue/fileupload';

defineProps({
  disabled: { type: Boolean, required: true },
});

const emit = defineEmits(['change-file', 'remove-file']);

const onSelect = ({ files }: { files: File[] }) => {
  emit('change-file', files[0]);
};

const onRemove = () => {
  emit('remove-file');
};
</script>
