import type { BaseTabs } from '@/@types/additional';

const BASE_TABS: BaseTabs[] = [
  { label: 'logistics.tabs.shipments', to: { name: 'shipments' } },
  { label: 'logistics.tabs.price', to: { name: 'price' } },
  { label: 'logistics.tabs.supplies', to: { name: 'supplies' } },
];

const PRICE_TABS: BaseTabs[] = [
  { label: 'price.tabs.general', to: { name: 'prices-list' } },
  { label: 'price.tabs.create', to: { name: 'price-create' } },
];

export { PRICE_TABS, BASE_TABS };
