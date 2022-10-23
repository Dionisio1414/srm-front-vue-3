import { computed, ComputedRef, nextTick, reactive, Ref, ref, toRef, watch } from 'vue';

import { useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import cloneDeep from 'lodash.clonedeep';

import useLoginStore from '@/app/login/shared/store/login-store';
import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import {
  orderInfoData,
  paymentInfoData,
  bankInfoData,
  piInfoData,
  factoryInfoData,
  termsDeliveryInfoData,
  additionalInfoData,
  deliveryPortsInfoData,
  paymentDelayInfoData,
} from '@/app/order/shared/config/form-data';
import { articlesValidator } from '@/app/order/shared/config/validation-schemes';

import { changeOrder, changeProducts, deleteProducts } from '@/app/order/shared/services/api';

import type {
  OrderFormData,
  BankInfoData,
  FactoryInfoData,
  OrderInfoData,
  PaymentInfoData,
  PiInfoData,
  TermsDeliveryInfoData,
  AdditionalInfoData,
  PortOfLoadingData,
} from '@/@types/form-data';
import type { Order, Info } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { EditedProduct, Product } from '@/@types/product';

type ValueName = keyof (
  | BankInfoData
  | FactoryInfoData
  | OrderInfoData
  | PaymentInfoData
  | PiInfoData
  | TermsDeliveryInfoData
  | AdditionalInfoData
);

type UpdateData = { key: keyof OrderFormData; name: ValueName; value: never; initial?: boolean };
type ProductsData = { index: number; data: Product };
type UpdatePortsData = { key: keyof OrderFormData; value: PortOfLoadingData; initial?: boolean };
interface DataEditing {
  formData: OrderFormData;
  isLoading: Ref<boolean>;
  deleteDisabled: ComputedRef<boolean>;
  generationAvailable: ComputedRef<boolean>;
  isDataEditing: Ref<boolean>;
  clearEditingRows: Ref<boolean>;
  productsData: Ref<Product[]>;

  onSave: () => void;
  onDelete: (payload: ProductsData) => void;
  updateData: (payload: UpdateData) => void;
  updatePortsData: (payload: UpdatePortsData) => void;
  updateProductsData: ({ index, data }: ProductsData) => void;
  changeEditingStatus: () => void;
  changeEditingProducts: (payload: { guid: string; remove: boolean }) => void;
}

function dataEditing(callback: () => Promise<void>): DataEditing {
  const route = useRoute();
  const loginStore = useLoginStore();
  const orderStore = useOrderStore();
  const vv = useVuelidate();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { onSuccess, onError } = useNotification();

  const isLoading = ref(false);
  const isDataEditing = ref(false);
  const isOrderChanged = ref(false);
  const changedProducts: Ref<string[]> = ref([]);
  const clearEditingRows = ref(false);

  const productsData = reactive({ data: [] as Product[] });
  const editedProducts = reactive({ data: [] as Product[] });
  const deletedProducts = reactive({ data: [] as Product[] });

  const order = computed(() => orderStore.order);
  const products = computed(() => orderStore.products);
  const info = computed(() => orderStore.info);
  const user = computed(() => loginStore.user);
  const userHasRole = computed(() => loginStore.userHasRole);

  const deleteDisabled = computed(
    () => productsData.data.length - deletedProducts.data.length === 1
  );

  const formData: OrderFormData = reactive({
    orderInfo: orderInfoData(order.value, order.value.plt || {}, order.value.exporter || {}),
    payData: paymentInfoData(info.value.payData || {}),
    bankData: bankInfoData(info.value.bankData || {}),
    proformaInvoice: piInfoData(info.value.proformaInvoice || {}),
    factoryData: factoryInfoData(order.value.factory || {}),
    termsDeliveryData: termsDeliveryInfoData(
      {
        city: order.value?.factory?.city || '',
        incoterms: info.value?.proformaInvoice?.incoterms,
      } || {},
      1
    ),
    additionalData: additionalInfoData({
      engraving: info?.value?.proformaInvoice?.engraving,
      designAndPacking: info.value?.proformaInvoice?.designAndPacking,
    }),
    deliveryPortsData: deliveryPortsInfoData(info.value?.portOfLoading || {}),
    payDelayInfoData: paymentDelayInfoData(info.value.pay_data_delay || {}),
  });

  const changeEditingStatus = (): void => {
    isDataEditing.value = !isDataEditing.value;
  };

  const dataChangeHandler = ([order, info]: [Order, Info]) => {
    formData.orderInfo = orderInfoData(order, order.plt || {}, order.exporter || {});
    formData.payData = paymentInfoData(info.payData || {});
    formData.bankData = bankInfoData(info.bankData || {});
    formData.proformaInvoice = piInfoData(info.proformaInvoice || {});
    formData.factoryData = factoryInfoData(order.factory || {});
    formData.termsDeliveryData = termsDeliveryInfoData(
      {
        city: order?.factory?.city || '',
        incoterms: info.proformaInvoice?.incoterms,
      },
      info.general?.country || 1
    );
    formData.additionalData = additionalInfoData({
      engraving: info?.proformaInvoice?.engraving,
      designAndPacking: info.proformaInvoice?.designAndPacking,
    });
    formData.deliveryPortsData = deliveryPortsInfoData(info?.portOfLoading || {});
    formData.payDelayInfoData = paymentDelayInfoData(info.pay_data_delay || {});
  };

  const productsChangeHandler = (products: Product[]) => {
    productsData.data = cloneDeep(products);
    editedProducts.data = [];
    deletedProducts.data = [];
  };

  const updateData = ({ key, name, value, initial }: UpdateData): void => {
    const clone = cloneDeep(formData[key]);
    clone[name] = value;

    formData[key] = clone as never;

    if (!initial) {
      isOrderChanged.value = true;
    }
  };

  const updatePortsData = ({ key, value, initial }: UpdatePortsData): void => {
    const clone = cloneDeep(formData[key]) as PortOfLoadingData[];
    const portIndex = clone.findIndex(
      (item) => item.port_delivery_type_id === value.port_delivery_type_id
    );

    if (portIndex === -1) {
      clone.push(value);
    } else {
      clone.splice(portIndex, 1, value);
    }

    formData[key] = clone.filter((item) => item.port_guid && item.port_delivery_type_id) as never;

    if (!initial) {
      isOrderChanged.value = true;
    }
  };

  const updateProductsData = ({ index, data }: ProductsData): void => {
    const clone = cloneDeep(productsData.data);

    clone.splice(index, 1, data);
    productsData.data = clone;

    if (data.initialEdit) return;

    const editedClone = cloneDeep(editedProducts.data);
    const editedIndex = editedClone.findIndex((item) => item.guid === data.guid);

    if (editedIndex > -1) {
      editedClone.splice(editedIndex, 1, data);
    } else {
      editedClone.push(data);
    }

    editedProducts.data = editedClone;
  };

  const formatProduct = (data: Product): EditedProduct =>
    cloneDeep({
      product_guid: data.guid,
      fid: data.fid || '',
      comment: data.comment || '',
      emark_number: data.emarkNumber || '',
      emark_country: data.emarkCountry || '',
      minimal_order_quantity: data.minimalOrderQuantity || '',
      quantity: data.quantity || '',
      price_usd: data.price.usd || '',
      price_eur: data.price.eur || '',
    });

  const saveEditingRows = () => {
    const saveButtons: NodeListOf<Element> = document.querySelectorAll(
      '.order-table .p-row-editor-save'
    );

    Array.from(saveButtons).forEach((button: Element): void => {
      const clickEvent = new Event('click');

      button.dispatchEvent(clickEvent);
    });
  };

  const resetRowEditing = async () => {
    clearEditingRows.value = true;
    await nextTick();
    clearEditingRows.value = false;
  };

  const resetEditingState = () => {
    editedProducts.data = [];
    deletedProducts.data = [];
    changedProducts.value = [];

    isDataEditing.value = false;
    isOrderChanged.value = false;
  };

  const changeEditingProducts = ({ guid, remove }: { guid: string; remove: boolean }) => {
    const index = changedProducts.value.findIndex((id) => id === guid);

    if (remove) changedProducts.value.splice(index, 1);
    else if (!remove && index === -1) changedProducts.value.push(guid);
  };

  const generationAvailable = computed(
    () =>
      Boolean(changedProducts.value.length) ||
      Boolean(deletedProducts.data.length) ||
      isOrderChanged.value
  );

  const saveData = async (): Promise<void> => {
    try {
      isLoading.value = true;

      if (changedProducts.value.length) {
        await changeProducts(
          order.value.guid,
          user.value.id,
          order.value.status.id,
          editedProducts.data.map(formatProduct)
        );
        onSuccess(t('order.productsSaved'));
      }

      if (deletedProducts.data.length) {
        await deleteProducts(
          route.params.guid as string,
          deletedProducts.data.map((item) => item.guid),
          user.value?.id
        );
        onSuccess(t('order.productsDeleted'));
      }

      if (isOrderChanged.value) {
        await changeOrder(
          order.value.guid,
          user.value.id,
          order.value.status.id,
          userHasRole.value('administrator'),
          formData
        );
        onSuccess(t('order.dataSaved'));
      }

      if (generationAvailable.value) {
        await orderStore.generatePi(route.params.guid as string);
        onSuccess(t('order.piGenerated'));

        await callback();

        resetEditingState();

        orderStore.getChangesHistory(route.params.guid as string);
        orderStore.getProductsChangesHistory(route.params.guid as string);
      }
    } catch (error) {
      onError(error as CustomError);
    } finally {
      isLoading.value = false;
    }
  };

  const onSave = (): void => {
    vv.value.$touch();

    saveEditingRows();
    resetRowEditing();

    if (!vv.value.$invalid && !articlesValidator(editedProducts.data)) {
      confirm.require({
        message: t('order.saveDataMessage'),
        header: t('order.saveDataHeader'),
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: t('order.saveDataAcceptLabel'),
        rejectLabel: t('order.saveDataRejectLabel'),

        accept: saveData,
        reject: () => {
          isDataEditing.value = false;
        },
      });
    } else {
      onError({
        response: {
          status: 400,
          data: { message: t('order.validationError'), errors: [] },
        },
      });
    }
  };

  const disableRow = (index: number) => {
    const rowElement = document.querySelector(
      `.order-table .p-datatable-tbody tr:nth-of-type(${index + 1})`
    );

    rowElement?.setAttribute('style', 'opacity: 0.4; pointer-events: none');
  };

  const removeRowStyles = () => {
    const rowElements = document.querySelectorAll('.order-table .p-datatable-tbody tr');

    Array.from(rowElements).forEach((element) => {
      element.removeAttribute('style');
    });
  };

  const deleteProduct = ({ index, data }: ProductsData): void => {
    deletedProducts.data.push(cloneDeep(data));

    disableRow(index);
  };

  const onDelete = ({ index, data }: ProductsData): void => {
    confirm.require({
      message: t('order.deleteProductMessage'),
      header: t('order.deleteProductHeader'),
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      acceptLabel: t('order.saveDataAcceptLabel'),
      rejectLabel: t('order.saveDataRejectLabel'),

      accept: deleteProduct.bind(null, { index, data }),
    });
  };

  watch([order, info], dataChangeHandler);
  watch(products, productsChangeHandler);

  watch(isDataEditing, (value) => {
    if (!value) {
      resetRowEditing();
      removeRowStyles();
      resetEditingState();
      dataChangeHandler([order.value, info.value]);
      productsChangeHandler(products.value);
    }
  });

  return {
    formData,
    isLoading,
    deleteDisabled,
    generationAvailable,
    isDataEditing,
    clearEditingRows,
    productsData: toRef(productsData, 'data'),

    onSave,
    onDelete,
    updateData,
    updatePortsData,
    updateProductsData,
    changeEditingStatus,
    changeEditingProducts,
  };
}

export default dataEditing;
