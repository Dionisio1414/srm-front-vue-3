import { onBeforeUnmount, Ref, ref, nextTick, onUpdated, watch } from 'vue';

import type { TableField } from '@/@types/table';

function tableFiltersObserver(selectedColumns?: Ref<TableField[]>): void {
  const observer: Ref<MutationObserver | null> = ref(null);
  const config = { attributes: true };

  const onChangeFilters = (isActive: boolean, element: HTMLElement): void => {
    const parent = element.closest('[role="cell"]');
    const isSort =
      parent?.getAttribute('aria-sort') && parent?.getAttribute('aria-sort') !== 'none';

    if (isActive && parent) parent.classList.add('p-highlight');
    else if (!isActive && parent && !isSort) parent.classList.remove('p-highlight');
  };

  const observerCallback = (mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const element = mutation.target as HTMLElement;
        const isActive = element.className.includes('p-column-filter-menu-button-active');

        onChangeFilters(isActive, element);
      }
    });
  };

  const initObserver = () => {
    const targetNodes = document.querySelectorAll('.p-column-filter-menu-button');
    observer.value = new MutationObserver(observerCallback);

    Array.from(targetNodes).forEach((targetNode) => {
      const isActive = targetNode.className.includes('p-column-filter-menu-button-active');

      onChangeFilters(isActive, targetNode as HTMLElement);

      if (observer.value) {
        observer.value.observe(targetNode, config);
      }
    });
  };

  const disconnectObserver = () => {
    if (observer.value) {
      observer.value.disconnect();
      observer.value = null;
    }
  };

  const forceUpdate = async () => {
    disconnectObserver();
    await nextTick();
    initObserver();
  };

  onUpdated(async () => {
    forceUpdate();
  });

  onBeforeUnmount(() => {
    disconnectObserver();
  });

  if (selectedColumns) {
    watch(
      () => selectedColumns.value,
      () => {
        forceUpdate();
      }
    );
  }
}

export default tableFiltersObserver;
