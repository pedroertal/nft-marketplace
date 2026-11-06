export interface SocketEventEnvelope<T> {
  eventId: string;
  timestamp: number;
  entityType: 'NFT' | 'ORDER';
  entityId: string;
  version: number; // Contador incremental de versão para ordenação e descarte de eventos obsoletos
  data: T;
}

export interface NftUpdatedData {
  id: string;
  price: string;
  availableEditions: number;
  status: 'ACTIVE' | 'SOLD_OUT' | 'PAUSED';
}

export interface OrderUpdatedData {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  txHash?: string;
  failureReason?: string;
}

export type SocketClientEvents = {
  'nft.updated': (envelope: SocketEventEnvelope<NftUpdatedData>) => void;
  'order.updated': (envelope: SocketEventEnvelope<OrderUpdatedData>) => void;
  reconnect: () => void;
  disconnect: () => void;
};
