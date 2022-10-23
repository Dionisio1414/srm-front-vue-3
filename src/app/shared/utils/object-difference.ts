import isEqual from 'lodash.isequal';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

const value = (obj: Record<string, unknown>, key: string) => {
  if (key.includes('date')) return formatDate(obj[key] as string | Date);
  return obj[key];
};

// eslint-disable-next-line @typescript-eslint/ban-types
function getObjectDiff(obj1: {}, obj2: {}, excluded = [] as string[]): unknown {
  const diff = Object.keys(obj1).reduce((result, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (isEqual(value(obj1, key), value(obj2, key))) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }

    return result;
  }, Object.keys(obj2));

  return diff.filter((key) => !excluded.includes(key));
}

export default getObjectDiff;
