<template>
  <prime-dialog
    :visible="modalVisibility"
    :header="$t('order.errorTitle')"
    :draggable="false"
    :modal="true"
    :closable="false"
    :close-on-escape="false"
    style="width: 50rem"
  >
    <p class="m-0 text-xl">
      {{
        $route.query.orderNumber
          ? $t('order.errorDescription', { number: $route.query.orderNumber })
          : $t('order.errorDescriptionWithout')
      }}
    </p>

    <template #footer>
      <prime-button :label="$t('order.returnBack')" type="button" @click="$emit('go-back')" />
    </template>
  </prime-dialog>
</template>

<script lang="ts" setup>
import { computed, WritableComputedRef } from 'vue';

import PrimeDialog from 'primevue/dialog';
import PrimeButton from 'primevue/button';

const props = defineProps({
  visibility: { type: Boolean, required: true },
});

const emit = defineEmits(['change-visibility', 'go-back']);

const modalVisibility: WritableComputedRef<boolean> = computed({
  get() {
    return props.visibility;
  },
  set(value) {
    emit('change-visibility', value);
  },
});
</script>
