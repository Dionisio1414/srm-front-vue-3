<template>
  <div class="order-number font-bold" v-text="orderNumber" />
</template>

<script lang="ts" setup>
defineProps({
  orderNumber: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.order-number {
  background: var(--yellow-classic);
  border-radius: 0.9rem;
  padding: 0.25rem 1rem;
  color: var(--text-color);
}
</style>
