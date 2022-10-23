<template>
  <div class="indicator font-semibold uppercase" :class="[`--is-${type}`]">
    {{ $t(`supply.files.${type}`) }}
  </div>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.indicator {
  border-radius: 4px;
  padding: 2px 9px;
}

.indicator.--is-photo {
  background: var(--green-light);
  color: var(--green);
}

.indicator.--is-hbl {
  background: var(--yellow-light);
  color: var(--yellow);
}

.indicator.--is-ci {
  background: var(--indigo-light);
  color: var(--indigo);
}

.indicator.--is-pay {
  background: var(--indigo-light);
  color: var(--indigo);
}

.indicator.--is-pl {
  background: var(--yellow-light);
  color: var(--yellow);
}
</style>
