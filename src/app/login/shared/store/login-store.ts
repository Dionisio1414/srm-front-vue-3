import { defineStore } from 'pinia';
import { Ability, AnyAbility } from '@casl/ability';

import { loginUser, getUser } from '@/app/login/shared/services/api';

import type { User, AuthInfo, UserPermission, AbilityPermission } from '@/@types/authorization';

interface LoginState {
  user: User;
  info: AuthInfo;
  isLoading: boolean;
  routeHistory: string[];
}

const ability = new Ability();

function createRules(permission: UserPermission[]): AbilityPermission[] {
  const permissionReducer = (
    permissions: AbilityPermission[],
    permission: UserPermission
  ): AbilityPermission[] => {
    const rules = permission.rules.map((rule: string) => ({
      action: rule,
      subject: permission.resource === '*' ? 'all' : permission.resource,
    }));

    permissions.push(...rules);

    return permissions;
  };

  return permission.reduce(permissionReducer, []);
}

const useLoginStore = defineStore('login', {
  state: () =>
    ({
      user: {},
      info: {},
      isLoading: false,
      routeHistory: [] as string[],
    } as LoginState),

  getters: {
    ability(): AnyAbility {
      return ability;
    },

    userHasRole(state) {
      return (role: string) => state.user.roles?.includes(role);
    },
  },

  actions: {
    async login(login: string, password: string) {
      try {
        this.isLoading = true;

        const data = await loginUser({ login, password });
        const authInfo = { authType: data.authType, token: data.token, tokenType: data.tokenType };

        this.user = data.user;
        this.info = authInfo;

        this.updateAbility(data.user.permissions);
      } finally {
        this.isLoading = false;
      }
    },

    async getUser() {
      const data = await getUser();

      this.user = data;
      this.updateAbility(data.permissions);
    },

    logout() {
      this.user = {} as User;
      this.info = {} as AuthInfo;
    },

    updateAbility(permission: UserPermission[]) {
      this.ability.update(createRules(permission));
    },

    updateRouteHistory(path: string) {
      this.routeHistory.push(path);
    },

    clearRouteHistory() {
      this.routeHistory = [];
    },
  },

  persist: {
    paths: ['user', 'info', 'routeHistory'],
  },
});

export default useLoginStore;
export type { LoginState };
