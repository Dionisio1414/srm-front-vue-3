import * as validators from '@vuelidate/validators';
import { i18n } from '@/plugins/i18n';

import type { PaymentInfoData } from '@/@types/form-data';

const { createI18nMessage } = validators;

const { t } = i18n.global || i18n;

const withI18nMessage = createI18nMessage({ t });
const phoneValidator = (value: string) => (value ? /^\d+$/gm.test(value) : true);
const emailValidator = (value: string) =>
  // eslint-disable-next-line no-useless-escape
  value ? /^[\w-\.]+@([\w-]+\.)+[\w-]{1,4}$/g.test(value) : true;
const paymentValidator = (data: PaymentInfoData) => () => {
  const sum = Object.values(data).reduce((sum, value) => (sum += value), 0);

  return sum <= 100;
};
const minPaymentValidatory = (data: PaymentInfoData) => () => {
  const sum = Object.values(data).reduce((sum, value) => (sum += value), 0);

  return sum === 100;
};

const email = withI18nMessage(emailValidator);
const phone = withI18nMessage(phoneValidator);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const payment: any = withI18nMessage(paymentValidator as any, { withArguments: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const minPayment: any = withI18nMessage(minPaymentValidatory as any, { withArguments: true });
const required = withI18nMessage(validators.required);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requiredIf: any = withI18nMessage(validators.requiredIf as any, { withArguments: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const maxLength: any = withI18nMessage(validators.maxLength as any, { withArguments: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const minLength: any = withI18nMessage(validators.minLength as any, { withArguments: true });
const numeric = withI18nMessage(validators.numeric);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const maxValue: any = withI18nMessage(validators.maxValue as any, { withArguments: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const minValue: any = withI18nMessage(validators.minValue as any, { withArguments: true });

export {
  email,
  required,
  requiredIf,
  maxLength,
  minLength,
  phone,
  numeric,
  payment,
  minPayment,
  maxValue,
  minValue,
};
