import type { BaseTabs } from '@/@types/additional';

const BASE_TABS: BaseTabs[] = [
  { label: 'logistics.tabs.shipments', to: { name: 'shipments' } },
  { label: 'logistics.tabs.price', to: { name: 'price' } },
  { label: 'logistics.tabs.supplies', to: { name: 'supplies' } },
];

export default BASE_TABS;
