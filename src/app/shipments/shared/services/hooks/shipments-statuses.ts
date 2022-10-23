import { computed, ComputedRef, watch } from 'vue';

import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import { useRoute } from 'vue-router';

import cloneDeep from 'lodash.clonedeep';

import useTablesStore, {
  SHIPMENTS_DEFAULT_FILTERS,
  BOOKING_SHIPMENTS_DEFAULT_FILTERS,
} from '@/app/shared/store/tables-store';
import useShipmentsStore from '@/app/shipments/shared/store/shipments-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import {
  ACTIVE_BOOKING_SHIPMENT,
  CANCELED_SHIPMENT,
} from '@/app/shipments/shared/config/shipments-statuses';
import { FILTERS_CONSTANTS } from '@/app/shipments/shared/config/filters-scheme-constants';

type ShipmentsType = {
  disabledIndex: ComputedRef<number | null>;

  moveToActive: (guid: string, index: number) => void;
  moveToCanceled: (guid: string, index: number) => void;
};

function shipmentsStatuses(): ShipmentsType {
  const route = useRoute();
  const tablesStore = useTablesStore();
  const shipmentsStore = useShipmentsStore();
  const { t: $t } = useI18n();
  const confirm = useConfirm();
  const { onSuccess, onError } = useNotification();

  const disabledIndex = computed(() => shipmentsStore.changeIndex);

  const getShipments = () => {
    shipmentsStore.getShipments(false).catch((error) => onError(error));
  };

  const typeChangeHandler = (type: number) => {
    const defaultFilters =
      type === 2
        ? cloneDeep(SHIPMENTS_DEFAULT_FILTERS)
        : cloneDeep(BOOKING_SHIPMENTS_DEFAULT_FILTERS);

    const filters = cloneDeep(FILTERS_CONSTANTS);

    defaultFilters.statusId = type;
    tablesStore.setPage('shipments', 1);
    tablesStore.setFilters('shipments', defaultFilters);
    tablesStore.setScheme('shipments', filters as never);

    getShipments();
  };

  const moveToActive = (guid: string, index: number) => {
    confirm.require({
      message: $t('shipments.messages.activeConfirm'),
      header: $t('shipments.messages.activeHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        shipmentsStore
          .changeStatus(guid, index, ACTIVE_BOOKING_SHIPMENT)
          .then(() => onSuccess($t('shipments.messages.movedToActive')))
          .catch((error) => onError(error));
      },
    });
  };

  const moveToCanceled = (guid: string, index: number) => {
    confirm.require({
      message: $t('shipments.messages.canceledConfirm'),
      header: $t('shipments.messages.canceledHeader'),
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: () => {
        shipmentsStore
          .changeStatus(guid, index, CANCELED_SHIPMENT)
          .then(() => onSuccess($t('shipments.messages.movedToCanceled')))
          .catch((error) => onError(error));
      },
    });
  };

  watch(route, (value) => {
    if (value.meta.statusId) {
      typeChangeHandler(Number(value.meta.statusId));
    }
  });

  return {
    disabledIndex,

    moveToActive,
    moveToCanceled,
  };
}

export default shipmentsStatuses;
