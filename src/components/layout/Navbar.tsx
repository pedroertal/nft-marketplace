import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/app/providers/AuthProvider';
import { Hexagon, ShoppingBag, Wallet, Compass, Search } from 'lucide-react';

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/25">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/40">
                <Hexagon className="h-4 w-4 text-cyan-300 stroke-[2.2] fill-cyan-400/10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg font-black tracking-wider gradient-text">
                NFT NEXUS
              </span>
              <span className="text-[10px] -mt-1 font-mono tracking-widest text-cyan-400">
                MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white [&.active]:bg-purple-500/10 [&.active]:text-purple-300 [&.active]:font-semibold"
            >
              <Compass className="h-4 w-4 text-purple-400" />
              Explorar
            </Link>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden flex-1 max-w-md mx-4 lg:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar coleções, criadores ou NFTs..."
              className="w-full h-9 rounded-full bg-slate-900/80 border border-white/10 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer"
              readOnly
              onClick={() => {
                window.location.href = '/';
              }}
            />
          </div>
        </div>

        {/* Desktop Right Actions: Cart & Profile / Connect */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart">
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2 border-white/10 bg-slate-900/80 hover:bg-slate-800"
              aria-label="Ver carrinho"
            >
              <ShoppingBag className="h-4 w-4 text-cyan-400" />
              <span className="font-medium text-xs">Carrinho</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="neon"
                  className="h-5 px-1.5 text-[11px] font-bold"
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
                className="gap-2 border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 font-medium"
              >
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
                  }
                  alt={user.name}
                  className="h-5 w-5 rounded-full object-cover border border-purple-400"
                />
                <span className="max-w-[100px] truncate text-xs">{user.name}</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auth/login">
              <Button size="sm" className="gap-2 font-medium">
                <Wallet className="h-4 w-4" />
                <span>Conectar</span>
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
              <ShoppingBag className="h-5 w-5 text-cyan-400" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-slate-950">
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
