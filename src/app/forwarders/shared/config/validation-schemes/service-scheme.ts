import { required, maxLength } from '@/app/shared/utils/i18n-validators';

import { ForwarderServiceInfo } from '@/@types/form-data';

const serviceScheme = {
  area_notes: { maxLength: maxLength(200) },
  country_ids: { required },
  point_of_loading_ids: {},
  way_ids: { required },
};

const serviceStructure: ForwarderServiceInfo = {
  area_notes: '',
  country_ids: [],
  point_of_loading_ids: [],
  way_ids: [],
};

export { serviceScheme, serviceStructure };
