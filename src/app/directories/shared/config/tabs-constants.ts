import type { BaseTabs } from '@/@types/additional';

const GENERAL_TABS: BaseTabs[] = [
  { label: 'directories.innerTab.countries', to: { name: 'directories-general-countries' } },
  { label: 'directories.innerTab.exporters', to: { name: 'directories-general-exporters' } },
];

const FORWARDER_TABS: BaseTabs[] = [
  { label: 'directories.innerTab.reasons', to: { name: 'directories-forwarder-reasons' } },
];

const SHIPMENTS_TABS: BaseTabs[] = [
  {
    label: 'directories.innerTab.loadingTypes',
    to: { name: 'directories-shipments-loading-types' },
  },
  {
    label: 'directories.innerTab.transportUnits',
    to: { name: 'directories-shipments-transport-units' },
  },
  { label: 'directories.innerTab.sizes', to: { name: 'directories-shipments-sizes' } },
  { label: 'directories.innerTab.statuses', to: { name: 'directories-shipments-statuses' } },
  { label: 'directories.innerTab.ways', to: { name: 'directories-shipments-ways' } },
  { label: 'directories.innerTab.ports', to: { name: 'directories-shipments-items' } },
];

const FEATURE_FLAGS_TABS: BaseTabs[] = [
  { label: 'directories.innerTab.featureFlags', to: { name: 'directories-feature-flags-items' } },
];

const AWS_TABS: BaseTabs[] = [
  { label: 'directories.tab.general', to: { name: 'directories-general' } },
  { label: 'directories.tab.shipments', to: { name: 'directories-shipments' } },
  { label: 'directories.tab.forwarder', to: { name: 'directories-forwarder' } },
  { label: 'directories.tab.featureFlags', to: { name: 'directories-feature-flags' } },
];

export { AWS_TABS, GENERAL_TABS, FORWARDER_TABS, SHIPMENTS_TABS, FEATURE_FLAGS_TABS };
