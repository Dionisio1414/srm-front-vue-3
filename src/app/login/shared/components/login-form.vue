<template>
  <form novalidate class="flex" @submit.prevent="onLogin">
    <input-text
      v-model="vv.login.$model"
      type="text"
      class="mr-4 uppercase"
      :class="vv.login.$error ? 'p-invalid' : ''"
      style="width: 18rem; padding-top: 0.875rem; padding-bottom: 0.875rem; font-weight: 700"
      :placeholder="$t('login.fields.user')"
    />

    <input-password
      id="password"
      v-model="vv.password.$model"
      :feedback="false"
      toggle-mask
      :class="[vv.password.$error ? 'p-invalid' : '', 'mr-4']"
      input-class="w-full"
      input-style="padding-top: 0.875rem; padding-bottom: 0.875rem; font-weight: 700"
      style="width: 18rem"
      :placeholder="$t('login.fields.password')"
    />

    <prime-button
      type="submit"
      class="p-button-secondary flex justify-content-center uppercase"
      style="width: 18rem; padding-top: 0.875rem; padding-bottom: 0.875rem; font-weight: 700"
      :disabled="isLoading"
    >
      <font-awesome-icon icon="right-to-bracket" size="lg" class="mr-4" />
      <span>{{ $t('login.confirm') }}</span>
    </prime-button>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import InputText from 'primevue/inputtext';
import InputPassword from 'primevue/password';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useLoginStore from '@/app/login/shared/store/login-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import { useRedirect } from '@/app/shared/utils/history';

import loginSchema from '@/app/login/shared/config/login-schema';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faRightToBracket);

const loginStore = useLoginStore();
const { t } = useI18n();
const { onSuccess, onError } = useNotification();

const { isLoading, callback } = useRedirect();

const state = reactive({ login: '', password: '' });
const vv = useVuelidate(loginSchema, state);

const onLogin = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    try {
      await loginStore.login(state.login, state.password);

      onSuccess(t('messages.successfulLogin'), callback);
    } catch (error) {
      onError(error as CustomError);
    }
  }
};
</script>
