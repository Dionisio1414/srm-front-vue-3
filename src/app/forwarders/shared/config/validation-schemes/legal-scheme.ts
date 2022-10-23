import { required } from '@/app/shared/utils/i18n-validators';

import type { ForwarderLegal } from '@/@types/form-data';

const legalScheme = {
  legal_name: { required },
  the_payee: { required },
  id_legal: { required },
  vat_id: { required },
  legal_address: { required },
  iban: { required },
  zip_code: { required },
  swift_code: { required },
  is_active: {},
  is_primary: {},
};

const legalStructure: ForwarderLegal = {
  legal_name: null,
  the_payee: null,
  id_legal: null,
  vat_id: null,
  legal_address: null,
  iban: null,
  zip_code: null,
  swift_code: null,
  is_active: true,
  is_primary: true,
};

const customValidator = (legalData: ForwarderLegal[]): string[] => {
  const errors: string[] = [];

  const errorMessages = {
    justOne: 'Just one legal information can be primary',
    primary: 'At least one legal information must be primary',
    active: 'Primary legal information must be active',
  };

  const primaries = legalData.filter((data) => data.is_primary);
  const activeNotSelected = primaries.reduce((acc, item) => {
    if (item.is_primary && !item.is_active) acc.push(item);

    return acc;
  }, [] as ForwarderLegal[]);

  if (!primaries.length) {
    errors.push(errorMessages.primary);
  } else if (primaries.length > 1) {
    errors.push(errorMessages.justOne);
  } else if (activeNotSelected.length) {
    errors.push(errorMessages.active);
  }

  return errors;
};

export { legalScheme, legalStructure, customValidator };
