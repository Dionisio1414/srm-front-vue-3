enum ApiConstants {
  GET_PRICES = '/forwarder-prices',

  GET_PRICE = '/forwarder-price/{guid}',

  CREATE_PRICE = '/forwarder-price',

  MOVE_PRICE_TO_ACTIVE = '/forwarder-price/{guid}/move-to-active',

  MOVE_PRICE_TO_ARCHIVE = '/forwarder-price/{guid}/move-to-archive',

  CHANGE_RELEVANT_DATE = '/forwarder-price/{guid}/relevant-date',

  CHANGE_PRICE_EXPANSE = '/forwarder-price/{guid}/expance-fields',
}

export default ApiConstants;
