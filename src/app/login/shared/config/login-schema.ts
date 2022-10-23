import { required } from '@/app/shared/utils/i18n-validators';

const loginScheme = {
  login: { required },
  password: { required },
};

export default loginScheme;
