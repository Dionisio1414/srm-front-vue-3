type SuppliesFileKeys = 'ci' | 'photo' | 'pl' | 'hbl' | 'pay';

interface SuppliesOrders {
  supplyGuid: string;
  orderGuids: Array<string | null>;
  orderNumbers: Array<string | null>;
}

interface SuppliesFiles {
  ci: boolean;
  photo: boolean;
  pl: boolean;
  hbl: boolean;
  pay: boolean;
}

interface SuppliesStatus {
  id: number;
  alias: string;
  description: string;
}

interface SuppliesTotal {
  usd: number;
  eur: number;
  amount: number;
}

interface Supplies {
  guid: string;
  supplyNumber: number;
  shipmentGuid: string | null;
  cargoReadyDate: string | null;
  totalSku: number;

  total: SuppliesTotal;
  status: SuppliesStatus;
  files: SuppliesFiles;

  createdAt: string;
  updatedAt: string;
}

export { SuppliesOrders, Supplies, SuppliesFiles, SuppliesFileKeys };
