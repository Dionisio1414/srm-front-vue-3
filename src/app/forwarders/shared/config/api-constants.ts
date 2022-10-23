enum ApiConstants {
  GET_FORWARDERS = '/forwarders',

  GET_FORWARDER = '/forwarder/{guid}',

  CREATE_FORWARDER = '/forwarder',

  UPDATE_LEGAL_INFO = '/forwarder/legal-information/{guid}',

  UPDATE_CONTACT_INFO = '/forwarder/{guid}/contacts',

  UPDATE_SERVICE_INFO = '/forwarder/{guid}/service',

  UPDATE_BASE_INFO = '/forwarder/{guid}',

  DELETE_FORWARDER = '/forwarder/{guid}',
}

export default ApiConstants;
