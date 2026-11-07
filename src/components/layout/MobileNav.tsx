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
import { Menu, ShoppingBag, Box, User, LogIn, X, LogOut } from 'lucide-react';

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
          <Menu className="h-6 w-6 text-[#f6eee7]" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pb-8 bg-[#18110c] border-[#36261b]">
        <DrawerHeader className="flex items-center justify-between border-b border-[#36261b] pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e07328] to-[#f59e0b] shadow-md">
              <Box className="h-4 w-4 text-white stroke-[2.2]" />
            </span>
            <span className="text-[#f6eee7] font-black tracking-wider">KURIO</span>
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a49386]" aria-label="Fechar menu">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <nav className="mt-6 flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:bg-[#e07328]/15 [&.active]:text-[#f5a267]"
          >
            <span>Início</span>
          </Link>

          <Link
            to="/"
            search={{}}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:bg-[#e07328]/15 [&.active]:text-[#f5a267]"
          >
            <span>Mercado</span>
          </Link>

          <a
            href="/#criadores"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7]"
          >
            <span>Criadores</span>
          </a>

          <a
            href="/#aprenda"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7]"
          >
            <span>Aprenda</span>
          </a>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:bg-[#e07328]/15 [&.active]:text-[#f5a267]"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#e07328]" />
              <span>Carrinho de Compras</span>
            </div>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e07328] px-1.5 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:bg-[#e07328]/15 [&.active]:text-[#f5a267]"
              >
                <User className="h-5 w-5 text-[#e07328]" />
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
            <Link
              to="/auth/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-white bg-[#e07328] hover:bg-[#ea8238] transition-colors mt-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Entrar</span>
            </Link>
          )}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
