interface UserPermission {
  path: string[];
  resource: string;
  rules: string[];
}

interface User {
  id: number;
  name: string;
  login: string;
  email: string | null;
  language: string | null;

  roles: string[];
  permissions: UserPermission[];
}

interface AbilityPermission {
  action: string;
  subject: string;
}

interface AuthData {
  token: string;
  authType: string;
  expiredIn: number;
  tokenType: string;

  user: User;
}

interface AuthInfo {
  authType: string;
  token: string;
  tokenType: string;
}

export type { UserPermission, User, AbilityPermission, AuthData, AuthInfo };
