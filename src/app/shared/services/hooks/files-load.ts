import { ref, nextTick, Ref } from 'vue';

interface FilesLoad {
  disabled: Ref<boolean>;
  clearInstance: Ref<boolean>;
  onUploader: ({ files }: { files: File[] }, type?: string) => Promise<void>;
}

function filesLoad(
  callback: (formData: FormData, type?: string) => Promise<void>,
  uploadCallback?: () => void
): FilesLoad {
  const disabled = ref(false);
  const clearInstance = ref(false);

  const uploadFile = async (file: File, type?: string): Promise<void> => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('filename', file.name);

    return callback(formData, type);
  };

  const clearLoaderInstance = async (): Promise<void> => {
    clearInstance.value = true;

    await nextTick();

    clearInstance.value = false;
  };

  const onUploader = async ({ files }: { files: File[] }, type?: string): Promise<void> => {
    disabled.value = true;

    await Promise.all(files.map((file) => uploadFile(file, type)));

    disabled.value = false;

    clearLoaderInstance();

    if (uploadCallback) uploadCallback();
  };

  return { disabled, clearInstance, onUploader };
}

export default filesLoad;
