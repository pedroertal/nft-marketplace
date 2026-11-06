import { Link } from '@tanstack/react-router';
import { useSocket } from '@/app/providers/SocketProvider';
import { Hexagon, Activity, ShieldCheck, Lock, Heart } from 'lucide-react';

export function Footer() {
  const { isConnected } = useSocket();
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950/40">
                  <Hexagon className="h-4 w-4 text-cyan-300 stroke-[2.2] fill-cyan-400/10" />
                </div>
              </div>
              <span className="font-sans text-lg font-black tracking-wider gradient-text">
                NFT NEXUS
              </span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              O marketplace descentralizado de alta performance para colecionadores e criadores de arte digital. Transações seguras com liquidação instantânea em Ethereum e Polygon.
            </p>
            {/* Network status pill with live Socket.IO connection status */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${
                isConnected
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span>
                {isConnected
                  ? 'Rede Sepolia Testnet • Sync em Tempo Real Ativo'
                  : 'WebSocket Reconectando...'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Explorar NFTs
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-white">
                  Carrinho de Compras
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="transition-colors hover:text-white">
                  Minhas Carteiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Protocolo
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>Auditoria Imutável</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>Sync em Tempo Real</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-pink-400" />
                <span>Idempotência Estrita</span>
              </li>
            </ul>
          </div>

          {/* Tech stack badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Arquitetura
            </h4>
            <p className="text-xs text-muted-foreground leading-normal">
              Construído com TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui e MSW.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 NFT Nexus Marketplace. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com</span>
            <Heart className="h-3 w-3 text-pink-500 fill-pink-500" />
            <span>para colecionadores Web3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
