import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useOrderReceipt } from '@/features/checkout/api/useOrderReceipt';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEth } from '@/lib/utils';
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
        <Skeleton className="h-24 w-full rounded-3xl bg-[#241a13]" />
        <Skeleton className="h-64 w-full rounded-3xl bg-[#241a13]" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-16 max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#f6eee7]">Recibo Não Encontrado</h2>
        <p className="text-xs text-[#a49386]">
          Não foi possível localizar o recibo do pedido especificado.
        </p>
        <Link to="/">
          <Button size="sm" className="gap-2 bg-[#e07328] hover:bg-[#ea8238] text-white">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const items = order.snapshot?.items || [];

  return (
    <div className="container py-8 md:py-14 max-w-2xl space-y-8">
      {/* Banner de Sucesso (Figma Style) */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e07328]/30 bg-[#1d1510] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e07328]/15 text-[#e07328] border border-[#e07328]/30 shadow-xl shadow-black/40">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-[#f6eee7]">
          Pedido Confirmado com Sucesso!
        </h1>

        <p className="mt-1.5 text-xs text-[#a49386] max-w-md mx-auto">
          Sua transação foi registrada na blockchain e os colecionáveis foram transferidos para a sua carteira com liquidação atômica.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status: {order.status}</span>
        </div>
      </div>

      {/* Recibo Congelado / Imutável */}
      <div className="rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#36261b] pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8a796e]">
              Identificador do Pedido
            </span>
            <p className="font-mono text-sm font-bold text-[#f6eee7]">{order.orderId}</p>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8a796e]">
              Data da Liquidação
            </span>
            <p className="text-xs text-[#a49386]">
              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Hash da Transação (TxHash) */}
        <div className="rounded-2xl border border-[#36261b] bg-[#140e0b] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#f6eee7] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#e07328]" />
              Hash da Transação (TxHash)
            </span>
            <button
              type="button"
              onClick={handleCopyTx}
              className="flex items-center gap-1 text-[11px] text-[#f5a267] hover:text-[#f6eee7]"
            >
              {copiedTx ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar Hash</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#a49386] bg-[#1d1510] p-2.5 rounded-xl border border-[#36261b] break-all">
            <span>{order.txHash}</span>
          </div>
        </div>

        {/* Lista de Itens Adquiridos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#a49386]">
            Colecionáveis Transferidos
          </h4>
          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.nftId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#36261b] bg-[#140e0b] p-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded-xl object-cover border border-[#36261b] bg-[#261c15] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[#f6eee7] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#8a796e]">
                      Qtd: {item.quantity} • Criador: {item.creatorName}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <p className="font-bold text-[#f6eee7]">
                    {formatEth(item.unitPrice)} ETH
                  </p>
                  <p className="text-[10px] text-[#8a796e]">cada</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="border-t border-[#36261b] pt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#a49386]">
            <span>Subtotal</span>
            <span className="font-mono text-[#f6eee7] font-semibold">
              {formatEth(order.snapshot?.quote?.subtotal || '0.0000')} ETH
            </span>
          </div>

          <div className="flex items-center justify-between text-[#a49386]">
            <span>Taxa de Rede (Gas)</span>
            <span className="font-mono text-[#f6eee7]">
              {formatEth(order.snapshot?.quote?.networkFee || '0.0120')} ETH
            </span>
          </div>

          <div className="border-t border-[#36261b] pt-2 flex items-baseline justify-between">
            <span className="font-bold text-sm text-[#f6eee7]">Total Liquidado</span>
            <span className="font-mono text-xl font-black text-[#e07328]">
              {formatEth(order.total || order.snapshot?.quote?.total || '0.0000')} ETH
            </span>
          </div>
        </div>

        {/* Ações pós-recibo */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/profile">
            <Button
              size="lg"
              className="w-full gap-2 font-bold py-6 text-xs sm:text-sm bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40"
            >
              <User className="h-4 w-4" />
              <span>Ver no Meu Perfil (Meus NFTs)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link to="/">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 py-6 text-xs sm:text-sm border-[#3e2c20] bg-[#241a13] hover:bg-[#322319] text-[#f6eee7]"
            >
              <ShoppingBag className="h-4 w-4 text-[#e07328]" />
              <span>Voltar ao Catálogo</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
