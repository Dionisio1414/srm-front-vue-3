enum ApiConstants {
  GET_SUPPLY = '/supply/{guid}',

  SUPPLY_PRODUCTS = '/supply/{guid}/products',

  DELETE_SUPPLY_PRODUCT = '/supply/product/{guid}',

  SET_SUPPLY_PRODUCTS = '/supply/{guid}/products',

  GET_FILES = '/supply/{guid}/files?type={typeFiles}',

  ADD_FILE = '/supply/{guid}/file-type/{fileType}',

  DELETE_FILE = '/supply/file/{guid}',

  GET_FILE_LINK = '/supply/{guid}/files/{fileGuid}',

  GET_STATUS_HISTORY = '/supply/{guid}/status-history',

  CHANGE_STATUS = '/supply/{guid}/status',

  GET_SUPPLY_ORDERS = '/supply/{guid}/orders',

  CHANGE_CARGO_READY_DATE = '/supply/cargo-ready-date/{guid}',

  ROLLBACK_STATUS = '/supply/{guid}/status-rollback',
}

export default ApiConstants;
