import { Ref, ref, watch } from 'vue';

import type { UnitTypeSize } from '@/@types/additional';

type SelectedUnit = {
  selectedUnits: Ref<UnitTypeSize[]>;
};

function selectedUnit(
  wayIds: Ref<null | number[] | string[]>,
  updateUnits: (units: UnitTypeSize[]) => void
): SelectedUnit {
  const selectedUnits: Ref<UnitTypeSize[]> = ref([]);

  watch(selectedUnits, (units) => {
    updateUnits(units);
  });
  watch(wayIds, () => {
    selectedUnits.value = [];
  });

  return { selectedUnits };
}

export default selectedUnit;
