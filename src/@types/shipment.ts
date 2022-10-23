interface ShipmentsForwarder {
  guid: string;
  name: string;
}

interface ShipmentsLoadingType {
  id: number;
  type: string;
}

interface ShipmentsStatus {
  id: number;
  alias: string;
}

type ShipmentsSupplier = ShipmentsForwarder;

interface ShipmentsTransportUnit {
  amount: number;
  guid: string;
  size: { id: number; value: string };
  type: { id: number; name: string };
}

interface Shipments {
  cargoReadyDate: string;
  createdAt: string;
  deliveryCost: number;
  guid: string;
  pointOfLoading: number;
  volume: number;
  wayIds: number[];
  weight: number;

  forwarder: ShipmentsForwarder;
  shipmentLoadingType: ShipmentsLoadingType;
  status: ShipmentsStatus;
  supplier: ShipmentsSupplier;
  transportUnits: ShipmentsTransportUnit[];
}

export type {
  ShipmentsForwarder,
  ShipmentsLoadingType,
  ShipmentsStatus,
  ShipmentsSupplier,
  ShipmentsTransportUnit,
  Shipments,
};
