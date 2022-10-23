import { Ref, ref } from 'vue';

interface NotFound {
  modalVisibility: Ref<boolean>;
  notFoundHandler: () => void;
}

function notFound(): NotFound {
  const modalVisibility = ref(false);

  const notFoundHandler = (): void => {
    modalVisibility.value = true;
  };

  return { modalVisibility, notFoundHandler };
}

export default notFound;
