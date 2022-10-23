import type { BaseTabs } from '@/@types/additional';

const BASE_TABS: BaseTabs[] = [
  { label: 'orders.titles.orders-list', to: { name: 'orders-list' } },
  { label: 'orders.titles.drafts-list', to: { name: 'drafts-list' } },
  { label: 'orders.titles.planned-list', to: { name: 'planned-list' } },
];

export default BASE_TABS;
