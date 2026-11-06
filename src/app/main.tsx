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
  // Inicializa o MSW no browser antes de montar a árvore de componentes
  if (import.meta.env.DEV) {
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
