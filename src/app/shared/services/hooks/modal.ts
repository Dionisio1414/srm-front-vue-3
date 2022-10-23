import { Ref, ref } from 'vue';

interface Modal {
  modalState: Ref<boolean>;
  onOpen: () => void;
  onClose: () => void;
}

function modal(): Modal {
  const modalState = ref(false);

  const onOpen = (callback?: () => void) => {
    modalState.value = true;

    if (callback) callback();
  };

  const onClose = (callback?: () => void) => {
    modalState.value = false;

    if (callback) callback();
  };

  return { modalState, onOpen, onClose };
}

export default modal;
