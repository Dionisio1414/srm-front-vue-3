interface SupplyProducts {
  guid: string;
  articleId: number;
  articleNo: string;
  name: string;
  genericArticleId: number;
  amount: number;
  minimalOrderQuantity: number;
  fid: string;
  priceUsd?: number;
  priceEur?: number;
}

interface SupplyTotal {
  usd: number;
  eur: number;
  amount: number;
}

interface SupplyFactory {
  guid: string;
  name: string;
  jurName: string;
  legalAddress: string;
  address: string;
  zip: string;
  provinces: string;
  city: string;
  area: string;
  vatNumber: string;
  phone: string;
  isReliableSupplier: boolean;
}

interface SupplyFactoryLegalEntity {
  guid: string;
  factoryAwsId: number;
  shortName: string;
  legalName: string;
  vatId: string;
  paymentReceiver: string;
  iban: string;
  swiftCode: string;
  primary: boolean;
  address: string;
  comment: string;
}

interface SupplyStatus {
  id: number;
  alias: string;
  description: string;
}

interface Supply {
  guid: string;
  supplyNumber: number;
  shipmentGuid: string;
  cargoReadyDate: string;
  files: boolean;
  photos: boolean;
  createdAt: string;
  updatedAt: string;
  status: SupplyStatus;
  total: SupplyTotal;
  totalSku: number;
  factory: SupplyFactory;
  factoryLegalEntity: SupplyFactoryLegalEntity;
}

interface StatusHistoryScenario {
  id: number;
  alias: string;
  class: string;
}

interface StatusHistory {
  alias: string;
  class: string;
  supply_guid: string;
  created_at: string;

  status: SupplyStatus;
  status_scenario: StatusHistoryScenario[];
}

interface SupplyOrders {
  supplyGuid: string;
  orderGuids: Array<string | null>;
  orderNumbers: Array<string | null>;
}

export type {
  Supply,
  SupplyTotal,
  SupplyFactory,
  SupplyStatus,
  SupplyFactoryLegalEntity,
  SupplyProducts,
  StatusHistoryScenario,
  StatusHistory,
  SupplyOrders,
};
