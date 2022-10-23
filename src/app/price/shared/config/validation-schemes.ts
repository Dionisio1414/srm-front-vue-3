import { required, requiredIf, maxLength } from '@/app/shared/utils/i18n-validators';

import type { PriceBaseInfo, ForwarderExpanse, PriceTransportUnit } from '@/@types/form-data';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const baseInfoScheme = (data: PriceBaseInfo, isOther: (id: number) => boolean) => ({
  forwarder_guid: { required },
  way_ids: { required },
  relevant_date_from: { required },
  relevant_date_to: { required },
  tariff_id: { required },
  loading_type_id: { required },
  is_active: {},
  reason_id: {
    required: requiredIf(() => !data.is_active),
  },
  reason_comment: {
    required: requiredIf(() => !data.is_active && isOther(Number(data.reason_id))),
    maxLength: maxLength(200),
  },
});

const customValidator = (data: ForwarderExpanse[]): number[] => {
  const notValidIndexes: number[] = [];

  const dataValidator = (dataItem: ForwarderExpanse, index: number) => {
    if (!dataItem.currency_id || !dataItem.expance_field_id) {
      notValidIndexes.push(index);
    }

    const tuValues = dataItem.forwarder_price_transport_units.map((tu) =>
      Boolean(Number(tu.value))
    );

    if (!tuValues.includes(true)) notValidIndexes.push(index);
  };

  data.forEach(dataValidator);

  return notValidIndexes;
};

type ActivityValidator = {
  isActive: boolean;
  comment: null | string;
  reasonId: null | number;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const activityValidator = (data: ActivityValidator, isOther: (id: number) => boolean) => ({
  isActive: {},
  reasonId: {
    required: requiredIf(() => !data.isActive),
  },
  comment: {
    required: requiredIf(() => !data.isActive && isOther(Number(data.reasonId))),
    maxLength: maxLength(200),
  },
});

const baseInfoStructure: PriceBaseInfo = {
  forwarder_guid: null,
  way_ids: [],
  relevant_date_from: null,
  relevant_date_to: null,
  tariff_id: null,
  loading_type_id: null,
  is_active: true,
  reason_id: null,
  reason_comment: null,
};

const unitsStructure: PriceTransportUnit = {
  transport_unit_size_id: null,
  transport_unit_type_id: null,
  value: 0,
};

const expanceStructure: ForwarderExpanse = {
  currency_id: null,
  expance_field_id: null,
  forwarder_price_transport_units: [],
};

export type { ActivityValidator };
export {
  baseInfoScheme,
  customValidator,
  activityValidator,
  baseInfoStructure,
  expanceStructure,
  unitsStructure,
};
