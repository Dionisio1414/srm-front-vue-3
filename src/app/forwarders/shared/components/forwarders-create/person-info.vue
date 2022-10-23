<template>
  <div class="grid m-0 align-items-start col-6">
    <div class="p-field flex flex-column col-6">
      <label :for="`person-${index}-name`"> *{{ $t('forwarder.contact.person.name') }}: </label>

      <input-text
        :id="`person-${index}-name`"
        :model-value="data.name || ''"
        :aria-describedby="`person-${index}-name-help`"
        class="my-1"
        :class="vv.name.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.contact.person.name')"
        @input="updatePersonData(index, 'name', $event)"
      />

      <small :id="`person-${index}-name-help`" :class="vv.name.$error ? 'p-error' : ''">
        {{ errorMessage(vv.name.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-6">
      <label :for="`person-${index}-position`">
        *{{ $t('forwarder.contact.person.position') }}:
      </label>

      <input-text
        :id="`person-${index}-position`"
        :model-value="data.position || ''"
        :aria-describedby="`person-${index}-position-help`"
        class="my-1"
        :class="vv.position.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.contact.person.position')"
        @input="updatePersonData(index, 'position', $event)"
      />

      <small :id="`person-${index}-position-help`" :class="vv.position.$error ? 'p-error' : ''">
        {{ errorMessage(vv.position.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-6">
      <label :for="`person-${index}-phone`"> *{{ $t('forwarder.contact.person.phone') }}: </label>

      <input-text
        :id="`person-${index}-phone`"
        :model-value="data.phone || ''"
        :aria-describedby="`person-${index}-phone-help`"
        class="my-1"
        :class="vv.phone.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.contact.person.phone')"
        @input="updatePersonData(index, 'phone', $event)"
      />

      <small :id="`person-${index}-phone-help`" :class="vv.phone.$error ? 'p-error' : ''">
        {{ errorMessage(vv.phone.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-6">
      <label :for="`person-${index}-email`"> *{{ $t('forwarder.contact.person.email') }}: </label>

      <input-text
        :id="`person-${index}-email`"
        :model-value="data.email || ''"
        :aria-describedby="`person-${index}-email-help`"
        class="my-1"
        :class="vv.email.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.contact.person.email')"
        @input="updatePersonData(index, 'email', $event)"
      />

      <small :id="`person-${index}-email-help`" :class="vv.email.$error ? 'p-error' : ''">
        {{ errorMessage(vv.email.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-6">
      <label :for="`person-${index}-country`">
        *{{ $t('forwarder.contact.person.country') }}:
      </label>

      <dropdown
        :id="`person-${index}-country`"
        :model-value="data.country_id"
        filter
        :options="countries"
        option-label="name"
        option-value="id"
        :aria-describedby="`person-${index}-country-help`"
        class="my-1"
        panel-class="w-15rem"
        :class="vv.country_id.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.contact.person.country')"
        @change="updatePersonData(index, 'country_id', $event)"
      />

      <small :id="`person-${index}-country-help`" :class="vv.country_id.$error ? 'p-error' : ''">
        {{ errorMessage(vv.country_id.$errors) }}
      </small>
    </div>

    <div class="p-field-checkbox col-12">
      <checkbox :id="`person-${index}-head`" binary v-model="isHeadModel" />

      <label :for="`person-${index}-head`">{{ $t('forwarder.contact.person.isHead') }}</label>
    </div>

    <div v-if="canBeRemoved" class="col-12 mt-3">
      <prime-button
        :label="$t('forwarder.buttons.removeContact')"
        class="p-button-outlined p-button-danger p-button-sm"
        @click="$emit('remove-person', index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, toRefs } from 'vue';
import { useVuelidate } from '@vuelidate/core';

import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';

import errorMessage from '@/app/shared/utils/error-message';
import { contactPersonScheme } from '@/app/forwarders/shared/config/validation-schemes/contacts-scheme';

import type { ForwarderContactPerson } from '@/@types/form-data';

const props = defineProps({
  index: { type: Number, required: true },
  canBeRemoved: { type: Boolean, required: true },
  data: { type: Object as PropType<ForwarderContactPerson>, required: true },
});

const emit = defineEmits(['update-person', 'remove-person']);

const infoStore = useInfoStore();

const vv = useVuelidate(contactPersonScheme, toRefs(props.data));

const countries = computed(() => infoStore.allCountries);

const updatePersonData = (
  index: number,
  key: keyof ForwarderContactPerson,
  { target, value }: { target?: HTMLInputElement; value: number | boolean }
): void => {
  emit('update-person', { key, index, value: target?.value || value });

  vv.value[key].$model = target?.value || value;
};

const isHeadModel = computed({
  get() {
    return props.data.is_head;
  },

  set(value: boolean) {
    updatePersonData(props.index, 'is_head', { value });
  },
});
</script>
