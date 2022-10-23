import { Ref, ref, ToRefs, watch } from 'vue';

import type { ForwarderLegal } from '@/@types/form-data';

type FieldsConnection = {
  thePayeeDefault: Ref<boolean>;
  changeThePayeeHandler: (value: string) => void;
};

function fieldsConnection(
  data: ToRefs<ForwarderLegal>,
  callback: (value: string) => void
): FieldsConnection {
  const thePayeeDefault = ref(true);

  const changeThePayeeHandler = (value: string) => {
    if (value) thePayeeDefault.value = false;
    else thePayeeDefault.value = true;
  };

  watch(
    () => data.legal_name.value,
    (value) => {
      if (thePayeeDefault.value) callback(value as string);
    }
  );

  return { thePayeeDefault, changeThePayeeHandler };
}

export default fieldsConnection;
