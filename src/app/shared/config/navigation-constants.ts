interface Navigation {
  icon: string;
  disabled: boolean;
  path: { name: string };
  message: string;
  routes: string[];
}

const NAVIGATION: Navigation[] = [
  {
    icon: 'clipboard-list',
    disabled: false,
    path: { name: 'orders' },
    message: 'navigation.orders',
    routes: ['order', 'draft', 'planned'],
  },

  {
    icon: 'ship',
    disabled: false,
    path: { name: 'shipments' },
    message: 'navigation.logistics',
    routes: ['prices-list', 'price-create', 'supplies'],
  },

  // {
  //   icon: 'boxes', disabled: true, path: { name: 'orders' }, message: '', routes: [],
  // },

  {
    icon: 'users',
    disabled: false,
    path: { name: 'forwarders' },
    message: 'navigation.forwarders',
    routes: ['supplier-mails'],
  },

  {
    icon: 'cog',
    disabled: false,
    path: { name: 'directories' },
    message: 'navigation.directoriesAndSettings',
    routes: ['settings'],
  },
];

export { NAVIGATION };
export type { Navigation };
