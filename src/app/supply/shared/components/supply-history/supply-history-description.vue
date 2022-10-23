<template>
  <p>
    {{ $t(`supply.statusHistory.descriptions.${alias}`) }}
  </p>
</template>

<script lang="ts" setup>
defineProps({
  alias: { type: String, required: true },
});
</script>
