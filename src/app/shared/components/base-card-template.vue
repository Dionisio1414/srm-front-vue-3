<template>
  <div class="grid m-0">
    <div class="col-12 p-0">
      <slot name="header" />
    </div>

    <div class="col-8 p-0 pr-3">
      <slot name="content" />
    </div>

    <div class="relative flex flex-column col-4 p-0 pl-3 mt-6">
      <slot name="sidebar" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
