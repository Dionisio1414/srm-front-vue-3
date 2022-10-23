<template>
  <nav class="main-navigation flex flex-column align-items-center w-10rem h-full p-5">
    <router-link class="block mt-2 mb-8" to="/">
      <prime-image src="/images/logo.svg" alt="User avatar" image-class="w-5rem h-5rem" />
    </router-link>

    <template v-for="(item, index) in NAVIGATION">
      <router-link
        v-if="!item.disabled"
        :key="index"
        :to="item.path"
        active-class="--is-active"
        :class="{ '--is-active': item.routes.includes($route.name) }"
        class="navigation-button"
        v-tooltip="{
          value: $t(item.message),
        }"
      >
        <font-awesome-icon :icon="item.icon" size="2x" />
      </router-link>

      <button
        v-else
        :key="`disabled-${index}`"
        class="navigation-button --is-disabled"
        type="button"
        v-tooltip="{
          value: $t('messages.inDeveloping'),
          disabled: !item.disabled,
        }"
      >
        <font-awesome-icon :icon="item.icon" size="2x" />
      </button>
    </template>

    <button type="button" class="navigation-button --is-logout mt-auto" @click="onLogout">
      <font-awesome-icon icon="right-from-bracket" size="2x" />
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faClipboardList,
  faRightFromBracket,
  faShip,
  faBoxes,
  faUsers,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

import vTooltip from 'primevue/tooltip';
import PrimeImage from 'primevue/image';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useNotification from '@/app/shared/services/hooks/notifications';
import useLoginStore from '@/app/login/shared/store/login-store';

import { NAVIGATION } from '@/app/shared/config/navigation-constants';

library.add(faClipboardList, faRightFromBracket, faShip, faBoxes, faUsers, faCog);

const loginStore = useLoginStore();
const router = useRouter();
const { t } = useI18n();

const { onSuccess } = useNotification();

const callback = () => {
  router.push({ name: 'login' });
};

const onLogout = () => {
  loginStore.logout();
  onSuccess(t('messages.successfulLogout'), callback);
};
</script>

<style>
.main-navigation {
  color: var(--surface-0);
}

.navigation-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  color: var(--surface-0);
  border-radius: 0.5rem;
  transition: color 0.2s ease, background 0.2s ease;
}

.navigation-button:not(.--is-logout) {
  margin-top: 2rem;
  background-color: var(--orange-light);
}

.navigation-button.--is-disabled {
  cursor: not-allowed;
}

.navigation-button.--is-logout:hover,
.navigation-button.--is-logout:focus,
.navigation-button:not(.--is-logout):not(.--is-disabled):hover,
.navigation-button:not(.--is-logout):not(.--is-disabled):focus,
.navigation-button.--is-active {
  background-color: var(--surface-0);
  color: var(--primary-color);
}
</style>
