import { ref, computed, Ref } from 'vue';

import { useLocalStorage } from '@vueuse/core';

import get from 'lodash.get';

import type { TableField } from '@/@types/table';

interface TableColumns<T> {
  fields: Ref<TableField[]>;
  noDefaultFields: Ref<TableField[]>;
  selectedColumns: Ref<TableField[]>;

  showColumn: (data: T[], key: string, fieldKey?: string) => boolean;
  getColumnData: (name: string) => TableField | undefined;
  columnIsSelected: (name: string) => boolean;
  columnIsEmpty: (data: T[], key: string, fieldKey: string | undefined) => boolean;
}

function tableColumns<T>(tableFields: TableField[], key: string): TableColumns<T> {
  const fields = ref(tableFields);
  const noDefaultFields = computed(() => fields.value.filter((field) => !field.default));

  const selectedColumns = useLocalStorage(key, []);

  const getColumnData = (name: string) => fields.value.find((field) => field.name === name);

  const columnIsSelected = (name: string): boolean =>
    Boolean(
      (selectedColumns as Ref<TableField[]>).value.find((field: TableField) => field.name === name)
    );

  const columnIsEmpty = (data: T[], key: string, fieldKey: string | undefined): boolean => {
    const emptyHandler = (key: string, fieldKey: string | undefined, data: T[], item: T): T[] => {
      const isArray = Array.isArray(get(item, fieldKey || key));

      if (!isArray && (get(item, key) === null || get(item, key) === '')) {
        data.push(item);
      } else if (isArray && !get(item, fieldKey || key)?.length) {
        data.push(item);
      }

      return data;
    };

    const empty = data.reduce(emptyHandler.bind(null, key, fieldKey), []);

    return empty.length === data.length;
  };

  const showColumn = (data: T[], key: string, fieldKey?: string): boolean =>
    (getColumnData(key)?.default && !columnIsEmpty(data, key, fieldKey)) ||
    (getColumnData(key)?.default && !data.length) ||
    (columnIsSelected(key) && !columnIsEmpty(data, key, fieldKey)) ||
    (columnIsSelected(key) && !data.length);

  return {
    fields,
    noDefaultFields,
    selectedColumns: selectedColumns as Ref<TableField[]>,

    showColumn,
    getColumnData,
    columnIsSelected,
    columnIsEmpty,
  };
}

export default tableColumns;
