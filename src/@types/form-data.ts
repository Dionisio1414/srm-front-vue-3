import type { SupplierShort } from './additional';

type ForwarderContactPerson = {
  name: string | null;
  email: string | null;
  phone: string | null;
  position: string | null;
  is_head: boolean;
  country_id: number | null;
};

type ForwarderContact = {
  email: string | null;
  phone: string | null;
  website: string | null;

  persons: ForwarderContactPerson[];
};

type ForwarderLegal = {
  guid?: string | null;
  legal_name: string | null;
  the_payee: string | null;
  id_legal: string | null;
  vat_id: string | null;
  legal_address: string | null;
  iban: string | null;
  zip_code: string | null;
  swift_code: string | null;
  is_active: boolean;
  is_primary: boolean;
};

type ForwarderBaseInfo = {
  name: null | string;
  is_active: boolean;
  way_ids: number[];
  country_ids: number[];
  area_notes: null | string;
  point_of_loading_ids: number[];
  reason_id: null | number;
  reason_comment: null | string;
};

type ForwarderBaseInfoShort = {
  is_active: boolean;
  name: string | null;
  user_id: string | number | null;
  reason_id: null | number | string;
  reason_comment: null | string;
};

type ForwarderServiceInfo = {
  area_notes: null | string;
  country_ids: null | string[] | number[];
  point_of_loading_ids: null | string[] | number[];
  way_ids: null | string[] | number[];
};

type ForwarderData = {
  contact: ForwarderContact;
  legal_information: ForwarderLegal[];
} & ForwarderBaseInfo;

type ShipmentsNewUnit = {
  amount: null | string | number;
  size: null | string;
  type: null | string;
};

type ShipmentsNew = {
  guid?: string;
  isNew?: true;
  way_ids: number[];
  supplier: SupplierShort | null;
  forwarder: SupplierShort | null;
  shipmentLoadingType: null | string | number;
  pointOfLoading: null | string | number;
  weight: null | string | number;
  volume: null | string | number;
  cargoReadyDate: null | string;
  transportUnits: ShipmentsNewUnit[];
};

type OrderInfoData = {
  pi_number: string;
  pi_date: string;
  max_lead_time: number;
  exporter_id: number;
};

type FactoryInfoData = {
  jur_name: string;
  vat_number: string;
  legal_address: string;
  general_phone: string;
  address: string;
};

type BankInfoData = {
  bank_swift_code: string;
  bank_iban: string;
  bank_recipient: string;
};

type PiInfoData = {
  additional_terms_of_company: string;
};

type PaymentInfoData = {
  pay_on_created: number;
  pay_on_delivered: number;
  pay_on_port: number;
  pay_on_production: number;
  payment_exchange_bl: number;
  payment_on_completion: number;
  payment_on_warehouse: number;
};

type TermsDeliveryInfoData = {
  incoterm: string | number;
  city: string;
  country_id: string | number;
};

type AdditionalInfoData = {
  design_and_packing: string;
  engraving: string;
};

type PortOfLoadingData = {
  port_guid: string;
  port_delivery_type_id: number;
};

type PaymentDelayInfoData = {
  delay_on_created: number;
  delay_on_production: number;
  delay_on_delivered: number;
  delay_on_port: number;
  delay_on_warehouse: number;
  delay_on_completion: number;
  delay_exchange_bl: number;
};

type OrderFormData = {
  orderInfo: OrderInfoData;
  payData: PaymentInfoData;
  bankData: BankInfoData;
  proformaInvoice: PiInfoData;
  factoryData: FactoryInfoData;
  termsDeliveryData: TermsDeliveryInfoData;
  additionalData: AdditionalInfoData;
  deliveryPortsData: PortOfLoadingData[];
  payDelayInfoData: PaymentDelayInfoData;
};

type PriceBaseInfoKeys =
  | 'forwarder_guid'
  | 'way_ids'
  | 'relevant_date_from'
  | 'relevant_date_to'
  | 'tariff_id'
  | 'loading_type_id'
  | 'reason_id'
  | 'reason_comment';

type PriceBaseInfo = {
  forwarder_guid: null | string;
  way_ids: null | number[];
  relevant_date_from: null | string;
  relevant_date_to: null | string;
  tariff_id: null | number | string;
  loading_type_id: null | number | string;
  is_active: boolean;
  reason_id: null | string | number;
  reason_comment: null | string;
};

type PriceTransportUnit = {
  guid?: string;
  transport_unit_size_id: null | number | string;
  transport_unit_type_id: null | number | string;
  value: null | number | string;
};

type ForwarderExpanse = {
  guid?: string;
  currency_id: null | string | number;
  expance_field_id: null | string | number;
  forwarder_price_transport_units: PriceTransportUnit[];
};

type PriceFormData = PriceBaseInfo & { forwarder_price_expance_list: ForwarderExpanse[] };

type PriceItemFormData = {
  is_active: boolean;
  reason_id: number | null;
  comment: string | null;
  relevant_date_from: string;
  relevant_date_to: string;
};

export type {
  ForwarderContactPerson,
  ForwarderContact,
  ForwarderLegal,
  ForwarderBaseInfo,
  ForwarderBaseInfoShort,
  ForwarderServiceInfo,
  ForwarderData,
  ShipmentsNewUnit,
  ShipmentsNew,
  OrderInfoData,
  FactoryInfoData,
  BankInfoData,
  PiInfoData,
  PaymentInfoData,
  OrderFormData,
  PriceBaseInfoKeys,
  PriceBaseInfo,
  PriceTransportUnit,
  ForwarderExpanse,
  PriceFormData,
  PriceItemFormData,
  TermsDeliveryInfoData,
  AdditionalInfoData,
  PortOfLoadingData,
  PaymentDelayInfoData,
};
