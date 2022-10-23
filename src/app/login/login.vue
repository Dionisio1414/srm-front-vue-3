<template>
  <div
    class="flex flex-column relative overflow-hidden"
    style="
      height: 100vh;
      min-height: 54rem;
      padding: 6.25rem 12.5rem 9.375rem 47.5rem;
      background-color: var(--primary-color);
    "
  >
    <prime-image
      src="/images/login-background.svg"
      alt="Login page background"
      class="absolute top-0 left-0 h-full pointer-events-none"
      image-style="
        max-width: 40.5rem; height: 100%; object-fit: cover; object-position: right top"
    />

    <prime-image
      src="/images/login-wrench.svg"
      alt="Login background wrench"
      class="absolute pointer-events-none"
      style="right: 1.5rem; bottom: 1rem"
      image-style="height: 13.125rem"
    />

    <prime-image
      src="/images/login-logo.svg"
      alt="Login page logo"
      class="pointer-events-none"
      style="margin-bottom: 5rem"
      image-style="height: 6rem"
    />

    <h1
      style="
        margin: 0;
        margin-top: auto;
        color: var(--surface-0);
        font-size: 6.25rem;
        font-weight: 900;
        line-height: 1;
      "
    >
      Private Brands <br />
      SRM System
    </h1>

    <div
      v-if="commitTag"
      style="
        margin-top: 3.125rem;
        margin-bottom: auto;
        color: var(--surface-0);
        font-size: 1.875rem;
        font-weight: 500;
      "
    >
      v. {{ commitTag }}
    </div>

    <login-form style="margin-top: 5rem" />
  </div>
</template>

<script lang="ts" setup>
import PrimeImage from 'primevue/image';

import { commitTag } from '@/environment/environment';

import LoginForm from '@/app/login/shared/components/login-form.vue';
</script>
