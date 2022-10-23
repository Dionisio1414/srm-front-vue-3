import type { BaseTabs } from '@/@types/additional';

const SUPPLIER_TABS: BaseTabs[] = [
  { label: 'supplier.tabs.orders', to: { name: 'supplier-list' } },
  { label: 'supplier.tabs.swh', to: { name: 'supplier-swh' } },
  { label: 'supplier.tabs.supplies', to: { name: 'supplier-supplies' } },
  { label: 'supplier.tabs.shipments', to: { name: 'supplier-shipments' } },
];

export default SUPPLIER_TABS;
