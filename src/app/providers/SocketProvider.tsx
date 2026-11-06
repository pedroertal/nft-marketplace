import * as React from 'react';
import { socketClient, TypedSocketClient } from '@/lib/socket-client';
import { useCartReconciliation } from '@/features/cart/hooks/useCartReconciliation';
import { startSocketSimulation, stopSocketSimulation } from '@/mocks/socket/socket-mock';

interface SocketContextType {
  isConnected: boolean;
  reconnect: () => void;
  socket: TypedSocketClient;
}

const SocketContext = React.createContext<SocketContextType>({
  isConnected: false,
  reconnect: () => {},
  socket: socketClient,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = React.useState<boolean>(socketClient.isConnected);

  // Ativa a reconciliação do carrinho e do catálogo com os eventos de tempo real
  useCartReconciliation();

  React.useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);
    socketClient.on('reconnect', handleConnect);

    // Inicia a simulação de WebSocket
    startSocketSimulation();

    return () => {
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
      socketClient.off('reconnect', handleConnect);
      stopSocketSimulation();
    };
  }, []);

  const reconnect = React.useCallback(() => {
    socketClient.reconnect();
  }, []);

  const value = React.useMemo(
    () => ({
      isConnected,
      reconnect,
      socket: socketClient,
    }),
    [isConnected, reconnect]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser utilizado dentro de um SocketProvider');
  }
  return context;
}
