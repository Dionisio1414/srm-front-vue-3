<template>
  <div class="grid align-items-center justify-content-center max-w-max h-full mx-auto">
    <div class="col-4 mr-4">
      <h1 class="text-4xl">{{ $t('errorPage.title') }}</h1>

      <p class="not-found-text text-2xl">{{ $t('errorPage.description') }}</p>

      <router-link :to="path" class="no-underline">
        <prime-button
          :label="$t('errorPage.button')"
          type="button"
          class="p-button-text p-button-lg"
        />
      </router-link>
    </div>

    <div class="col-7 not-found-picture">
      <prime-image
        src="/images/error-picture.jpg"
        alt="Not found picture"
        image-class="h-auto max-w-full of-cover block"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import PrimeButton from 'primevue/button';
import PrimeImage from 'primevue/image';

import useLoginStore from '@/app/login/shared/store/login-store';

const loginStore = useLoginStore();

const path = computed(() =>
  loginStore.user.login === 'logistics' ? { name: 'forwarders' } : { name: 'orders' }
);
</script>

<style scoped>
.not-found-text {
  max-width: 27.58rem;
}
</style>
