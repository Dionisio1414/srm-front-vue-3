<template>
  <p v-for="comment in comments" :key="comment.guid">
    {{ comment.comment }}
  </p>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { StatusHistoryComment } from '@/@types/order';

defineProps({
  comments: { type: Array as PropType<StatusHistoryComment[]>, required: true },
});
</script>
