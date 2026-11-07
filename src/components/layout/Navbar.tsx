import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/app/providers/AuthProvider';
import { Box, ShoppingBag, LogIn, Search } from 'lucide-react';

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#36261b] bg-[#140e0b]/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e07328] via-[#df6f26] to-[#f59e0b] p-0.5 shadow-lg shadow-orange-950/50">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#140e0b]">
                <Box className="h-4 w-4 text-[#f5a267] stroke-[2.2]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xl font-black tracking-wider text-[#f6eee7]">
                KURIO
              </span>
              <span className="text-[9px] -mt-1 font-mono tracking-widest text-[#e07328]">
                NFT MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:text-[#f6eee7] [&.active]:font-semibold"
            >
              Início
            </Link>
            <Link
              to="/"
              search={{}}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7] [&.active]:text-[#f6eee7] [&.active]:font-semibold"
              aria-label="Explorar Mercado"
            >
              Mercado
            </Link>
            <a
              href="/#criadores"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7]"
            >
              Criadores
            </a>
            <a
              href="/#aprenda"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#c4b5a8] transition-colors hover:bg-[#261c15] hover:text-[#f6eee7]"
            >
              Aprenda
            </a>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden flex-1 max-w-sm mx-4 lg:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a796e]" />
            <input
              type="text"
              placeholder="Buscar coleções, criadores ou NFTs..."
              className="w-full h-9 rounded-full bg-[#1b130e] border border-[#36261b] pl-10 pr-4 text-xs text-[#f6eee7] placeholder:text-[#8a796e] focus:outline-none focus:ring-1 focus:ring-[#e07328] focus:border-[#e07328] transition-all cursor-pointer"
              readOnly
              onClick={() => {
                window.location.href = '/';
              }}
            />
          </div>
        </div>

        {/* Desktop Right Actions: Cart & Profile / Entrar */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart">
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2 border-[#36261b] bg-[#1c140f] hover:bg-[#271d16] text-[#f6eee7]"
              aria-label="Ver carrinho"
            >
              <ShoppingBag className="h-4 w-4 text-[#e07328]" />
              <span className="font-medium text-xs">Carrinho</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="neon"
                  className="h-5 px-1.5 text-[11px] font-bold bg-[#e07328] text-white"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <Link to="/profile">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-[#473325] bg-[#221812] hover:bg-[#2d2018] font-medium text-[#f6eee7]"
              >
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
                  }
                  alt={user.name}
                  className="h-5 w-5 rounded-full object-cover border border-[#e07328]"
                />
                <span className="max-w-[100px] truncate text-xs">{user.name}</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auth/login">
              <Button size="sm" className="gap-2 font-medium bg-[#e07328] hover:bg-[#ea8238] text-white">
                <LogIn className="h-4 w-4" />
                <span>Entrar</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav Drawer */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Carrinho"
            >
              <ShoppingBag className="h-5 w-5 text-[#e07328]" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e07328] px-1 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <MobileNav cartItemCount={cartItemCount} />
        </div>
      </div>
    </header>
  );
}
