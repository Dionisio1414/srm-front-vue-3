<template>
  <p>
    {{ $t(`order.statusesDescription.${alias}`) }}
  </p>
</template>

<script lang="ts" setup>
defineProps({
  alias: { type: String, required: true },
});
</script>
