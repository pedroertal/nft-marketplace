import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';
import { AppProviders } from './providers';
import { enableMocking } from '../mocks/browser';
import '../index.css';

// Criação da instância de rotas com preloading
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Registro estrito para type-safety global no TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

async function bootstrap() {
  // Inicializa o MSW para simulação autônoma (tanto em dev quanto em produção para demonstrações como Vercel)
  // Caso uma API real seja conectada via VITE_API_URL, o MSW é desligado automaticamente.
  const isMockEnabled =
    import.meta.env.DEV ||
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    !import.meta.env.VITE_API_URL;

  if (isMockEnabled) {
    await enableMocking();
  }

  const rootElement = document.getElementById('root');

  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </React.StrictMode>
    );
  }
}

bootstrap();
