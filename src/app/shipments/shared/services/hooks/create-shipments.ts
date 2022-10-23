import { computed, ComputedRef, Ref, ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';

import useTablesStore from '@/app/shared/store/tables-store';
import useShipmentsStore from '@/app/shipments/shared/store/shipments-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { shipmentStructure, unitStructure } from '@/app/shipments/shared/config/shipment-constants';

import type { Shipments } from '@/@types/shipment';
import type { ShipmentsNew, ShipmentsNewUnit } from '@/@types/form-data';
import type { ItemState } from '@/app/shared/store/tables-store';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

type CreateShipments = {
  items: Ref<ShipmentsNew[]>;
  newItems: Ref<ShipmentsNew[]>;

  filtersState: ComputedRef<ItemState>;

  loadingIndex: Ref<number | null>;

  addShipment: () => void;
  deleteShipment: (index: number) => void;
  addTransportUnit: (index: number) => void;
  deleteTransportUnit: (index: number, innerIndex: number) => void;
  updateData: (key: string, value: unknown) => void;

  saveShipment: (index: number) => Promise<void>;
  disabled: (data: ShipmentsNew) => boolean;
  tuValid: (data: ShipmentsNewUnit) => boolean | string;
  sizeValid: (data: ShipmentsNewUnit) => boolean | string;
};

function createShipments(): CreateShipments {
  const tablesStore = useTablesStore();
  const shipmentsStore = useShipmentsStore();
  const { onSuccess, onError } = useNotification();
  const { t } = useI18n();

  const filtersState = computed(() => tablesStore.shipments);

  const items: Ref<ShipmentsNew[]> = ref([]);
  const newItems: Ref<ShipmentsNew[]> = ref([]);

  const loadingIndex: Ref<number | null> = ref(null);

  const createItems = (shipments: Shipments[]) => {
    const cloned: Shipments[] = cloneDeep(shipments);

    items.value = cloned.map(
      (item): ShipmentsNew => ({
        guid: item.guid,
        way_ids: item.wayIds,
        shipmentLoadingType: item.shipmentLoadingType.id,
        pointOfLoading: item.pointOfLoading,
        weight: item.weight,
        volume: item.volume,
        cargoReadyDate: item.cargoReadyDate,
        transportUnits: item.transportUnits.map((unit) => ({
          amount: unit.amount,
          size: unit.size.value,
          type: unit.type.name,
        })),

        supplier: {
          label: item.supplier.name,
          value: item.supplier.guid,
        },
        forwarder: {
          label: item.forwarder.name,
          value: item.forwarder.guid,
        },
      })
    );
  };

  const addShipment = () => {
    newItems.value.unshift({ isNew: true, ...cloneDeep(shipmentStructure), way_ids: [1] });
  };

  const deleteShipment = (index: number) => {
    const clone = cloneDeep(newItems.value);

    clone.splice(index, 1);

    newItems.value = clone;
  };

  const addTransportUnit = (index: number) => {
    const clone = cloneDeep(newItems.value);

    clone[index].transportUnits.push(cloneDeep(unitStructure));

    newItems.value = clone;
  };

  const deleteTransportUnit = (index: number, innerIndex: number) => {
    const clone = cloneDeep(newItems.value);
    const units = cloneDeep(clone[index].transportUnits);

    units.splice(innerIndex, 1);
    clone[index].transportUnits = units;

    newItems.value = clone;
  };

  const updateData = (key: string, value: unknown): void => {
    const clone = cloneDeep(newItems.value);

    set(clone, key, value);

    newItems.value = clone;
  };

  const saveShipment = async (index: number): Promise<void> => {
    loadingIndex.value = index;

    const formData = cloneDeep(newItems.value[index]);

    delete formData.isNew;
    delete formData.guid;

    try {
      await shipmentsStore.saveShipment(formData);
      await shipmentsStore.getShipments(true);

      onSuccess(t('shipments.messages.created'));
      deleteShipment(index);
    } catch (error) {
      onError(error as CustomError);
    } finally {
      loadingIndex.value = null;
    }
  };

  const tuValid = (data: ShipmentsNewUnit): boolean | string =>
    (data.amount && data.type) || (!data.amount && !data.type);

  const sizeValid = (data: ShipmentsNewUnit): boolean | string =>
    (data.size && data.type) || !data.size;

  const disabled = (data: ShipmentsNew): boolean => {
    const tuErrors = data.transportUnits.reduce((errors: number[], tu, index) => {
      if (!tuValid(tu)) errors.push(index);
      if (!sizeValid(tu)) errors.push(index);

      return errors;
    }, []);

    return !(
      data.way_ids.length &&
      data.forwarder?.value &&
      data.supplier?.value &&
      !tuErrors.length
    );
  };

  watch(
    () => shipmentsStore.shipments,
    (shipments) => {
      if (shipments.length) {
        createItems(shipments);
        newItems.value = [];
      } else {
        items.value = [];
        newItems.value = [];
      }
    },
    { immediate: true }
  );

  return {
    items,
    newItems,

    filtersState,

    loadingIndex,

    addShipment,
    deleteShipment,
    addTransportUnit,
    deleteTransportUnit,
    updateData,

    saveShipment,
    disabled,
    tuValid,
    sizeValid,
  };
}

export default createShipments;
