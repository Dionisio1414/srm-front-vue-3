import { ComputedRef, reactive, Ref, ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';

import useNotification from '@/app/shared/services/hooks/notifications';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import { changeRelevantDate } from '@/app/price/shared/services/api';

import type { PriceItem } from '@/@types/price';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

type PriceItemRelevantDates = {
  dates: { from: string; to: string };
  isLoading: Ref<boolean>;
  saveRelevantDate: () => Promise<void>;
};

function priceItemRelevantDates(price: ComputedRef<PriceItem>): PriceItemRelevantDates {
  const { t } = useI18n();
  const isLoading = ref(false);
  const { onError, onSuccess } = useNotification();

  const dates = reactive({
    from: formatDate(price.value.relevant_date_from),
    to: formatDate(price.value.relevant_date_to),
  });

  watch(price, (price) => {
    dates.from = formatDate(price.relevant_date_from);
    dates.to = formatDate(price.relevant_date_to);
  });

  const saveRelevantDate = async () => {
    try {
      isLoading.value = true;

      await changeRelevantDate(price.value.guid, {
        relevant_date_from: formatDate(dates.from),
        relevant_date_to: formatDate(dates.to),
      });

      onSuccess(t('price.messages.dateChanged'));
    } catch (error) {
      onError(error as CustomError);
    } finally {
      isLoading.value = false;
    }
  };

  const setToDate = (date: string | null) => {
    const fromDate = new Date(date || '');
    fromDate.setDate(fromDate.getDate() + 30);

    dates.to = formatDate(fromDate);
  };

  watch(
    () => dates.from,
    (date) => {
      if (!dates.to && date) {
        setToDate(date);
      } else {
        const fromDate = new Date(date || '');
        const toDate = new Date(dates.to || '');

        if (date && fromDate > toDate) {
          setToDate(date);
        }
      }
    }
  );

  return { dates, isLoading, saveRelevantDate };
}

export default priceItemRelevantDates;
