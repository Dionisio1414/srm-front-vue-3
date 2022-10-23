import { reactive, watch } from 'vue';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';

import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { baseInfoStructure, expanceStructure } from '@/app/price/shared/config/validation-schemes';

import type {
  ForwarderExpanse,
  PriceBaseInfoKeys,
  PriceBaseInfo,
  PriceTransportUnit,
} from '@/@types/form-data';
import type { UnitTypeSize } from '@/@types/additional';

type UpdateBaseData = {
  key: keyof PriceBaseInfo;
  value: never;
};

type UpdatePriceData = {
  key: string;
  value: never;
};

type CreateWatchers = {
  baseInfo: PriceBaseInfo;
  priceInfo: { data: ForwarderExpanse[] };

  addPrice: (selectedUnits: UnitTypeSize[]) => void;
  deletePrice: (index: number) => void;
  updateBaseData: (payload: UpdateBaseData) => void;
  updatePriceData: (payload: UpdatePriceData) => void;
  updateUnits: (selectedUnits: UnitTypeSize[]) => void;
  resetData: () => void;
};

function createData(): CreateWatchers {
  const infoStore = useInfoStore();
  const { onError } = useNotification();

  const baseInfo: PriceBaseInfo = reactive(cloneDeep(baseInfoStructure));
  const priceInfo = reactive({ data: [cloneDeep(expanceStructure)] });

  const resetExpance = () => {
    const clone = cloneDeep(priceInfo.data);
    const modified = clone.map((item) => ({ ...item, expance_field_id: null }));

    priceInfo.data = modified;
  };

  watch(
    () => baseInfo.forwarder_guid,
    (guid) => {
      baseInfo.way_ids = null;

      if (guid) {
        infoStore.getForwarderWays(guid as string).catch((error) => onError(error));
        infoStore.getForwarderTariffs().catch((error) => onError(error));
        infoStore.getCurrencies().catch((error) => onError(error));
      }
    }
  );

  watch(
    () => baseInfo.way_ids,
    (wayIds) => {
      baseInfo.loading_type_id = null;

      infoStore.getLoadingTypes(wayIds).catch((error) => onError(error));
      infoStore.getForwarderExpanseFields(wayIds).catch((error) => onError(error));

      if (wayIds?.length) {
        infoStore.getUnitTypesSizes(wayIds).catch((error) => onError(error));
      } else {
        infoStore.resetData('unitTypesSizes', [] as never);
      }

      resetExpance();
    }
  );

  watch(
    () => baseInfo.is_active,
    (isActive) => {
      infoStore.getForwarderReasons().catch((error) => onError(error));

      if (isActive) {
        baseInfo.reason_id = null;
        baseInfo.reason_comment = null;
      }
    }
  );

  const createUnit = (selectedUnit: UnitTypeSize): PriceTransportUnit => ({
    transport_unit_size_id: selectedUnit.transportUnitSizeId,
    transport_unit_type_id: selectedUnit.transportUnitTypeId,
    value: null,
  });

  const addPrice = (selectedUnits: UnitTypeSize[]): void => {
    const clone = cloneDeep(priceInfo.data);
    const expance = cloneDeep(expanceStructure);
    const units = selectedUnits.map(createUnit);

    expance.forwarder_price_transport_units = units;
    clone.push(expance);

    priceInfo.data = clone;
  };

  const deletePrice = (index: number) => {
    const clone = cloneDeep(priceInfo.data);
    clone.splice(index, 1);

    priceInfo.data = clone;
  };

  const updateBaseData = ({ key, value }: UpdateBaseData): void => {
    baseInfo[key] = value;
  };

  const updatePriceData = ({ key, value }: UpdatePriceData): void => {
    const clone = cloneDeep(priceInfo.data);
    set(clone, key, value);
    priceInfo.data = clone;
  };

  const updateUnits = (selectedUnits: UnitTypeSize[]) => {
    const clone = cloneDeep(priceInfo.data);

    const unitReducer = (
      data: PriceTransportUnit[],
      selectedUnits: UnitTypeSize[]
    ): PriceTransportUnit[] =>
      selectedUnits.reduce((acc, unit) => {
        const expance = data.find(
          ({ transport_unit_size_id, transport_unit_type_id }) =>
            transport_unit_size_id === unit.transportUnitSizeId &&
            transport_unit_type_id === unit.transportUnitTypeId
        );

        if (expance) {
          acc.push(cloneDeep(expance));
        } else {
          acc.push({
            transport_unit_size_id: unit.transportUnitSizeId,
            transport_unit_type_id: unit.transportUnitTypeId,
            value: 0,
          });
        }

        return acc;
      }, [] as PriceTransportUnit[]);

    priceInfo.data = clone.map((item) => ({
      ...item,
      forwarder_price_transport_units: unitReducer(
        item.forwarder_price_transport_units,
        selectedUnits
      ),
    }));
  };

  const resetData = (): void => {
    Object.keys(baseInfo).forEach((key) => {
      if (key !== 'is_active') {
        baseInfo[key as PriceBaseInfoKeys] = null;
      }
    });
    priceInfo.data = [cloneDeep(expanceStructure)];
  };

  return {
    baseInfo,
    priceInfo,

    addPrice,
    deletePrice,
    updateBaseData,
    updatePriceData,
    updateUnits,
    resetData,
  };
}

export default createData;
