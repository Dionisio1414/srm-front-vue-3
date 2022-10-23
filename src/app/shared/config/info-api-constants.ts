enum ApiConstants {
  GET_STATUSES = '/order/statuses',

  GET_COMPANIES = '/companies',

  GET_MEMBERS = '/user/team/members',

  GET_EXPORTERS = '/order/exporters',

  GET_WAYS = '/forwarder/ways',

  GET_COUNTRIES = '/forwarder/countries',

  GET_PORTS = '/forwarder/ports',

  GET_REASONS = '/forwarder/reasons',

  GET_FORWARDER_WAYS = '/forwarder-price/ways/{guid}',

  GET_FORWARDER_REASONS = '/forwarder-price/reasons',

  GET_FORWARDER_TARIFFS = '/forwarder-price/tariffs',

  GET_FORWARDER_EXPANSE_FIELDS = '/forwarder-price/expance-fields',

  GET_ALL_COUNTRIES = '/countries',

  GET_CURRENCIES = '/currencies',

  GET_INCOTERMS = '/incoterms/list',

  GET_SHIPMENTS_LOADING_TYPES = '/shipments/loading-types',

  GET_SHIPMENTS_STATUSES = '/shipment/statuses',

  GET_DICTIONARY_SIZES = '/dictionary/transport/unit-size',

  GET_DICTIONARY_UNIT_TYPES = '/dictionary/transport/unit-types',

  GET_DICTIONARY_UNIT_TYPES_SIZES = '/dictionary/transport/unit-types-sizes',

  GET_STATUS_REASONS = '/order/status-reasons',

  GET_DELIVERY_PORTS = '/delivery/ports',

  GET_SUPPLY_STATUSES = '/supply/statuses',

  GET_FEATURE_FLAGS = '/system/feature-list',

  CHANGE_FEATURE_STATUS = '/system/feature-change',

  GET_SUPPLIES_ORDERS = '/supplies/orders',
}

export default ApiConstants;
