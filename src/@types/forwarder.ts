interface ForwarderItemPerson {
  country_id: number | null;
  created_at: string | null;
  email: string | null;
  guid: string | null;
  is_head: boolean;
  name: string | null;
  phone: string | null;
  position: string | null;
  updated_at: string | null;
}

interface ForwarderItemContact {
  guid: string | null;
  email: string | null;
  created_at: string | null;
  phone: string | null;
  updated_at: string | null;
  website: string | null;

  persons: ForwarderItemPerson[];
}

interface ForwarderItemBase {
  area_notes: string | null;
  created_at: string | null;
  guid: string | null;
  is_active: boolean;
  name: string | null;
  updated_at: string | null;
  deleted_at: null | string;
}

interface ForwarderItemReason {
  comment: string | null;
  reason_id: string | null;
  user_id: number | null;
}

interface ForwarderItemLegalBank {
  created_at: string | null;
  guid: string | null;
  iban: string | null;
  swift_code: string | null;
  the_payee: string | null;
  updated_at: string | null;
  vat_id: string | null;
}

interface ForwarderItemLegal {
  bank_details: ForwarderItemLegalBank;
  created_at: string | null;
  guid: string | null;
  id_legal: string | null;
  is_active: boolean;
  is_primary: boolean;
  legalName: string | null;
  legal_address: string | null;
  updated_at: string | null;
  zip_code: string | null;
}

interface ForwarderItemService {
  countries: [];
  point_of_loading: [];
  ways: [];
}

type ForwarderItem = ForwarderItemBase & {
  contact: ForwarderItemContact[];
  disable_reason_link: ForwarderItemReason;
  legal_information: ForwarderItemLegal[];
  service: ForwarderItemService;
};

interface ForwarderServiceItem {
  id: number;
  name: string;
}

interface ForwarderService {
  ways: ForwarderServiceItem[];
  countries: ForwarderServiceItem[];
  point_of_loading: ForwarderServiceItem[];
}

interface Forwarder {
  guid: string;
  legal_address: string;
  name: string;
  phone: string;
  service: ForwarderService;
  deleted_at: null | string;
}

export type {
  ForwarderItem,
  ForwarderItemBase,
  ForwarderItemContact,
  ForwarderItemPerson,
  ForwarderItemReason,
  ForwarderItemLegalBank,
  ForwarderItemLegal,
  ForwarderItemService,
  ForwarderServiceItem,
  ForwarderService,
  Forwarder,
};
