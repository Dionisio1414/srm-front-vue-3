import get from 'lodash.get';

import {
  required,
  maxLength,
  minLength,
  phone,
  payment,
  minPayment,
  maxValue,
  minValue,
} from '@/app/shared/utils/i18n-validators';

import type { Product } from '@/@types/product';
import type { PaymentInfoData } from '@/@types/form-data';

const rejectSchema = {
  reasonId: { required },
  comment: { required, maxLength: maxLength(250), minLength: minLength(5) },
};

const commentSchema = {
  comment: { required, maxLength: maxLength(250), minLength: minLength(5) },
};

const orderInfoSchema = {
  pi_number: {},
  pi_date: { required },
  max_lead_time: { required, maxValue: maxValue(9999), minValue: minValue(0) },
  exporter_id: {},
};

const factoryInfoSchema = {
  jur_name: { required },
  vat_number: {},
  legal_address: {},
  area: {},
  general_phone: { phone },
  address: {},
};

const bankInfoSchema = {
  bank_swift_code: {},
  bank_iban: {},
  bank_recipient: {},
};

const piInfoSchema = {
  additional_terms_of_company: {},
};

const termsDeliveryInfoSchema = {
  incoterm: {},
  city: {},
  country_id: {},
};

const additionalInfoSchema = {
  design_and_packing: {},
  engraving: {},
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const paymentInfoSchema = (data: PaymentInfoData) => ({
  pay_on_created: { required, minPayment: minPayment(data), payment: payment(data) },
  pay_on_delivered: { required, minPayment: minPayment(data), payment: payment(data) },
  pay_on_port: { required, minPayment: minPayment(data), payment: payment(data) },
  pay_on_production: { required, minPayment: minPayment(data), payment: payment(data) },
  payment_exchange_bl: { required, minPayment: minPayment(data), payment: payment(data) },
  payment_on_completion: { required, minPayment: minPayment(data), payment: payment(data) },
  payment_on_warehouse: { required, minPayment: minPayment(data), payment: payment(data) },
});

const portsOfLoadingSchema = {
  port_of_loading: { required },
};

const REQUIRED_ARTICLE_FIELDS = [
  'categoryCode',
  'article.oe',
  'quantity',
  'price.usd',
  'price.eur',
];

const articleValidator = (data: Product, key: string): boolean => {
  if (REQUIRED_ARTICLE_FIELDS.includes(key)) {
    const value = get(data, key);

    return !value;
  }

  return false;
};

const articlesValidator = (data: Product[]): boolean => {
  const errors = data.reduce((errors, item): boolean[] => {
    const validity = REQUIRED_ARTICLE_FIELDS.map((key) => articleValidator(item, key)).filter(
      (item) => !item
    );

    if (validity.length === REQUIRED_ARTICLE_FIELDS.length) {
      errors.push(false);
    }

    return errors;
  }, [] as boolean[]);

  return !(errors.length === data.length);
};

export {
  rejectSchema,
  commentSchema,
  orderInfoSchema,
  factoryInfoSchema,
  bankInfoSchema,
  piInfoSchema,
  paymentInfoSchema,
  articlesValidator,
  articleValidator,
  termsDeliveryInfoSchema,
  additionalInfoSchema,
  portsOfLoadingSchema,
};
