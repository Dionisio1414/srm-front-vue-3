<template>
  <p>{{ $t(`order.reasons.${reason}`) }}</p>
</template>

<script lang="ts" setup>
defineProps({
  reason: { type: String, required: true },
});
</script>
