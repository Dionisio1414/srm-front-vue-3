import { ref, nextTick, Ref } from 'vue';

interface Update {
  updated: Ref<boolean>;
  forceUpdate: () => Promise<void>;
}

function update(): Update {
  const updated = ref(false);

  const forceUpdate = async () => {
    updated.value = true;
    await nextTick();
    updated.value = false;
  };

  return { updated, forceUpdate };
}

export default update;
