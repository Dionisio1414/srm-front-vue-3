interface OrderCompany {
  id: number;
  name: string;
}

interface OrderExporter {
  key: number;
  label: string;
}

interface OrderFactory {
  guid: string;
  name: string;
  address?: string;
  area?: string;
  city?: string;
  jurName?: string;
  legalAddress?: string;
  phone?: string;
  province?: string;
  vatNumber?: string;
  zip?: string;
  is_reliable_supplier?: boolean;
}

interface OrderResponsible {
  id: number;
  name: string;
}

interface OrderStatus {
  alias: string;
  color: string;
  description: string;
  id: number;
}

interface OrderTotal {
  usd: number;
  eur: number;
}

interface OrderPlt {
  maxLeadTime: number;
}

interface LogsPortOfLoading {
  deliveryType?: string;
  deliveryTypeId?: number;
  guid?: string;
  port?: string;
  portGuid?: string;
  logGuid?: string;
}

interface LogsPortsOfLoading {
  Air: LogsPortOfLoading;
  Ocean: LogsPortOfLoading;
  Rail: LogsPortOfLoading;
  Truck: LogsPortOfLoading;
}

interface Order {
  createAt: string;
  guid: string;
  orderNumber: string;
  proformaInvoiceDate: string;
  proformaInvoiceNumber: string;
  task: string;
  updateAt: string;
  company: OrderCompany;
  exporter: OrderExporter;
  factory: OrderFactory;
  plt: OrderPlt;
  responsible: OrderResponsible;
  status: OrderStatus;
  total: OrderTotal;
}

interface ListOrder {
  articles: number;
  brand: string;
  category: string;
  company: OrderCompany;
  createdAt: string;
  estimatedProductionEndDate: string;
  factory: OrderFactory;
  guid: string;
  orderExecution: number;
  orderNumber: string;
  pieces: number;
  proformaInvoiceDate: string;
  proformaInvoiceNumber: string;
  responsible: OrderResponsible;
  status: OrderStatus;
  task: string;
  total: OrderTotal;
  updateAt: string;
}

interface OrderLog {
  guid: string;
  user_id: number;
  max_lead_time: string;
  shipper_exporter: string;
  legal_address: string;
  additional_terms_of_company: string;
  address: string;
  bank_iban: string;
  bank_recipient: string;
  bank_swift_code: string;
  city: string;
  design_and_packing: string;
  engraving: string;
  general_phone: string;
  incoterm: string;
  jur_name: string;
  pay_on_created: number;
  pay_on_production: number;
  pay_on_delivered: number;
  pay_on_port: number;
  payment_exchange_bl: number;
  payment_on_warehouse: number;
  payment_on_completion: number;
  delay_exchange_bl: number;
  delay_on_completion: number;
  delay_on_created: number;
  delay_on_delivered: number;
  delay_on_port: number;
  delay_on_production: number;
  delay_on_warehouse: number;
  port_of_loadings: LogsPortsOfLoading;
  vat_number: string;
  aws_country_id: number;
  country_name: string;
  created_at: string;
}

interface ProductLog {
  guid: string;
  product_guid: string;
  user_id: number;
  article_id: number;
  tecdoc_id: number;
  generic_article_id: number;
  brand_no: number;
  article_no: string;
  current_oe: number;
  name: string;
  fid: number;
  brand_name: string;
  pcs_in_box: number;
  comment: number;
  emark_number: number;
  emark_country: number;
  minimal_order_quantity: number;
  category_code: string;
  product_plan_id: number;
  category_name_ru: string;
  category_name_en: string;
  category_name_de: string;
  created_at: string;
}

type ProductsHistory = { [key: string]: ProductLog[] };

interface InfoBankData {
  iban: string;
  recipient: null | string;
  swiftCode: string;
}

interface InfoTermsDelivery {
  city: string;
  incoterms: string | number;
}

interface InfoAdditionalData {
  designAndPacking: string;
  engraving: string;
}

interface InfoGeneral {
  city: string;
  country: string;
  jurName: string;
  name: string;
  originalName: string;
}

interface InfoPay {
  payOnCreated: number;
  payOnDelivered: number;
  payOnPort: number;
  payOnProduction: number;
  paymentExchangeBl: number;
  paymentOnCompletion: number;
  paymentOnWarehouse: number;
}

interface InfoPortOfLoading {
  deliveryType: string;
  deliveryTypeId: number;
  guid: string;
  port: string;
  portGuid: string;
  orderBy: number;
}

interface InfoDelivery {
  Air: InfoPortOfLoading;
  Ocean: InfoPortOfLoading;
  Rail: InfoPortOfLoading;
  Truck: InfoPortOfLoading;
}

interface InfoProformaInvoice {
  additionalTerms: string;
  designAndPacking: string;
  engraving: string;
  incoterms: string | number;
}

interface InfoPayOnDelay {
  delay_exchange_bl: number;
  delay_on_completion: number;
  delay_on_created: number;
  delay_on_delivered: number;
  delay_on_port: number;
  delay_on_production: number;
  delay_on_warehouse: number;
}

interface Info {
  bankData: InfoBankData;
  general: InfoGeneral;
  payData: InfoPay;
  portOfLoading: InfoDelivery;
  proformaInvoice: InfoProformaInvoice;
  pay_data_delay: InfoPayOnDelay;
}

interface StatusHistoryReason {
  id: number;
  alias: string;
}

interface StatusHistoryStatus {
  id: number;
  alias: string;
  description: string;
}

interface StatusHistoryScenario {
  id: number;
  alias: string;
  class: string;
  reasons: StatusHistoryReason[];
}

interface StatusHistoryComment {
  comment: string;
  created_at: string;
  guid: string;
  order_guid: string;
  updated_at: string;
}

interface StatusHistory {
  alias: string;
  class: string;
  order_guid: string;
  update_at: string;

  reason: null | string;
  status: StatusHistoryStatus;
  status_scenario: StatusHistoryScenario[];
  comments: StatusHistoryComment[];
}

interface MailsHistory {
  guid: string;
  alias: string;
  created_at: string;
}

interface FileStatus {
  type: 'order_label' | 'order_pi';
  status: 'generating' | 'generated' | 'error';
  message: string;
  updated_at: string;
}

interface ChangeStatusPlanned {
  order_guids: string[];
  status_id: number;
  reason_id?: number;
  comment: string;
}

export {
  OrderCompany,
  OrderExporter,
  OrderFactory,
  OrderResponsible,
  OrderStatus,
  OrderTotal,
  OrderPlt,
  Order,
  ListOrder,
  OrderLog,
  ProductLog,
  ProductsHistory,
  InfoBankData,
  InfoGeneral,
  InfoPay,
  InfoPortOfLoading,
  InfoDelivery,
  InfoProformaInvoice,
  Info,
  StatusHistoryReason,
  StatusHistoryStatus,
  StatusHistoryScenario,
  StatusHistoryComment,
  StatusHistory,
  MailsHistory,
  InfoTermsDelivery,
  InfoAdditionalData,
  InfoPayOnDelay,
  FileStatus,
  ChangeStatusPlanned,
  LogsPortsOfLoading,
  LogsPortOfLoading,
};
