import type { LoadingType, Way, Tariff } from '@/@types/additional';

interface PriceForwarder {
  guid: string;
  name: string;
}

interface PriceExpanse {
  guid: string;
  field: string;
  currency: { id: number; currency: string };
}

interface PriceReason {
  reason_id: null | number;
  comment: null | string;
}

interface Price {
  guid: string;
  forwarder: PriceForwarder;
  is_active: boolean;
  relevant_date_from: string;
  relevant_date_to: string;
  expance: PriceExpanse[];
  loading_type: LoadingType;
  ways: Way[];
  tariff: Tariff;
  disable_reason_link: PriceReason;
  created_at: string;
  updated_at: string;
}

interface PriceItemTU {
  guid: string;
  size_id: number;
  size_value: number;
  type_id: number;
  type_value: string;
  value: number;
}

interface PriceItemExpanse {
  guid: string;
  currency: { id: number; currency: string };
  expance_field: { id: number; field: string; way_id: null | number };
  transport_units: PriceItemTU[];
}

interface PriceItem {
  guid: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  relevant_date_from: string;
  relevant_date_to: string;
  disable_reason_link: PriceReason;
  expance: PriceItemExpanse[];
  forwarder: PriceForwarder;
  loading_type: { id: number; type: string };
  tariff: { id: number; tariff: string };
  ways: Array<{ id: number; name: string }>;
}

export type { Price, PriceForwarder, PriceExpanse, PriceItem, PriceItemExpanse, PriceItemTU };
