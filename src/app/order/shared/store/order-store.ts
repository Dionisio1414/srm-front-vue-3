import { defineStore } from 'pinia';
import uniq from 'lodash.uniq';
import cloneDeep from 'lodash.clonedeep';
import sortBy from 'lodash.sortby';

import {
  getOrder,
  getProducts,
  getFiles,
  getInfo,
  getPrepayment,
  getOverpayment,
  getStatusHistory,
  getChangesHistory,
  getProductsChangesHistory,
  addFile,
  deleteFile,
  setComment,
  rollbackStatus,
  changeStatus,
  generatePi,
  getMailsHistory,
  getFilesStatus,
} from '@/app/order/shared/services/api';

import {
  STATUSES_FOR_DELETE_PI_FILES,
  STATUSES_FOR_CHANGE,
  STATUSES_FOR_OPERATOR_CHANGE,
  STATUSES_FOR_UPLOAD_PAYMENT,
  STATUSES_NOT_ROLLBACK,
  GENERATE_PI,
} from '@/app/order/shared/config/history-statuses-constants';
import {
  DRAFT_STATUSES,
  PLANNED_STATUSES,
  ORDER_STATUSES,
} from '@/app/orders/shared/config/statuses-constants';

import type {
  Order,
  Info,
  StatusHistory,
  OrderLog,
  ProductLog,
  MailsHistory,
  FileStatus,
} from '@/@types/order';
import type { Product } from '@/@types/product';
import type { OrderFiles, FileInner, Prepayment, Overpayment } from '@/@types/additional';

interface OrderState {
  order: Order;

  products: Product[];
  totalPrice: number;
  totalQty: number;

  files: OrderFiles;

  info: Info;
  prepayment: Prepayment;
  overpayment: Overpayment;

  statusHistory: StatusHistory[];
  changesHistory: OrderLog[];
  productsChangesHistory: ProductLog[];
  mailsHistory: MailsHistory[];

  filesStatus: FileStatus[];

  loading: boolean;
  filesLoading: boolean;
}

type Brand = { name: string; total: number };

const brandsReducer = (brands: Brand[], product: Product): Brand[] => {
  const index = brands.findIndex((brand) => brand.name === product.brand.name);

  if (index > -1) {
    brands[index].total += product.price.total_usd;
  } else {
    brands.push({ name: product.brand.name, total: product.price.total_usd });
  }

  return brands;
};

