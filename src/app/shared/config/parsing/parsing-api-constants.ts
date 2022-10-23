enum ApiConstants {
  LOAD_COMPARE_FILE = '/order/{guid}/files-to-compare',

  COMPARE = '/order/{guid}/compare-with-file',

  ADD_SUPPLY_FROM_FILE = '/supply-from-file',

  REPLACE_SUPPLY_PRODUCTS = '/supply/{guid}/file/replace-products',

  ADD_SUPPLY_PRODUCTS = '/supply/{guid}/file/products',

  LOAD_SUPPLY_COMPARE_FILE = '/supply/{guid}/file-type/{fileType}',

  SUPPLY_COMPARE = '/supply/{guid}/compare-with-file',
}

export default ApiConstants;
