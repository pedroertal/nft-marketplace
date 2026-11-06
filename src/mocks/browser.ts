import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function enableMocking(): Promise<void> {
  // Inicia o worker apenas no browser
  if (typeof window === 'undefined') {
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    (window as any).__MSW_READY__ = true;
    console.info('[MSW] Mocking habilitado com sucesso.');
  } catch (err) {
    console.error('[MSW] Erro ao inicializar o service worker:', err);
  }
}
