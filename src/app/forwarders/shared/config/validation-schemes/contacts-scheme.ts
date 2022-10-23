import { required, email, phone } from '@/app/shared/utils/i18n-validators';

const contactScheme = {
  email: { email },
  phone: { phone },
  website: {},
};

const contactPersonScheme = {
  name: { required },
  position: { required },
  phone: { required, phone },
  email: { required, email },
  country_id: { required },
  is_head: {},
};

const contactsPersonStructure = {
  guid: '',
  name: null,
  position: null,
  phone: null,
  email: null,
  country_id: null,
  is_head: false,
};

const contactsStructure = {
  email: null,
  phone: null,
  website: null,

  persons: [
    {
      name: null,
      position: null,
      phone: null,
      email: null,
      country_id: null,
      is_head: true,
    },
  ],
};

export { contactScheme, contactPersonScheme, contactsStructure, contactsPersonStructure };
