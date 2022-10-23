import type { ParsingFields, ParsingType } from '@/@types/additional';

const compareData: (type: ParsingType) => ParsingFields = (type) => ({
  start_row: 1,
  end_row: 1,
  general_fields: {
    article_no: '',
    fid: '',
    quantity: '',
    price_usd: '',
    ...(type === 'supplier' || type === 'supplies' || type === 'supply' || type === 'compareSupply'
      ? {
          order_no: '',
        }
      : {}),
    ...(type === 'compare'
      ? {
          oem: '',
        }
      : {}),
  },
  ...(type.includes('compare')
    ? {
        custom_fields: {
          total_price_usd: '',
        },
      }
    : {}),
});

export { compareData };
