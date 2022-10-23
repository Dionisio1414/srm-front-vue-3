<template>
  <prime-button
    class="p-button-outlined mt-2 mr-2"
    :class="`p-button-${script.class}`"
    :label="translate(script.alias, 'button')"
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';

import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import PrimeButton from 'primevue/button';

import useTranslation from '@/app/supply/shared/services/hooks/translations';

import type { SupplyStatus, StatusHistoryScenario } from '@/@types/supply';

const props = defineProps({
  alias: { type: String, required: true },
  status: { type: Object as PropType<SupplyStatus>, required: true },
  script: { type: Object as PropType<StatusHistoryScenario>, required: true },
});

const emit = defineEmits(['change-status']);

const { t } = useI18n();
const confirm = useConfirm();
const { getScenarioTranslate: translate } = useTranslation();

const popupMessage = computed(() =>
  props.script.alias === 'canceled' ? 'popupCanceledMessage' : 'popupMessage'
);

const onClick = () => {
  const status = t(`supply.statusHistory.statuses.${props.script.alias}`).toLowerCase();

  confirm.require({
    header: translate(props.script.alias, 'popupHeader', { status }),
    message: translate(props.script.alias, popupMessage.value, { status }),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: translate(props.script.alias, 'popupOk'),
    rejectLabel: translate(props.script.alias, 'popupCancel'),
    accept: () => emit('change-status', props.script.id),
  });
};
</script>
