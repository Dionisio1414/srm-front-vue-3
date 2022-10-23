<template>
  <div class="grid align-items-start p-5 m-0">
    <div class="grid col-6 align-items-start m-0">
      <div class="p-field flex flex-column col-6">
        <label for="contactWebsite"> {{ $t('forwarder.contact.website') }}: </label>

        <input-text
          id="contactWebsite"
          :model-value="data.website || ''"
          aria-describedby="contactWebsite-help"
          class="my-1"
          :class="vv.website.$error ? 'p-invalid' : ''"
          :placeholder="$t('forwarder.contact.website')"
          @input="updateData('website', $event)"
        />

        <small id="contactWebsite-help" :class="vv.website.$error ? 'p-error' : ''">
          {{ errorMessage(vv.website.$errors) }}
        </small>
      </div>

      <div class="p-field flex flex-column col-6">
        <label for="contactPhone"> {{ $t('forwarder.contact.phone') }}: </label>

        <input-text
          id="contactPhone"
          :model-value="data.phone || ''"
          aria-describedby="contactPhone-help"
          class="my-1"
          :class="vv.phone.$error ? 'p-invalid' : ''"
          :placeholder="$t('forwarder.contact.phone')"
          @input="updateData('phone', $event)"
        />

        <small id="contactPhone-help" :class="vv.phone.$error ? 'p-error' : ''">
          {{ errorMessage(vv.phone.$errors) }}
        </small>
      </div>

      <div class="p-field flex flex-column col-6">
        <label for="contactEmail"> {{ $t('forwarder.contact.email') }}: </label>

        <input-text
          id="contactEmail"
          :model-value="data.email || ''"
          aria-describedby="contactEmail-help"
          class="my-1"
          :class="vv.email.$error ? 'p-invalid' : ''"
          :placeholder="$t('forwarder.contact.email')"
          @input="updateData('email', $event)"
        />

        <small id="contactEmail-help" :class="vv.email.$error ? 'p-error' : ''">
          {{ errorMessage(vv.email.$errors) }}
        </small>
      </div>
    </div>

    <person-info
      v-for="(person, index) in persons"
      :key="index"
      :data="person"
      :index="index"
      :can-be-removed="persons.length > 1"
      @update-person="updatePersonData($event)"
      @remove-person="$emit('remove-person', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import InputText from 'primevue/inputtext';

import { contactScheme } from '@/app/forwarders/shared/config/validation-schemes/contacts-scheme';
import errorMessage from '@/app/shared/utils/error-message';

import PersonInfo from '@/app/forwarders/shared/components/forwarders-create/person-info.vue';

import type { ForwarderContact, ForwarderContactPerson } from '@/@types/form-data';

const props = defineProps({
  data: { type: Object as PropType<ForwarderContact>, required: true },
  persons: { type: Object as PropType<ForwarderContactPerson[]>, required: true },
});

const emit = defineEmits(['update-data', 'update-person', 'remove-person']);

const vv = useVuelidate(contactScheme, toRefs(props.data));

const updateData = (
  key: keyof ForwarderContact,
  { target }: { target: HTMLInputElement }
): void => {
  emit('update-data', { key, value: target.value });
  vv.value[key].$model = target.value;
};

type TUpdatePersonData = { index: number; key: string; value: string };

const updatePersonData = ({ index, key, value }: TUpdatePersonData): void => {
  emit('update-person', { key, index, value });
};
</script>
