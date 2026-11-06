import { socketClient } from '@/lib/socket-client';
import { db } from '../db/state';
import { SocketEventEnvelope, NftUpdatedData, OrderUpdatedData } from '@/types/events';

let simulationInterval: any = null;

// Simulação pontual de alteração de preço ou edições de um NFT
export function simulateNftPriceChange(nftId: string, newPrice: string): SocketEventEnvelope<NftUpdatedData> | null {
  const nft = db.getNftById(nftId);
  if (!nft) return null;

  const updated = db.updateNft(nftId, { price: newPrice });
  if (!updated) return null;

  const envelope: SocketEventEnvelope<NftUpdatedData> = {
    eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    entityType: 'NFT',
    entityId: updated.id,
    version: updated.version,
    data: {
      id: updated.id,
      price: updated.price,
      availableEditions: updated.availableEditions,
      status: updated.status,
    },
  };

  console.info(`[Socket Mock] Disparando evento nft.updated para NFT #${nftId} -> ${newPrice} ETH (v${updated.version})`);
  socketClient.emitNftUpdated(envelope);
  return envelope;
}

// Simulação de confirmação em tempo real de pedido pendente
export function simulateOrderUpdate(
  orderId: string,
  status: 'CONFIRMED' | 'REJECTED'
): SocketEventEnvelope<OrderUpdatedData> {
  const envelope: SocketEventEnvelope<OrderUpdatedData> = {
    eventId: `evt-ord-${Date.now()}`,
    timestamp: Date.now(),
    entityType: 'ORDER',
    entityId: orderId,
    version: Date.now(),
    data: {
      orderId,
      status,
      txHash:
        status === 'CONFIRMED'
          ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
          : undefined,
    },
  };

  console.info(`[Socket Mock] Disparando evento order.updated para Pedido ${orderId} -> Status: ${status}`);
  socketClient.emitOrderUpdated(envelope);
  return envelope;
}

// Inicializador de simulação em tempo real para o browser e suites Playwright
export function startSocketSimulation(): void {
  if (typeof window === 'undefined') return;

  // Anexa gatilhos globais para testes de automação E2E (Sprint 7)
  (window as any).__SIMULATE_NFT_PRICE_CHANGE__ = simulateNftPriceChange;
  (window as any).__SIMULATE_ORDER_UPDATE__ = simulateOrderUpdate;
  (window as any).__TRIGGER_SOCKET_RECONNECT__ = () => socketClient.reconnect();

  // Simulação periódica suave a cada 40 segundos para demonstrar reatividade
  if (!simulationInterval) {
    simulationInterval = setInterval(() => {
      // Alterna entre Cyber Samurai (nft-1) e Neon Odyssey (nft-2)
      const targetId = Math.random() > 0.5 ? 'nft-1' : 'nft-2';
      const nft = db.getNftById(targetId);
      if (nft) {
        // Flutuação leve de +/- 5% a 10%
        const currentNum = parseFloat(nft.price);
        const delta = (Math.random() * 0.15 - 0.05).toFixed(4);
        const newPrice = Math.max(0.1, currentNum + parseFloat(delta)).toFixed(4);
        simulateNftPriceChange(targetId, newPrice);
      }
    }, 45000);
  }
}

export function stopSocketSimulation(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}
