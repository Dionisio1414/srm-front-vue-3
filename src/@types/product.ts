import type { OrderFactory } from '@/@types/order';

interface ProductArticle {
  id: number;
  name: string;
  no: string;
  oe: string;
}

interface ProductBrand {
  id: number;
  name: string;
}

interface ProductCategoryName {
  de: string;
  en: string;
  ru: string;
}

interface ProductPrice {
  eur: number;
  rate: number;
  total_usd: number;
  usd: 2;
}

interface Product {
  categoryCode: string;
  categoryId?: string;
  comment: null | string;
  createAt: null | string;
  emarkCountry: null | string | number;
  emarkNumber: null | string;
  fid: null | string;
  guid: string;
  id: number;
  minimalOrderQuantity: number;
  pcsInBox: number;
  quantity: number;
  updatedAt: null | string;

  article: ProductArticle;
  brand: ProductBrand;
  categoryName: ProductCategoryName;
  price: ProductPrice;

  initialEdit?: boolean;
}

interface EditedProduct {
  product_guid: string;
  fid: string;
  comment: string;
  emark_number: string;
  emark_country: string | number;
  minimal_order_quantity: number | string;
  quantity: number | string;
  price_usd: number | string;
  price_eur: number | string;
}

interface SupplierProduct {
  id: number;
  guid: string;
  remainder_quantity: string | number;
  quantity: number;
  find: string | null;
  createdAt: string | null;
  updatedAt: null | string;

  article: ProductArticle;
  brand: ProductBrand;
  categoryName: ProductCategoryName;
  price: ProductPrice;
}

interface ActiveProduct {
  product_guid: string;
  quantity: number | string;
}

interface ActiveSwhProduct {
  swhGuid: string;
  amount: number;
}

interface SupplyProductTotal {
  usd: number;
  eur: number;
  amount: number;
}

interface SupplyProductLegal {
  guid: string;
  factoryAwsId: number;
  shortName: string;
  legalName: string;
  vatId: string;
  paymentReceiver: string;
  iban: string;
  swiftCode: string;
  primary: boolean;
  address: string;
  comment: string;
}

interface SupplyProductStatus {
  alias: string;
  description: string;
  id: number;
}

interface SupplyProduct {
  guid: string;
  supplyNumber: number;
  shipmentGuid: string | null;
  cargoReadyDate: string | null;
  total: SupplyProductTotal;
  files: boolean;
  photos: boolean;
  factory: OrderFactory;
  factoryLegalEntity: SupplyProductLegal;
  status: SupplyProductStatus;
  createdAt: string;
  updatedAt: string;
}

interface SwhProductCategory {
  name_ru: string;
  name_en: string;
  name_de: string;
}

interface SwhProductPrice {
  currency_rate: number;
  price_usd: number;
  price_eur: number;
}

interface SwhProduct {
  all_quantity: number;
  article_id: number;
  article_no: string;
  category_name: SwhProductCategory;
  current_oe: string;
  guid: string;
  moq: number;
  order_number: string;
  price: SwhProductPrice;
  product_guid: number;
  quantity: number;
}

export {
  ProductArticle,
  ProductBrand,
  ProductCategoryName,
  ProductPrice,
  Product,
  EditedProduct,
  SupplierProduct,
  ActiveProduct,
  ActiveSwhProduct,
  SupplyProduct,
  SupplyProductTotal,
  SupplyProductLegal,
  SwhProduct,
  SwhProductCategory,
  SwhProductPrice,
  SupplyProductStatus,
};
