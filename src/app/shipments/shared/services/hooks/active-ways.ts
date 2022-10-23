import { Ref, ref } from 'vue';

type ActiveForwarder = {
  forwarderWays: Ref<number[]>;
  changeForwarderWays: (ways: number[]) => void;

  tuWays: Ref<number[]>;
  changeTuWays: (ways: number[]) => void;
};

function activeForwarder(): ActiveForwarder {
  const forwarderWays = ref([] as number[]);
  const tuWays = ref([] as number[]);

  const changeForwarderWays = (ways: number[]) => {
    forwarderWays.value = ways;
  };

  const changeTuWays = (ways: number[]) => {
    tuWays.value = ways;
  };

  return {
    forwarderWays,
    changeForwarderWays,
    tuWays,
    changeTuWays,
  };
}

export default activeForwarder;
