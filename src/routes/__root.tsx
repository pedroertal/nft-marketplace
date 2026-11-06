import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased selection:bg-purple-500/30 selection:text-purple-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      )}
    </div>
  );
}
