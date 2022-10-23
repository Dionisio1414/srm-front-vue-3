import { ref, Ref } from 'vue';
import cloneDeep from 'lodash.clonedeep';

import { baseInfoStructure } from '@/app/forwarders/shared/config/validation-schemes/base-info-scheme';
import { contactsStructure } from '@/app/forwarders/shared/config/validation-schemes/contacts-scheme';
import { legalStructure } from '@/app/forwarders/shared/config/validation-schemes/legal-scheme';

import type {
  ForwarderBaseInfo,
  ForwarderContact,
  ForwarderContactPerson,
  ForwarderLegal,
} from '@/@types/form-data';

type UpdateBaseData = { key: keyof ForwarderBaseInfo; value: never };
type UpdateContactData = { key: keyof ForwarderContact; value: never };
type UpdatePerson = { key: keyof ForwarderContactPerson; index: number; value: never };
type UpdateLegalData = { key: keyof ForwarderLegal; index: number; value: never };

type Forwarders = {
  base: Ref<ForwarderBaseInfo>;
  contact: Ref<ForwarderContact>;
  legal: Ref<ForwarderLegal[]>;

  updateBaseData: ({ key, value }: UpdateBaseData) => void;

  addPerson: () => void;
  removePerson: (index: number) => void;
  updateContactData: ({ key, value }: UpdateContactData) => void;
  updatePerson: ({ key, index, value }: UpdatePerson) => void;

  addLegalInfo: () => void;
  removeLegalInfo: (index: number) => void;
  updateLegalData: ({ key, index, value }: UpdateLegalData) => void;

  resetFormData: () => void;
};

function forwarders(): Forwarders {
  const base = ref(cloneDeep(baseInfoStructure));
  const contact: Ref<ForwarderContact> = ref(cloneDeep(contactsStructure));
  const legal: Ref<ForwarderLegal[]> = ref([cloneDeep(legalStructure)]);

  const updateBaseData = ({ key, value }: UpdateBaseData): void => {
    const cloned = cloneDeep(base.value);

    cloned[key] = value;
    base.value = cloned;
  };

  const addPerson = (): void => {
    const cloned = cloneDeep(contact.value);
    const person = cloneDeep(contactsStructure.persons[0]);

    cloned.persons.push(person);
    contact.value = cloned;
  };

  const removePerson = (index: number): void => {
    const cloned = cloneDeep(contact.value);
    cloned.persons.splice(index, 1);

    contact.value = cloned;
  };

  const updateContactData = ({ key, value }: UpdateContactData): void => {
    const cloned = cloneDeep(contact.value);

    cloned[key] = value;
    contact.value = cloned;
  };

  const updatePerson = ({ key, index, value }: UpdatePerson): void => {
    const cloned = cloneDeep(contact.value);

    cloned.persons[index][key] = value;
    contact.value = cloned;
  };

  const addLegalInfo = (): void => {
    const cloned = cloneDeep(legal.value);
    const item = cloneDeep(legalStructure);

    item.is_active = false;
    item.is_primary = false;

    cloned.push(item);

    legal.value = cloned;
  };

  const removeLegalInfo = (index: number): void => {
    const cloned = cloneDeep(legal.value);
    cloned.splice(index, 1);

    legal.value = cloned;
  };

  const updateLegalData = ({ key, index, value }: UpdateLegalData): void => {
    const cloned = cloneDeep(legal.value);

    cloned[index][key] = value;

    legal.value = cloned;
  };

  const resetFormData = () => {
    base.value = baseInfoStructure;
    contact.value = contactsStructure;
    legal.value = [legalStructure];
  };

  return {
    base,
    contact,
    legal,

    updateBaseData,

    addPerson,
    removePerson,
    updateContactData,
    updatePerson,

    addLegalInfo,
    removeLegalInfo,
    updateLegalData,

    resetFormData,
  };
}

export default forwarders;
