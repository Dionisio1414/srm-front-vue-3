import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';

import useTranslation from '@/app/order/shared/services/hooks/translations';

interface RollbackConfirmation {
  onRollback: (alias: string, isRollback?: boolean) => void;
}

function rollbackConfirmation(callback: () => void): RollbackConfirmation {
  const confirm = useConfirm();
  const { t } = useI18n();
  const { getScenarioTranslate: translate } = useTranslation();

  const onRollback = (alias: string, isRollback?: boolean) => {
    confirm.require({
      message: isRollback ? t('order.rollback.message') : translate(alias, 'popupTheme'),
      header: t('order.rollback.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: isRollback ? t('order.rollback.ok') : translate(alias, 'popupOkTitle'),
      rejectLabel: isRollback ? t('order.rollback.cancel') : translate(alias, 'popupCancelTitle'),
      accept: callback,
    });
  };

  return { onRollback };
}

export default rollbackConfirmation;
