enum ApiConstants {
  GET_ORDERS = '/orders',

  GET_PRODUCTS = '/order/{guid}/products',

  MOVE_TO_SWH = '/swh/add-products',

  GET_SHIPMENTS = '/shipments',

  GET_SWH = '/swh?factory={guid}',

  MOVE_TO_SUPPLY = '/supply',

  GET_SUPPLIES = '/supplies',

  GET_FACTORY_SHORT_INFO = '/factory/{guid}/short-info',

  CHANGE_RELIABLE_MARK = '/factory/{guid}/reliable-supplier',

  DELETE_SWH_PRODUCT = '/swh/{guid}',
}

export default ApiConstants;
