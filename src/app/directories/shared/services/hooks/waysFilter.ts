import { computed, ComputedRef, watch } from 'vue';

import { RouteRecordName, useRoute, useRouter } from 'vue-router';

import useInfoStore from '@/app/shared/store/info-store';

import type { Way } from '@/@types/additional';

type WaysFilter = {
  wayIds: ComputedRef<number[]>;
  waysOptions: ComputedRef<Way[]>;
  changeWayIds: (wayIds: number[], oldWayIds: number[]) => void;
};

function waysFilter(callback: (wayIds: number[]) => void): WaysFilter {
  const route = useRoute();
  const router = useRouter();
  const infoStore = useInfoStore();

  const wayIds = computed(() =>
    (route.query.wayIds as string)?.split(',')?.map((item) => Number(item))
  );
  const waysOptions = computed(() => infoStore.ways);

  infoStore.getWays();

  const changeWayIds = (wayIds: number[], oldWayIds: number[]) => {
    router.push({
      name: route.name as RouteRecordName,
      query: { wayIds: wayIds.length ? wayIds.join(',') : oldWayIds.join(',') },
    });
  };

  watch(
    () => wayIds.value,
    (wayIds) => callback(wayIds)
  );

  return {
    wayIds,
    waysOptions,
    changeWayIds,
  };
}

export default waysFilter;
