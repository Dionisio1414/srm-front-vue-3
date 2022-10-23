import cloneDeep from 'lodash.clonedeep';

const shipmentScheme = {};

const unitStructure = {
  amount: null,
  size: null,
  type: null,
};

const shipmentStructure = {
  way_ids: [],
  supplier: null,
  forwarder: null,
  shipmentLoadingType: null,
  pointOfLoading: null,
  weight: null,
  volume: null,
  cargoReadyDate: null,
  transportUnits: [cloneDeep(unitStructure)],
};

export { shipmentScheme, unitStructure, shipmentStructure };
