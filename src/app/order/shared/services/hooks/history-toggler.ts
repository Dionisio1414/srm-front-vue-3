import { Ref, ref } from 'vue';

interface HistoryToggler {
  sliceIndex: Ref<number>;
  changeSliceIndex: (endIndex: number) => void;
}

function historyToggler(): HistoryToggler {
  const sliceIndex = ref(2);

  const changeSliceIndex = (endIndex: number) => {
    if (sliceIndex.value === 2 && sliceIndex.value !== endIndex) {
      sliceIndex.value = endIndex;
    } else {
      sliceIndex.value = 2;
    }
  };

  return { sliceIndex, changeSliceIndex };
}

export default historyToggler;
