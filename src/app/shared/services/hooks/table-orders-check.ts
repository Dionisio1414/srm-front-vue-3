import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';

import useTablesStore from '@/app/shared/store/tables-store';

import cloneDeep from 'lodash.clonedeep';
import type { TablesState } from '@/app/shared/store/tables-store';
import type { ListOrder } from '@/@types/order';

interface ITableOrdersCheckParams<T, K> {
  key: keyof TablesState;
  defaultFilters: K;
  defaultSchema: T;
}

interface IOrdersCheckParams {
  data: ListOrder[];
  init: boolean;
  callback: () => void;
}

interface ITableOrdersCheck {
  ordersCheckHandler: (payload: IOrdersCheckParams) => void;
}

const tableOrdersCheck = <T, K>({
  key,
  defaultFilters,
  defaultSchema,
}: ITableOrdersCheckParams<T, K>): ITableOrdersCheck => {
  const tablesStore = useTablesStore();
  const confirm = useConfirm();
  const { t } = useI18n();

  const ordersCheckHandler = ({ data, init, callback }: IOrdersCheckParams) => {
    if (!data?.length && init) {
      confirm.require({
        message: t('orders.noOrdersMessage'),
        header: t('orders.noOrdersHeader'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('orders.noOrdersAccept'),
        rejectLabel: t('orders.noOrdersReject'),

        accept: () => {
          tablesStore.setFilters(key, cloneDeep(defaultFilters));
          tablesStore.setScheme(key, cloneDeep(defaultSchema) as never);
          tablesStore.setSort(key, { sortKey: null, orderBy: null });

          if (callback) callback();
        },
      });
    }
  };

  return { ordersCheckHandler };
};

export default tableOrdersCheck;
