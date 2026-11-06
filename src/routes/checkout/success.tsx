import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useOrderReceipt } from '@/features/checkout/api/useOrderReceipt';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress, formatEth } from '@/lib/utils';
import {
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  User,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';

export interface CheckoutSuccessSearchParams {
  orderId?: string;
}

export const Route = createFileRoute('/checkout/success')({
  validateSearch: (search: Record<string, unknown>): CheckoutSuccessSearchParams => {
    return {
      orderId: typeof search.orderId === 'string' ? search.orderId : undefined,
    };
  },
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { orderId } = Route.useSearch();
  const { data: order, isLoading, isError } = useOrderReceipt(orderId || '');
  const [copiedTx, setCopiedTx] = React.useState(false);

  const handleCopyTx = () => {
    if (order?.txHash) {
      navigator.clipboard.writeText(order.txHash);
      setCopiedTx(true);
      toast.success('Hash da transação copiado!');
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 max-w-2xl space-y-6">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-16 max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Recibo Não Encontrado</h2>
        <p className="text-xs text-muted-foreground">
          Não foi possível localizar o recibo do pedido especificado.
        </p>
        <Link to="/">
          <Button size="sm" className="gap-2">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const items = order.snapshot?.items || [];

  return (
    <div className="container py-8 md:py-14 max-w-2xl space-y-8">
      {/* Banner de Sucesso */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900/60 to-slate-950/80 p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
          Pedido Confirmado com Sucesso!
        </h1>

        <p className="mt-1.5 text-xs text-muted-foreground max-w-md mx-auto">
          Sua transação foi registrada na blockchain e os colecionáveis foram transferidos para a sua carteira com liquidação atômica.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status: {order.status}</span>
        </div>
      </div>

      {/* Recibo Congelado / Imutável */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Identificador do Pedido
            </span>
            <p className="font-mono text-sm font-bold text-white">
              {order.orderId}
            </p>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Data de Liquidação
            </span>
            <p className="text-xs text-slate-300 font-mono">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Hash da Transação na Blockchain */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Hash da Transação (TxHash)
            </span>
            <button
              type="button"
              onClick={handleCopyTx}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {copiedTx ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-xs text-white break-all">
            {order.txHash || '0x3a4b9c1d2e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f'}
          </p>
          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
            <span>Rede: <strong className="text-white">{order.network}</strong></span>
            <span>Destino: <strong className="font-mono text-purple-200">{formatAddress(order.walletAddress, 6)}</strong></span>
          </div>
        </div>

        {/* Lista de NFTs Adquiridos */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Colecionáveis no Recibo ({items.length})
          </h3>

          <div className="divide-y divide-white/5 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
            {items.map((item) => (
              <div
                key={item.nftId}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      Qtd: {item.quantity} × {formatEth(item.unitPrice)} ETH
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-cyan-300 shrink-0">
                  {formatEth(item.unitPrice)} ETH
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Final */}
        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-bold text-white">Total Liquidado</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-black text-cyan-300">
              {formatEth(order.total)}
            </span>
            <span className="text-xs font-bold text-cyan-400">ETH</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link to="/profile">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-white/10 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold py-5"
            >
              <User className="h-4 w-4 text-purple-400" />
              Ver no Meu Perfil (Meus NFTs)
            </Button>
          </Link>

          <Link to="/">
            <Button
              size="lg"
              className="w-full gap-2 text-xs font-bold py-5 shadow-xl shadow-purple-600/25"
            >
              <ShoppingBag className="h-4 w-4" />
              Continuar Comprando
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
