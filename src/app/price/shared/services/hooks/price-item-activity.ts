import { computed, ComputedRef, reactive, Ref, ref, toRefs, watch } from 'vue';

import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';

import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { activityValidator } from '@/app/price/shared/config/validation-schemes';
import { movePriceToActive, movePriceToArchive } from '@/app/price/shared/services/api';

import type { PriceItem } from '@/@types/price';
import type { Reason } from '@/@types/additional';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

type PriceItemActivity = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vv: any;
  activity: {
    isActive: boolean;
    comment: null | string;
    reasonId: null | number;
  };
  isLoading: Ref<boolean>;
  reasons: ComputedRef<Reason[]>;
  getReasons: () => void;
  getReasonName: (id: number) => string;
  isOtherReason: (id: number) => boolean;
  saveActivity: () => Promise<void>;
};

function priceItemActivity(price: ComputedRef<PriceItem>, callback: () => void): PriceItemActivity {
  const infoStore = useInfoStore();
  const { t } = useI18n();
  const { onError, onSuccess } = useNotification();

  const isLoading = ref(false);

  const reasons = computed(() => infoStore.forwarderReasons);

  const isOtherReason = (id: number): boolean => {
    const current = reasons.value.find((item) => item.id === id);

    return current?.alias === 'other';
  };

  const activity = reactive({
    isActive: price.value.is_active,
    comment: price.value.disable_reason_link?.comment,
    reasonId: price.value.disable_reason_link?.reason_id,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vv = useVuelidate(activityValidator(activity, isOtherReason), toRefs(activity as any));

  watch(price, (price) => {
    activity.isActive = price.is_active;
    activity.comment = price.disable_reason_link.comment;
    activity.reasonId = price.disable_reason_link.reason_id;
  });

  const getReasons = () => {
    infoStore.getForwarderReasons().catch((error) => onError(error));
  };

  const getReasonName = (id: number) => {
    const reason = reasons.value.find((item) => item.id === id);

    return reason?.alias || '';
  };

  const saveActivity = async () => {
    vv.value.$touch();

    if (!vv.value.$invalid) {
      isLoading.value = true;

      try {
        if (activity.isActive) {
          await movePriceToActive(price.value.guid);

          onSuccess(t('price.messages.movedToActive'));
          callback();
        } else {
          await movePriceToArchive(price.value.guid, {
            reason_id: activity.reasonId as number,
            comment: activity.comment as string,
          });

          onSuccess(t('price.messages.movedToArchive'));
          callback();
        }
      } catch (error) {
        onError(error as CustomError);
      } finally {
        isLoading.value = false;
      }
    }
  };

  return {
    vv,
    activity,
    isLoading,
    reasons,
    getReasons,
    getReasonName,
    isOtherReason,
    saveActivity,
  };
}

export default priceItemActivity;
