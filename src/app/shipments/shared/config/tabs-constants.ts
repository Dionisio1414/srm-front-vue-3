import type { BaseTabs } from '@/@types/additional';

const BASE_TABS: BaseTabs[] = [
  { label: 'logistics.tabs.shipments', to: { name: 'shipments' } },
  { label: 'logistics.tabs.price', to: { name: 'price' } },
  { label: 'logistics.tabs.supplies', to: { name: 'supplies' } },
];

const SHIPMENTS_TABS: BaseTabs[] = [
  { label: 'logistics.tabs.activeShipments', to: { name: 'shipments-active' } },
  { label: 'logistics.tabs.preBookingShipments', to: { name: 'shipments-pre-booking' } },
];

export { BASE_TABS, SHIPMENTS_TABS };
