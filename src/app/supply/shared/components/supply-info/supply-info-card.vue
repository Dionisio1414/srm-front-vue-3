<template>
  <div class="card relative px-4 pt-3 pb-5 h-full">
    <div class="card-header text-lg mb-5">
      <slot name="title" />
    </div>

    <div class="card-body">
      <span v-if="!editingAllowed" class="text-2xl font-bold">
        <slot name="value" />
      </span>

      <calendar
        v-else
        :model-value="originalDate"
        date-format="yy-mm-dd"
        :input-class="['p-inputtext-xs w-full text-xl font-bold']"
        @date-select="originalDate = transformDate(formatDate($event))"
      />
    </div>

    <template v-if="editable">
      <prime-button
        v-if="editingAllowed"
        type="button"
        class="absolute cursor-pointer p-button-sm p-button-rounded p-button-text p-1"
        style="top: 1rem; right: 4rem"
        @click="resetDate"
      >
        <font-awesome-icon icon="xmark" size="lg" />
      </prime-button>

      <prime-button
        type="button"
        class="absolute cursor-pointer p-button-sm p-button-rounded p-button-text p-1"
        style="top: 1rem; right: 1.5rem"
        :disabled="editingAllowed && !originalDate"
        @click="editableHandler"
      >
        <font-awesome-icon :icon="!editingAllowed ? 'pencil' : 'check'" size="lg" />
      </prime-button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import PrimeButton from 'primevue/button';
import Calendar from 'primevue/calendar';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

library.add(faPencil, faCheck, faXmark);

const props = defineProps({
  date: { type: String as () => string | null },
  editable: { type: Boolean, default: () => false },
});

const emit = defineEmits(['change-date']);

const editingAllowed = ref(false);
const originalDate = ref(props.date);

const transformDate = (value: string) => value.split('-').reverse().join('-').replace(/-/g, '.');

const resetDate = () => {
  originalDate.value = props.date ? props.date.replace(/-/g, '.') : props.date;
  editingAllowed.value = false;
};

const editableHandler = () => {
  if (!editingAllowed.value) {
    editingAllowed.value = true;
    originalDate.value = props.date ? props.date.replace(/-/g, '.') : props.date;
  } else {
    editingAllowed.value = false;

    emit('change-date', transformDate(originalDate.value as string));
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.625rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
}

.card-header {
  color: var(--gray-300);
}
</style>
