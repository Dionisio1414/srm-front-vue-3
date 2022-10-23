<template>
  <base-template :tabs="BASE_TABS" :showActions="showActions">
    <template #title>
      {{ $t(`orders.titles.${$route.name}`) }}
    </template>

    <template #filters>
      <orders-badges
        v-if="!updated"
        :type="$route.name.replace('-list', '')"
        :badge-statuses="badgeStatuses"
        @update-filters="updateFilters($event)"
      />
    </template>

    <template #actions>
      <orders-actions @reset-actions="resetActions" />
    </template>

    <template #default>
      <router-view v-if="!filtersUpdated" @reset-badges="resetBadgesStatusesHandler" />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import { watch } from 'vue';

import { useRoute } from 'vue-router';

import useForceUpdate from '@/app/shared/services/hooks/force-update';
import useBadgeFilters from '@/app/orders/shared/services/hooks/badge-filters';
import useTableSelectedCustomers from '@/app/orders/shared/services/hooks/table-selected-customers';

import BASE_TABS from '@/app/orders/shared/config/tabs-constants';

import BaseTemplate from '@/app/shared/components/base-template.vue';
import OrdersBadges from '@/app/orders/shared/components/orders-badges.vue';
import OrdersActions from '@/app/orders/shared/components/orders-actions/orders-actions.vue';

const route = useRoute();

const { updated, forceUpdate } = useForceUpdate();
const { filtersUpdated, badgeStatuses, updateFilters, resetBadgesStatusesHandler } =
  useBadgeFilters();

const { showActions, resetActions } = useTableSelectedCustomers();

watch(() => route.name, forceUpdate);
</script>
