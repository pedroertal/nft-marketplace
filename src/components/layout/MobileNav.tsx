import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingBag, Compass, User, Wallet, Hexagon, X, LogOut } from 'lucide-react';

interface MobileNavProps {
  cartItemCount?: number;
}

export function MobileNav({ cartItemCount = 0 }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu de navegação">
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pb-8">
        <DrawerHeader className="flex items-center justify-between border-b border-white/10 pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-md">
              <Hexagon className="h-4 w-4 text-cyan-300 stroke-[2.2] fill-cyan-400/10" />
            </span>
            <span className="gradient-text font-black">NFT NEXUS</span>
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Fechar menu">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <nav className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 [&.active]:bg-purple-600/20 [&.active]:text-purple-300"
          >
            <Compass className="h-5 w-5 text-purple-400" />
            <span>Explorar Catálogo</span>
          </Link>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 [&.active]:bg-purple-600/20 [&.active]:text-purple-300"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-cyan-400" />
              <span>Carrinho de Compras</span>
            </div>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-bold text-slate-950">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 [&.active]:bg-purple-600/20 [&.active]:text-purple-300"
              >
                <User className="h-5 w-5 text-pink-400" />
                <span>Meu Perfil ({user.name})</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-destructive transition-colors hover:bg-destructive/10 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Desconectar</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 [&.active]:bg-purple-600/20 [&.active]:text-purple-300"
              >
                <User className="h-5 w-5 text-pink-400" />
                <span>Acessar / Entrar</span>
              </Link>

              <div className="pt-2">
                <Link to="/auth/login" onClick={() => setOpen(false)} className="w-full">
                  <Button className="w-full gap-2 py-6 text-base font-semibold shadow-xl shadow-purple-600/20">
                    <Wallet className="h-5 w-5" />
                    Conectar Carteira
                  </Button>
                </Link>
              </div>
            </>
          )}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
