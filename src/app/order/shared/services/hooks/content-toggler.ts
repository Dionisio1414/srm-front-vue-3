import { onUpdated, Ref, ref } from 'vue';

interface ContentToggler {
  container: Ref<HTMLElement | null>;
  isHidden: Ref<boolean>;
  showButton: Ref<boolean>;
  changeVisibility: () => void;
}

function contentToggler(): ContentToggler {
  const container: Ref<HTMLElement | null> = ref(null);
  const isHidden = ref(true);
  const showButton = ref(false);

  const changeVisibility = () => {
    isHidden.value = !isHidden.value;
  };

  onUpdated(() => {
    const height = container.value?.offsetHeight || 0;

    showButton.value = height - 100 > 200;
    isHidden.value = height - 100 > 200;
  });

  return {
    container,
    showButton,
    isHidden,
    changeVisibility,
  };
}

export default contentToggler;
