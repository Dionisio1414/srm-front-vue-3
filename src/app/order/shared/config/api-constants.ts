enum ApiConstants {
  GET_ORDER = '/order/{guid}',

  GET_PRODUCTS = '/order/{guid}/products',

  GET_FILES = '/order/{guid}/files',

  GET_INFO = '/factory/{guid}/info',

  GET_PREPAYMENT = '/order/{guid}/prepayment',

  GET_OVERPAYMENT = '/order/{guid}/check-overpayment',

  SET_PREPAYMENT = '/order/{guid}/prepayment',

  CALCULATE_PREPAYMENT_PERCENTS = '/order/{guid}/prepayment-percent',

  CALCULATE_PREPAYMENT_AMOUNT = '/order/{guid}/prepayment-amount',

  GET_STATUS_HISTORY = '/order/{guid}/status-history',

  GET_CHANGES_HISTORY = '/order/{guid}/frozen/log',

  GET_PRODUCTS_CHANGES_HISTORY = '/order/{guid}/frozen-products/log',

  GET_FILE_LINK = '/order/{guid}/files/{fileGuid}',

  LOAD_FILE = '/order/{guid}/{type}-files',

  DELETE_FILE = '/order/{guid}/files/{fileGuid}',

  SET_COMMENT = '/order/{guid}/comment-create',

  ROLLBACK_STATUS = '/order/{guid}/status-rollback',

  CHANGE_STATUS = '/order/{guid}/status-change',

  CHANGE_ORDER = '/order/{guid}',

  CHANGE_PRODUCTS = '/order/frozen-products/{guid}',

  DELETE_PRODUCTS = '/order/{guid}/products',

  GENERATE_PI = '/order/pi-generate/{guid}',

  GET_MAILS_HISTORY = '/order/{guid}/mail/log',

  GENERATE_LABEL = '/order/{guid}/generate-label',

  GET_FILES_STATUSES = '/order/{guid}/files/statuses',
}

export default ApiConstants;