const useOrderStore = defineStore('order', {
  state: () =>
    ({
      order: {} as Order,

      products: [],
      totalPrice: 0,
      totalQty: 0,

      files: {} as OrderFiles,

      info: {} as Info,
      prepayment: {} as Prepayment,
      overpayment: {} as Overpayment,

      statusHistory: [],
      changesHistory: [],
      productsChangesHistory: [],
      mailsHistory: [],

      filesStatus: [],

      loading: false,
      filesLoading: false,
    } as OrderState),

  getters: {
    categories(state) {
      const allCategories = state.products.map((item) => item.categoryName.en);

      return uniq(allCategories);
    },

    brands(state) {
      const allBrands = state.products.map((item) => item.brand.name);

      return uniq(allBrands);
    },

    factoryGuid(state) {
      return state.order.factory?.guid || '';
    },

    piDeletionAllowed() {
      return (id: number) => STATUSES_FOR_DELETE_PI_FILES.includes(id);
    },

    changedAllowed() {
      return (id: number) => STATUSES_FOR_CHANGE.includes(id);
    },

    changedAllowedForOperator() {
      return (id: number) => STATUSES_FOR_OPERATOR_CHANGE.includes(id);
    },

    productsBrands(state) {
      return state.products?.reduce(brandsReducer, []);
    },

    isDraftOrder(state) {
      return DRAFT_STATUSES.includes(state.order?.status?.id);
    },

    isPlannedOrder(state) {
      return PLANNED_STATUSES.includes(state.order?.status?.id);
    },

    isOrder(state) {
      return ORDER_STATUSES.includes(state.order?.status?.id);
    },

    paymentUploadAllowed() {
      return (id: number) => STATUSES_FOR_UPLOAD_PAYMENT.includes(id);
    },

    statusRollbackAllowed() {
      return (id: number) => !STATUSES_NOT_ROLLBACK.includes(id);
    },

    piFileStatus(state) {
      return state.filesStatus.find((status) => status.type === 'order_pi');
    },

    labelFileStatus(state) {
      return state.filesStatus.find((status) => status.type === 'order_label');
    },

    generatePiAccept(state) {
      return GENERATE_PI.includes(state.order.status?.id);
    },
  },

  actions: {
    async getOrder(guid: string) {
      this.order = await getOrder(guid);
    },

    async getProducts(guid: string) {
      try {
        this.loading = true;

        const data = await getProducts(guid);

        this.products = data.items;
        this.totalPrice = data.totalUsd;
        this.totalQty = data.totalQty;
      } finally {
        this.loading = false;
      }
    },

    async getFiles(guid: string, hideLoader = false) {
      try {
        this.filesLoading = !hideLoader;

        const data = await getFiles(guid);

        this.files = data;
      } finally {
        this.filesLoading = false;
      }
    },

    async getInfo(guid: string, factoryGuid: string) {
      this.info = await getInfo(guid, factoryGuid);
    },

    async getPrepayment(guid: string) {
      this.prepayment = await getPrepayment(guid);
    },

    async getOverpayment(guid: string) {
      this.overpayment = await getOverpayment(guid);
    },

    async getStatusHistory(guid: string) {
      this.statusHistory = await getStatusHistory(guid);
    },

    async getChangesHistory(guid: string) {
      const data = await getChangesHistory(guid);
      this.changesHistory = sortBy(data, [
        (o: { created_at: string }) => new Date(o.created_at),
      ]).reverse();
    },

    async getProductsChangesHistory(guid: string) {
      const data = await getProductsChangesHistory(guid);

      this.productsChangesHistory = sortBy(data, [
        (o: { created_at: string }) => new Date(o.created_at),
      ]).reverse();
    },

    async addFile(guid: string, type: keyof OrderFiles, formData: FormData) {
      this.setFiles(await addFile(guid, type, formData));
    },

    async deleteFile(type: keyof OrderFiles, guid: string, fileGuid: string) {
      await deleteFile(guid, fileGuid);

      this.removeFile(type, fileGuid);
    },

    async rollbackStatus(guid: string) {
      this.updateStatusHistory(await rollbackStatus(guid), false);
    },

    async setComment(guid: string, statusId: number, comment: string) {
      this.updateStatusHistory(await setComment(guid, statusId, comment), true);
    },

    async changeStatus(guid: string, statusId: number, reasonId?: number, comment?: string) {
      this.updateStatusHistory(await changeStatus(guid, statusId, reasonId, comment), false);
    },

    async generatePi(guid: string) {
      try {
        this.filesLoading = true;

        this.files = await generatePi(guid);
      } finally {
        this.filesLoading = false;
      }
    },

    async getMailsHistory(guid: string) {
      const data = await getMailsHistory(guid);

      this.mailsHistory = sortBy(data, [
        (o: { created_at: string }) => new Date(o.created_at),
      ]).reverse();
    },

    async getFileStatus(guid: string) {
      this.filesStatus = await getFilesStatus(guid);
    },

    setFiles(files: OrderFiles) {
      Object.entries(files).forEach(([key, value]) => {
        const files = this.files[key as keyof OrderFiles];

        if (files) {
          const clonedFiles = cloneDeep(files);

          this.files[key as keyof OrderFiles] = [...clonedFiles, ...(value as FileInner[])];
        } else {
          this.files[key as keyof OrderFiles] = value;
        }
      });
    },

    removeFile(type: keyof OrderFiles, fileGuid: string) {
      const files = cloneDeep(this.files[type as keyof OrderFiles]);
      const fileIndex = files?.findIndex((file) => file.fileGuid === fileGuid);

      if (fileIndex !== undefined && fileIndex > -1) {
        files?.splice(fileIndex, 1);

        this.files[type as keyof OrderFiles] = files;
      }
    },

    updateStatusHistory(data: StatusHistory, isComment: boolean) {
      const history = cloneDeep(this.statusHistory);

      if (isComment) history.shift();

      history.unshift(data);

      this.statusHistory = history;
    },

    resetData() {
      this.info = {} as Info;
      this.prepayment = {} as Prepayment;
    },
  },
});

export default useOrderStore;
export type { OrderState };
