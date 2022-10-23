import { required, requiredIf } from '@/app/shared/utils/i18n-validators';

import type { ParsingType } from '@/@types/additional';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const rowSchema = (type: ParsingType) => ({
  start_row: { required },
  end_row: { required },
  supplier: {
    required: requiredIf(() => type === 'supplies'),
  },
  file_type: {
    required: requiredIf(() => type === 'supplier' || type === 'supplies' || type === 'supply'),
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const generalSchema = (type: ParsingType) => ({
  article_no: { required },
  fid: { required },
  quantity: { required },
  price_usd: { required },
  order_no: {
    required: requiredIf(() => type === 'supplier' || type === 'supplies' || type === 'supply'),
  },
  oem: {
    required: requiredIf(() => type === 'compare'),
  },
});

const customSchema = {
  total_price_usd: { required },
};

export { rowSchema, generalSchema, customSchema };
