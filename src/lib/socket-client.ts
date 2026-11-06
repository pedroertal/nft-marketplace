import {
  SocketEventEnvelope,
  NftUpdatedData,
  OrderUpdatedData,
} from '@/types/events';

export type SocketEventHandler<T = any> = (envelope: SocketEventEnvelope<T>) => void;

export class TypedSocketClient {
  private listeners: Map<string, Set<Function>> = new Map();
  public isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.emitEvent('connect', { timestamp: Date.now() });
  }

  public disconnect(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    this.emitEvent('disconnect', { timestamp: Date.now() });
  }

  public reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.connect();
      this.emitEvent('reconnect', { timestamp: Date.now() });
    }, 400);
  }

  public on<T = any>(event: string, handler: (data: T) => void): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return this;
  }

  public off<T = any>(event: string, handler: (data: T) => void): this {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
    return this;
  }

  public emitEvent(event: string, payload?: any): boolean {
    const handlers = this.listeners.get(event);
    if (handlers && handlers.size > 0) {
      handlers.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[Socket] Erro no handler do evento "${event}":`, err);
        }
      });
      return true;
    }
    return false;
  }

  // Atalhos tipados para eventos canônicos
  public emitNftUpdated(envelope: SocketEventEnvelope<NftUpdatedData>): void {
    this.emitEvent('nft.updated', envelope);
  }

  public emitOrderUpdated(envelope: SocketEventEnvelope<OrderUpdatedData>): void {
    this.emitEvent('order.updated', envelope);
  }
}

// Instância singleton do socket client
export const socketClient = new TypedSocketClient();
