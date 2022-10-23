<template>
  <accordion lazy :active-index="editingAllowed ? 0 : undefined">
    <accordion-tab :header="$t('order.note.title')" :disabled="editingAllowed">
      <ul class="list-decimal text-lg">
        <terms-delivery-data
          v-if="!editingAllowed"
          :country="info?.general?.country || ''"
          :data="{
            city: factory?.city || '',
            incoterms: info?.proformaInvoice?.incoterms,
          }"
        />
        <terms-delivery-edit
          v-else
          :disabled="disabled"
          :data="formData.termsDeliveryData || {}"
          @update-data="$emit('update-data', { key: 'termsDeliveryData', ...$event })"
        />

        <additional-data
          v-if="!editingAllowed"
          :data="{
            designAndPacking: info?.proformaInvoice?.designAndPacking,
            engraving: info?.proformaInvoice?.engraving,
          }"
        />
        <additional-edit
          v-else
          :disabled="disabled"
          :data="formData.additionalData || {}"
          @update-data="$emit('update-data', { key: 'additionalData', ...$event })"
        />

        <pay-data
          v-if="!editingAllowed"
          :data="info?.payData || {}"
          :delay-data="info.pay_data_delay"
        />
        <pay-edit
          v-else
          :disabled="disabled"
          :data="formData.payData || {}"
          :delay-data="formData.payDelayInfoData"
          @update-data="$emit('update-data', { key: 'payData', ...$event })"
          @update-delay-data="$emit('update-delay-data', { key: 'payDelayInfoData', ...$event })"
        />

        <delivery-time-data :plt="plt || {}" />

        <bank-data v-if="!editingAllowed" :data="info?.bankData || {}" />
        <bank-edit
          v-else
          :disabled="disabled"
          :data="formData.bankData || {}"
          @update-data="$emit('update-data', { key: 'bankData', ...$event })"
        />

        <!-- <delivery-data v-if="!editingAllowed" :data="info?.portOfLoading || {}" />
        <delivery-edit
          v-else
          :disabled="disabled"
          :data="info?.portOfLoading || {}"
          :ports="formData.deliveryPortsData || []"
          @update-ports-data="$emit('update-ports-data', { key: 'deliveryPortsData', ...$event })"
        /> -->

        <factory-data
          v-if="!editingAllowed"
          :country="info?.general?.country || ''"
          :factory="factory || {}"
        />
        <factory-edit
          v-else
          :disabled="disabled"
          :data="formData.factoryData || {}"
          :factory="factory || {}"
          @update-data="$emit('update-data', { key: 'factoryData', ...$event })"
        />

        <pi-data v-if="!editingAllowed" :data="info?.proformaInvoice || {}" />
        <pi-edit
          v-else
          :disabled="disabled"
          :data="formData.proformaInvoice || {}"
          @update-data="$emit('update-data', { key: 'proformaInvoice', ...$event })"
        />
      </ul>
    </accordion-tab>
  </accordion>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import useOrderStore from '@/app/order/shared/store/order-store';

import TermsDeliveryData from '@/app/order/shared/components/order-note/data/terms-delivery-data.vue';
import TermsDeliveryEdit from '@/app/order/shared/components/order-note/edit/terms-delivery-edit.vue';

import AdditionalData from '@/app/order/shared/components/order-note/data/additional-data.vue';
import AdditionalEdit from '@/app/order/shared/components/order-note/edit/additional-edit.vue';

import DeliveryTimeData from '@/app/order/shared/components/order-note/data/delivery-time-data.vue';

// import DeliveryData from '@/app/order/shared/components/order-note/data/delivery-data.vue';
// import DeliveryEdit from '@/app/order/shared/components/order-note/edit/delivery-edit.vue';

import PayData from '@/app/order/shared/components/order-note/data/pay-data.vue';
import PayEdit from '@/app/order/shared/components/order-note/edit/pay-edit.vue';

import BankData from '@/app/order/shared/components/order-note/data/bank-data.vue';
import BankEdit from '@/app/order/shared/components/order-note/edit/bank-edit.vue';

import PiData from '@/app/order/shared/components/order-note/data/pi-data.vue';
import PiEdit from '@/app/order/shared/components/order-note/edit/pi-edit.vue';

import FactoryData from '@/app/order/shared/components/order-note/data/factory-data.vue';
import FactoryEdit from '@/app/order/shared/components/order-note/edit/factory-edit.vue';

import type { OrderFormData } from '@/@types/form-data';

defineProps({
  disabled: { type: Boolean, required: true },
  formData: { type: Object as PropType<OrderFormData>, required: true },
  editingAllowed: { type: Boolean, required: true },
});

defineEmits(['update-data', 'update-ports-data', 'update-delay-data']);

const orderStore = useOrderStore();

const info = computed(() => orderStore.info);
const plt = computed(() => orderStore.order.plt);
const factory = computed(() => orderStore.order.factory);
</script>

<style scoped>
:deep(li) {
  word-break: break-word;
}
</style>
