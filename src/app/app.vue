<template>
  <router-view v-if="route.name === 'login'" />

  <template v-else>
    <div class="main-navigation-container">
      <base-navigation />
    </div>

    <main class="main-content shadow-8">
      <transition>
        <progress-bar
          v-if="Boolean(showLoader)"
          mode="indeterminate"
          class="absolute top-0 right-0 left-0 h-1 border-noround"
          style="z-index: 2; height: 0.35rem; background-color: transparent"
        />
      </transition>

      <div class="main-content-container">
        <router-view />
      </div>
    </main>
  </template>

  <toast style="z-index: 2100" />

  <confirm-dialog class="w-30rem" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useRoute } from 'vue-router';

import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

import BaseNavigation from '@/app/shared/components/base-navigation.vue';

const route = useRoute();

const showLoader = ref(0);

document.addEventListener('show:loader', () => {
  showLoader.value += 1;
});
document.addEventListener('hide:loader', async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  showLoader.value -= 1;
});
</script>

<style>
.main-navigation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
}

.main-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  margin-left: 10rem;
  overflow: hidden;
  background-color: var(--surface-overlay);
  border-top-left-radius: 2.5rem;
  border-bottom-left-radius: 2.5rem;
}

.main-content-container {
  height: 100%;
  padding: 4rem 2rem;
  overflow-y: auto;
}
</style>
