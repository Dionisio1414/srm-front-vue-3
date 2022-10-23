import { required, maxLength, requiredIf } from '@/app/shared/utils/i18n-validators';

import { ForwarderBaseInfo, ForwarderBaseInfoShort } from '@/@types/form-data';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const baseInfoScheme = (data: ForwarderBaseInfo, isOther: (id: number) => boolean) => ({
  name: { required },
  is_active: {},
  way_ids: { required },
  country_ids: { required },
  area_notes: { maxLength: maxLength(200) },
  point_of_loading_ids: {},

  reason_id: {
    required: requiredIf(() => !data.is_active),
  },

  reason_comment: {
    required: requiredIf(() => !data.is_active && isOther(Number(data.reason_id))),
    maxLength: maxLength(200),
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const baseInfoShortScheme = (data: ForwarderBaseInfoShort, isOther: (id: number) => boolean) => ({
  is_active: {},
  name: { required },
  user_id: {},

  reason_id: {
    required: requiredIf(() => !data.is_active),
  },
  reason_comment: {
    required: requiredIf(() => !data.is_active && isOther(Number(data.reason_id))),
    maxLength: maxLength(200),
  },
});

const baseInfoStructure = {
  name: null,
  is_active: true,
  way_ids: [],
  country_ids: [],
  area_notes: null,
  point_of_loading_ids: [],
  reason_id: null,
  reason_comment: null,
};

export { baseInfoStructure, baseInfoScheme, baseInfoShortScheme };
