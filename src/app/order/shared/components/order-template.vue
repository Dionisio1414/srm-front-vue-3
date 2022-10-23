<template>
  <div class="grid justify-content-between m-0 mt-5">
    <div class="col-7 p-0">
      <slot name="left" />
    </div>

    <div class="col-4 p-0">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
