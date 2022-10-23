<template>
  <form novalidate @submit.prevent="onSubmit">
    <base-info :data="base" @update-data="updateBaseData($event)" />

    <div class="flex align-items-center px-5">
      <divider align="left">
        <span class="text-xl">{{ $t('forwarder.titles.legalInfo') }}</span>
      </divider>

      <prime-button
        icon="pi pi-plus"
        class="p-button-outlined p-button-success p-button-sm flex-shrink-0 ml-3"
        @click="addLegalInfo"
      />
    </div>

    <legal-info
      v-for="(data, index) in legal"
      :key="index"
      :data="data"
      :index="index"
      :legal-info="legal"
      @remove-info="removeLegalInfo($event)"
      @update-data="updateLegalData($event)"
    />

    <div class="flex align-items-center px-5">
      <divider align="left">
        <span class="text-xl">{{ $t('forwarder.titles.contactInfo') }}</span>
      </divider>

      <prime-button
        icon="pi pi-plus"
        class="p-button-outlined p-button-success p-button-sm flex-shrink-0 ml-3"
        @click="addPerson"
      />
    </div>

    <contact-info
      :data="contact"
      :persons="contact.persons"
      @add-person="addPerson"
      @remove-person="removePerson"
      @update-data="updateContactData($event)"
      @update-person="updatePerson($event)"
    />

    <div class="flex align-items-center justify-content-center">
      <router-link :to="{ name: 'forwarders' }" class="no-underline">
        <prime-button
          :label="$t('forwarder.buttons.cancel')"
          type="button"
          :disabled="loading"
          class="p-button-danger w-10rem m-2"
        />
      </router-link>

      <prime-button
        :label="$t('forwarder.buttons.save')"
        type="submit"
        :loading="loading"
        class="p-button-success w-10rem m-2"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import useVuelidate from '@vuelidate/core';

import Divider from 'primevue/divider';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';
import useLoginStore from '@/app/login/shared/store/login-store';
import useForwarderStore from '@/app/forwarders/shared/store/forwarders-store';
import useNotifications from '@/app/shared/services/hooks/notifications';
import useForwarders from '@/app/forwarders/shared/services/hooks/forwarders';

import { customValidator } from '@/app/forwarders/shared/config/validation-schemes/legal-scheme';

import BaseInfo from '@/app/forwarders/shared/components/forwarders-create/base-info.vue';
import LegalInfo from '@/app/forwarders/shared/components/forwarders-create/legal-info.vue';
import ContactInfo from '@/app/forwarders/shared/components/forwarders-create/contact-info.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

const vv = useVuelidate();
const infoStore = useInfoStore();
const loginStore = useLoginStore();
const forwarderStore = useForwarderStore();

const loading = ref(false);

const {
  base,
  contact,
  legal,
  updateBaseData,
  addPerson,
  removePerson,
  updateContactData,
  updatePerson,
  addLegalInfo,
  removeLegalInfo,
  updateLegalData,
  resetFormData,
} = useForwarders();

const { onSuccess, onError, onCustomError } = useNotifications();

const successCallback = () => {
  resetFormData();
  vv.value.$reset();
};

const onSubmit = async () => {
  vv.value.$touch();

  const customErrors = customValidator(legal.value);

  if (!vv.value.$invalid && !customErrors.length) {
    loading.value = true;

    const formData = {
      ...base.value,
      contact: contact.value,
      legal_information: legal.value,
      user_id: loginStore.user.id,
    };

    try {
      await forwarderStore.createForwarder(formData);

      // TODO: translate
      onSuccess('Forwarder save successfully', successCallback);
    } catch (error) {
      onCustomError(error as CustomError);
    } finally {
      loading.value = false;
    }
  }

  if (customErrors.length) {
    const errorObj = {
      response: {
        status: 400,
        data: { message: '', errors: [customErrors] },
      },
    };

    onError(errorObj);
  }
};

const resetData = (resetPorts = true, resetCountries = true): void => {
  if (resetPorts) {
    infoStore.resetData('ports', [] as never);
  }
  if (resetCountries) {
    infoStore.resetData('countries', [] as never);
  }
};

const updateData = (isWays = true): void => {
  if (isWays) {
    const countries = infoStore.countries.map((country) => country.id);
    const countryIds = cloneDeep(base.value.country_ids).filter((id: number) =>
      countries.includes(id)
    );

    updateBaseData({ key: 'country_ids', value: countryIds as never });
  } else {
    const ports = infoStore.ports.map((port) => port.ports);
    const portIds = ports.reduce((ports: number[], port) => {
      ports.push(...port.map((item) => item.id));

      return ports;
    }, []);

    const availablePorts = base.value.point_of_loading_ids.filter((pointId: number) =>
      portIds.includes(pointId)
    );

    updateBaseData({ key: 'point_of_loading_ids', value: availablePorts as never });
  }
};

watch(
  () => base.value.way_ids,
  async (value: number[], oldValue: number[]): Promise<void> => {
    if (isEqual(value, oldValue)) return;

    if (value.length) {
      await infoStore.getCountries({ way_ids: value }).catch((error) => onError(error));
    } else {
      resetData();
    }

    updateData();
  },
  { deep: true }
);

watch(
  () => base.value.country_ids,
  async (value: number[], oldValue: number[]): Promise<void> => {
    const wayIds = infoStore.ways.map((way) => way.id);

    if (isEqual(value, oldValue)) return;

    if (value.length) {
      await infoStore
        .getPorts({ way_ids: wayIds, country_ids: value })
        .catch((error) => onError(error));
    } else {
      resetData(true, false);
    }

    updateData(false);
  },
  { deep: true }
);

infoStore.getAllCountries().catch((error) => onError(error));
resetData();
</script>
