<template>
  <panel toggleable v-model:collapsed="isCollapsed" :header="$t('forwarder.titles.contactInfo')">
    <template #icons>
      <button
        v-if="isReadonly"
        class="p-panel-header-icon p-link p-mr-2"
        type="button"
        @click="
          () => {
            isReadonly = false;
            isCollapsed = false;
          }
        "
      >
        <span class="pi pi-pencil"></span>
      </button>
    </template>

    <template #default>
      <form novalidate @submit.prevent="onSubmit">
        <div class="grid align-items-center">
          <label for="edit-contactWebsite" class="col-fixed w-10rem">
            {{ $t('forwarder.contact.website') }}:
          </label>

          <div class="col">
            <input-text
              id="edit-contactWebsite"
              v-model="vv.website.$model"
              type="text"
              class="w-full p-inputtext-sm"
              :class="vv.website.$error ? 'p-invalid' : ''"
              :readonly="isReadonly || isLoading"
              :placeholder="$t('forwarder.contact.website')"
              v-tooltip="{
                value: errorMessage(vv.website.$errors),
                disabled: !errorMessage(vv.website.$errors),
              }"
            />
          </div>
        </div>

        <div class="grid align-items-center">
          <label for="edit-contactEmail" class="col-fixed w-10rem">
            {{ $t('forwarder.contact.email') }}:
          </label>

          <div class="col">
            <input-text
              id="edit-contactEmail"
              v-model="vv.email.$model"
              type="text"
              class="w-full p-inputtext-sm"
              :class="vv.email.$error ? 'p-invalid' : ''"
              :readonly="isReadonly || isLoading"
              :placeholder="$t('forwarder.contact.email')"
              v-tooltip="{
                value: errorMessage(vv.email.$errors),
                disabled: !errorMessage(vv.email.$errors),
              }"
            />
          </div>
        </div>

        <div class="grid align-items-center">
          <label for="edit-contactPhone" class="col-fixed w-10rem">
            {{ $t('forwarder.contact.phone') }}:
          </label>

          <div class="col">
            <input-text
              id="edit-contactPhone"
              v-model="vv.phone.$model"
              type="text"
              class="w-full p-inputtext-sm"
              :class="vv.phone.$error ? 'p-invalid' : ''"
              :readonly="isReadonly || isLoading"
              :placeholder="$t('forwarder.contact.phone')"
              v-tooltip="{
                value: errorMessage(vv.phone.$errors),
                disabled: !errorMessage(vv.phone.$errors),
              }"
            />
          </div>
        </div>

        <template v-if="isReadonly">
          <div
            v-for="person in data.persons"
            :key="person.guid"
            class="flex align-items-center my-2"
          >
            <span class="pi pi-user mr-3" style="font-size: 1.5rem"></span>

            <span>
              <b>{{ person.is_head ? 'Head,' : '' }}</b>
              {{ getCountry(person.country_id).name }}, {{ person.position }}, {{ person.name }},
              {{ person.phone }}, {{ person.email }}
            </span>
          </div>
        </template>

        <template v-else>
          <person-info
            v-for="(person, index) in formData.persons"
            :key="person.guid"
            :data="person"
            :index="index"
            :length="formData.persons.length"
            :is-loading="isLoading"
            @update-person="updatePerson"
            @delete-person="deletePerson"
          />
        </template>

        <div v-if="!isReadonly || isLoading" class="flex justify-content-end mt-3">
          <prime-button
            :label="$t('forwarder.buttons.cancel')"
            type="button"
            :disabled="isLoading"
            class="p-button-danger mr-3 text-base"
            @click="onCancel"
          />

          <prime-button
            :label="$t('forwarder.buttons.addPerson')"
            type="button"
            :disabled="isLoading"
            class="mr-3 text-base"
            @click="addPerson"
          />

          <prime-button
            :label="$t('forwarder.buttons.saveChanges')"
            type="submit"
            :loading="isLoading"
            class="p-button-success text-base"
          />
        </div>
      </form>
    </template>
  </panel>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { useVuelidate } from '@vuelidate/core';
import { useRoute } from 'vue-router';

import cloneDeep from 'lodash.clonedeep';

import vTooltip from 'primevue/tooltip';
import Panel from 'primevue/panel';
import InputText from 'primevue/inputtext';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';
import useNotifications from '@/app/shared/services/hooks/notifications';

import errorMessage from '@/app/shared/utils/error-message';
import { updateContactInfo } from '@/app/forwarders/shared/services/api';
import {
  contactScheme,
  contactsPersonStructure,
} from '@/app/forwarders/shared/config/validation-schemes/contacts-scheme';

import PersonInfo from '@/app/forwarders/shared/components/forwarders-edit/person-info.vue';

import type { ForwarderContactPerson } from '@/@types/form-data';
import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { ForwarderItemPerson } from '@/@types/forwarder';

const props = defineProps({
  data: { type: Object, required: true },
});

const emit = defineEmits(['update-data']);

const route = useRoute();
const infoStore = useInfoStore();

const { onError, onSuccess } = useNotifications();

const isLoading = ref(false);
const isReadonly = ref(true);
const isCollapsed = ref(false);

const getCountry = computed(() => infoStore.forwarderCountries);

const formatPersonsFields = (persons: ForwarderItemPerson[]) => {
  const cloned = cloneDeep(persons);

  return cloned?.map((person) => ({
    guid: person.guid,
    name: person.name,
    phone: person.phone,
    is_head: person.is_head,
    position: person.position,
    country_id: person.country_id,
    email: person.email,
  }));
};

const formData = reactive({
  email: props.data.email,
  phone: props.data.phone,
  website: props.data.website,

  persons: formatPersonsFields(props.data.persons),
});

const vv = useVuelidate(contactScheme, formData);

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    isLoading.value = true;

    try {
      const data = await updateContactInfo(route.params.guid as string, formData);

      onSuccess(data.message);
    } catch (error: unknown) {
      onError(error as CustomError);
    } finally {
      emit('update-data');
      isReadonly.value = true;
      isLoading.value = false;
    }
  }
};

type TUpdatePerson = { key: keyof ForwarderContactPerson; index: number; value: never };

const updatePerson = ({ key, index, value }: TUpdatePerson): void => {
  const cloned = cloneDeep(formData.persons);

  cloned[index][key] = value;
  formData.persons = cloned;
};

const addPerson = (): void => {
  const clone = cloneDeep(formData.persons);

  clone.push(cloneDeep(contactsPersonStructure));
  formData.persons = clone;
};

const deletePerson = (index: number) => {
  const clone = cloneDeep(formData.persons);

  clone.splice(index, 1);
  formData.persons = clone;
};

const onCancel = () => {
  isReadonly.value = true;
  emit('update-data');
};
</script>
