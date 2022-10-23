import cloneDeep from 'lodash.clonedeep';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import type {
  AdditionalInfoData,
  BankInfoData,
  FactoryInfoData,
  OrderInfoData,
  PaymentInfoData,
  PiInfoData,
  TermsDeliveryInfoData,
  PortOfLoadingData,
} from '@/@types/form-data';
import type {
  InfoBankData,
  InfoPay,
  InfoProformaInvoice,
  OrderExporter,
  OrderFactory,
  OrderPlt,
  Order,
  InfoTermsDelivery,
  InfoAdditionalData,
  InfoDelivery,
  InfoPayOnDelay,
} from '@/@types/order';

const orderInfoData = (order: Order, plt: OrderPlt, exporter: OrderExporter): OrderInfoData =>
  cloneDeep({
    pi_number: order.proformaInvoiceNumber || '',
    pi_date: formatDate(order.proformaInvoiceDate || ''),
    max_lead_time: plt.maxLeadTime,
    exporter_id: exporter.key,
  });

const factoryInfoData = (factory: OrderFactory): FactoryInfoData =>
  cloneDeep({
    jur_name: factory.jurName || '',
    vat_number: factory.vatNumber || '',
    legal_address: factory.legalAddress || '',
    general_phone: factory.phone || '',
    address: factory.address || '',
  });

const bankInfoData = (bank: InfoBankData): BankInfoData =>
  cloneDeep({
    bank_swift_code: bank.swiftCode,
    bank_iban: bank.iban,
    bank_recipient: bank.recipient || '',
  });

const piInfoData = (pi: InfoProformaInvoice): PiInfoData =>
  cloneDeep({
    additional_terms_of_company: pi.additionalTerms,
  });

const paymentInfoData = (pay: InfoPay): PaymentInfoData =>
  cloneDeep({
    pay_on_created: pay.payOnCreated,
    pay_on_delivered: pay.payOnDelivered,
    pay_on_port: pay.payOnPort,
    pay_on_production: pay.payOnProduction,
    payment_exchange_bl: pay.paymentExchangeBl,
    payment_on_completion: pay.paymentOnCompletion,
    payment_on_warehouse: pay.paymentOnWarehouse,
  });

const termsDeliveryInfoData = (
  info: InfoTermsDelivery,
  countryId: string | number
): TermsDeliveryInfoData =>
  cloneDeep({
    incoterm: info.incoterms,
    city: info.city,
    country_id: countryId,
  });

const additionalInfoData = (data: InfoAdditionalData): AdditionalInfoData =>
  cloneDeep({
    engraving: data.engraving,
    design_and_packing: data.designAndPacking,
  });

const deliveryPortsInfoData = (ports: InfoDelivery): PortOfLoadingData[] => {
  const keys: string[] = Object.keys(cloneDeep(ports));
  return keys
    .map((key) => ({
      port_guid: ports[key as keyof InfoDelivery].portGuid,
      port_delivery_type_id: ports[key as keyof InfoDelivery].deliveryTypeId,
    }))
    .filter((item) => item.port_delivery_type_id && item.port_guid);
};

const paymentDelayInfoData = (pay: InfoPayOnDelay): InfoPayOnDelay =>
  cloneDeep({
    delay_exchange_bl: pay.delay_exchange_bl,
    delay_on_completion: pay.delay_on_completion,
    delay_on_created: pay.delay_on_created,
    delay_on_delivered: pay.delay_on_delivered,
    delay_on_port: pay.delay_on_port,
    delay_on_production: pay.delay_on_production,
    delay_on_warehouse: pay.delay_on_warehouse,
  });

export {
  orderInfoData,
  factoryInfoData,
  bankInfoData,
  piInfoData,
  paymentInfoData,
  termsDeliveryInfoData,
  additionalInfoData,
  deliveryPortsInfoData,
  paymentDelayInfoData,
};
