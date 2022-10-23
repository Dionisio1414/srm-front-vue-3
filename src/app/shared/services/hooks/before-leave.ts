import { ComputedRef, ref } from 'vue';

import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

function beforeLeave(condition: ComputedRef<boolean>): void {
  const router = useRouter();
  const confirm = useConfirm();
  const { t } = useI18n();

  const changeRoute = ref(false);

  onBeforeRouteLeave((to): boolean => {
    if (condition.value) {
      confirm.require({
        message: t('orders.leaveMessage'),
        header: t('orders.leaveHeader'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('orders.leaveAccept'),
        rejectLabel: t('orders.leaveReject'),

        accept: () => {
          changeRoute.value = true;

          router.push(to).then(() => confirm.close());
        },

        reject: () => {
          changeRoute.value = false;
        },
      });

      return changeRoute.value;
    }

    return true;
  });
}

export default beforeLeave;
