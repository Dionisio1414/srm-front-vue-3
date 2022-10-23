interface Company {
  id: number;
  name: string;
}

interface OrderStatus {
  id: number;
  type: number;
  alias: string;
  color: string;
  title: string;
  parent: null | number | string;
}

type PortItem = Company;

interface Port {
  countryId: number;
  countryName: string;
  ports: PortItem[];
}

interface LoadingType {
  id: number;
  type: string;
  way_ids: number[];
}

interface UnitSize {
  id: number;
  value: string;
  way_ids: number[];
}

interface ExpanseField {
  id: number;
  field: string;
  way_id: null | number;
}

interface Currency {
  id: number;
  currency: string;
}

interface Incoterm {
  id: number;
  incoterm: string;
}

interface UnitTypeSize {
  transportUnitSizeId: number;
  transportUnitSizeValue: number;
  transportUnitTypeId: number;
  transportUnitTypeValue: string;
}

interface Exporter {
  guid: number;
  id: number;
  name: string;
}

interface Reason {
  id: number;
  alias: string;
  description: string;
}

interface Tariff {
  id: number;
  tariff: string;
}

interface ShipmentsStatus {
  id: number;
  alias: string;
}

interface SupplierShort {
  value: string;
  label: string;
  way_ids?: number[];
}

interface SupplierSearch {
  awsId: number;
  email: null | string;
  guid: string;
  isMailApproved: boolean;
  name: string;
  way_ids?: number[];
}

interface Category {
  id: number;
  code: string;
  way_ids?: number[];
}

interface BaseTabs {
  label: string;
  to: { name: string; query?: string };
}

interface Prepayment {
  amount: number;
  orderSum: number;
  percent: number;
}

interface Overpayment {
  orderSum: number;
  paymentSum: number;
  isOverpayment: boolean;
}

interface FileInner {
  guid?: string;
  fileGuid: string;
  fileMime_Type: string;
  fileName: string;
  fileSize: number;
}

interface OrderFiles {
  other?: FileInner[];
  pi?: FileInner[];
  prepayment?: FileInner[];
  generated_pi?: FileInner[];
}

interface SupplyFiles {
  ci: FileInner[];
  photo: FileInner[];
  pl: FileInner[];
  hbl: FileInner[];
  pay: FileInner[];
}

interface ParsingRowFields {
  start_row: number;
  end_row: number;
}

interface ParsingGeneralFields {
  article_no: string;
  fid: string;
  quantity: string;
  price_usd: string;
  order_no?: string;
  oem?: string;
}

interface ParsingCustomFields {
  total_price_usd: string;
}

interface ParsingFields extends ParsingRowFields {
  general_fields: ParsingGeneralFields;
  custom_fields?: ParsingCustomFields;
}

interface CompareValue {
  [key: string]: string | number | null;
}

interface CompareData {
  custom_fields: {
    from_file: CompareValue;
    from_order: CompareValue;
    from_supply: CompareValue;
    is_match: boolean;
  };
  general_fields: {
    from_file: CompareValue;
    from_order: CompareValue;
    from_supply: CompareValue;
  }[];
  is_match: boolean;
}

type SupplyStatus = {
  id: number;
  alias: string;
  description: string;
};

type Member = Company;

type Way = Company;

type Country = Company & {
  codeAlpha2?: string;
  codeAlpha3?: string;
  telephoneCode?: string;
};

type UnitType = LoadingType;

type ForwarderShort = SupplierShort;

type StatisticsStatus = OrderStatus & {
  count: number;
};

type StatusReasons = {
  id: number;
  alias: string;
};

type ParsingType = 'compare' | 'compareSupply' | 'supplier' | 'supplies' | 'supply';

interface DeliveryPorts {
  guid: string;
  name: string;
  delivery_type_id: number;
}

type DateType = {
  date: string;
  timezone_type: number;
  timezone: string;
};

interface FeatureFlag {
  guid: string;
  feature: string;
  description: string;
  is_enabled: boolean;
  created_at: DateType;
  updated_at: DateType;
}

interface FeatureFlagsParams {
  feature: string;
  is_enabled: boolean;
  description: string;
}

export type {
  Company,
  OrderStatus,
  Member,
  Way,
  Country,
  PortItem,
  Port,
  LoadingType,
  UnitSize,
  ExpanseField,
  Currency,
  Incoterm,
  UnitTypeSize,
  UnitType,
  Exporter,
  Reason,
  Tariff,
  ShipmentsStatus,
  SupplierShort,
  SupplierSearch,
  Category,
  ForwarderShort,
  BaseTabs,
  StatisticsStatus,
  Prepayment,
  Overpayment,
  FileInner,
  OrderFiles,
  SupplyFiles,
  SupplyStatus,
  ParsingRowFields,
  ParsingGeneralFields,
  ParsingCustomFields,
  ParsingFields,
  CompareData,
  StatusReasons,
  ParsingType,
  DeliveryPorts,
  DateType,
  FeatureFlag,
  FeatureFlagsParams,
};
