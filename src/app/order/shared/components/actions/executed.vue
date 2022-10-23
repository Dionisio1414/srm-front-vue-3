<template>
  <prime-button
    :label="translate(alias, script.alias)"
    class="p-button-outlined p-button-success mt-2 mr-2"
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import PrimeButton from 'primevue/button';

import useTranslation from '@/app/order/shared/services/hooks/translations';

import type { StatusHistoryScenario, StatusHistoryStatus } from '@/@types/order';

const props = defineProps({
  alias: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
  script: { type: Object as PropType<StatusHistoryScenario>, required: true },
});

const emit = defineEmits(['change-status']);

const { t } = useI18n();
const confirm = useConfirm();
const { getScenarioTranslate: translate } = useTranslation();

const onClick = () => {
  confirm.require({
    message: translate(props.alias, 'popupTheme'),
    header: t('order.titles.confirmationExecuted'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: translate(props.alias, 'popupOkTitle'),
    rejectLabel: translate(props.alias, 'popupCancelTitle'),
    accept: () => emit('change-status', { statusId: props.script.id }),
  });
};
</script>
