<template>
  <prime-dialog
    v-model:visible="modalState"
    modal
    :header="$t('forwarder.titles.editBaseInfo')"
    style="width: 40rem"
  >
    <form id="editBaseInfo" class="flex flex-column py-1" @submit.prevent="onSubmit">
      <div class="grid align-items-center">
        <label for="edit-baseInfoIsActive" class="col-fixed w-8rem text-lg">
          {{ $t('forwarder.info.isActive') }}:
        </label>

        <div class="col">
          <input-switch
            id="edit-baseInfoIsActive"
            v-model="vv.is_active.$model"
            :disabled="isLoading"
          />
        </div>
      </div>

      <div class="grid align-items-center">
        <label for="edit-baseInfoName" class="col-fixed w-8rem text-lg">
          *{{ $t('forwarder.info.name') }}:
        </label>

        <div class="col">
          <input-text
            id="edit-baseInfoName"
            v-model="vv.name.$model"
            type="text"
            class="w-full"
            :class="vv.name.$error ? 'p-invalid' : ''"
            :placeholder="$t('forwarder.info.name')"
            :readonly="isLoading"
            v-tooltip="{
              value: errorMessage(vv.name.$errors),
              disabled: !errorMessage(vv.name.$errors),
            }"
          />
        </div>
      </div>

      <div v-if="!formData.is_active" class="grid align-items-center">
        <label for="edit-baseInfoReason" class="col-fixed w-8rem text-lg">
          *{{ $t('forwarder.info.reason') }}:
        </label>

        <div class="col">
          <dropdown
            id="baseInfoReason"
            v-model="vv.reason_id.$model"
            :options="reasons"
            option-label="alias"
            option-value="id"
            class="w-full"
            :class="vv.reason_id.$error ? 'p-invalid' : ''"
            :placeholder="$t('forwarder.info.reason')"
            :disabled="isLoading"
            v-tooltip="{
              value: errorMessage(vv.reason_id.$errors),
              disabled: !errorMessage(vv.reason_id.$errors),
            }"
          >
            <template #value="{ value, placeholder }">
              <template v-if="value">
                {{
                  $t(`forwarder.reasons.${reasons.find((reason) => reason.id === value)?.alias}`)
                }}
              </template>

              <template v-else>
                {{ placeholder }}
              </template>
            </template>

            <template #option="{ option }">
              {{ $t(`forwarder.reasons.${option.alias}`) }}
            </template>
          </dropdown>
        </div>
      </div>

      <div
        v-if="!formData.is_active && isOtherReason(formData.reason_id)"
        class="grid align-items-center"
      >
        <label for="edit-baseInfoReasonComment" class="col-fixed w-8rem text-lg">
          *{{ $t('forwarder.info.reasonComment') }}:
        </label>

        <div class="col">
          <prime-textarea
            id="baseInfoReasonComment"
            v-model="vv.reason_comment.$model"
            rows="3"
            class="w-full"
            :class="vv.reason_comment.$error ? 'p-invalid' : ''"
            :placeholder="$t('forwarder.service.reasonComment')"
            style="resize: none"
            :readonly="isLoading"
            v-tooltip="{
              value: errorMessage(vv.reason_comment.$errors),
              disabled: !errorMessage(vv.reason_comment.$errors),
            }"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <prime-button
        :label="$t('forwarder.buttons.cancel')"
        class="p-button-outlined p-button-danger text-base"
        :disabled="isLoading"
        @click="onClose()"
      />

      <prime-button
        form="editBaseInfo"
        :label="$t('forwarder.buttons.save')"
        type="submit"
        :loading="isLoading"
        class="p-button-success text-base"
      />
    </template>
  </prime-dialog>

  <panel v-bind="$attrs" toggleable :header="$t('forwarder.titles.baseInfo')">
    <template #icons>
      <button class="p-panel-header-icon p-link p-mr-2" type="button" @click="onOpen()">
        <span class="pi pi-pencil"></span>
      </button>
    </template>

    <div class="flex align-items-center">
      <h1 class="my-0 mr-5">{{ data.name }}</h1>

      <div class="p-field-checkbox flex align-items-center mr-5" style="pointer-events: none">
        <input-switch :model-value="data.is_active" />

        <label>{{ $t('forwarder.info.isActive') }}</label>
      </div>
    </div>
  </panel>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVuelidate } from '@vuelidate/core';
import { useRoute } from 'vue-router';

import vTooltip from 'primevue/tooltip';
import PrimeDialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import PrimeTextarea from 'primevue/textarea';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';
import useLoginStore from '@/app/login/shared/store/login-store';
import useModal from '@/app/shared/services/hooks/modal';
import useNotification from '@/app/shared/services/hooks/notifications';

import errorMessage from '@/app/shared/utils/error-message';
import { updateBaseInfo } from '@/app/forwarders/shared/services/api';
import { baseInfoShortScheme } from '@/app/forwarders/shared/config/validation-schemes/base-info-scheme';

import type { ForwarderBaseInfoShort } from '@/@types/form-data';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

const props = defineProps({
  data: { type: Object, required: true },
});

const emit = defineEmits(['update-data']);

const route = useRoute();
const infoStore = useInfoStore();
const loginStore = useLoginStore();
const { modalState, onOpen, onClose } = useModal();
const { onSuccess, onError } = useNotification();

const reasons = computed(() => infoStore.reasons);
const userId = computed(() => loginStore.user.id);

const formData: ForwarderBaseInfoShort = reactive({
  name: props.data.name,
  is_active: props.data.is_active,
  user_id: props.data.disable_reason_link?.user_id || userId.value,
  reason_id: props.data.disable_reason_link?.reason_id,
  reason_comment: props.data.disable_reason_link?.comment,
});

const isLoading = ref(false);

const isOtherReason = (id: number): boolean => {
  const current = reasons.value.find((item) => item.id === id);

  return current?.alias === 'other';
};

const vv = useVuelidate(baseInfoShortScheme(formData, isOtherReason), formData);

const onSubmit = async () => {
  vv.value.$touch();

  if (!vv.value.$invalid) {
    isLoading.value = true;

    try {
      const data = await updateBaseInfo(route.params.guid as string, formData);

      onSuccess(data.message);
    } catch (error: unknown) {
      onError(error as CustomError);
    } finally {
      onClose();
      emit('update-data');
      isLoading.value = false;
    }
  }
};

infoStore.getReasons().catch((error) => onError(error));

watch(
  () => formData.is_active,
  (value) => {
    if (value) {
      formData.reason_id = null;
      formData.reason_comment = null;
      vv.value.$reset();
    }
  }
);

watch(
  () => formData.reason_id,
  (value) => {
    if (value != 4) {
      formData.reason_comment = null;
      vv.value.$reset();
    }
  }
);
</script>
