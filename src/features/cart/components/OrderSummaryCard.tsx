import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Quote, CartItem } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { formatEth } from '@/lib/utils';
import { Decimal } from '@/lib/decimal';
import { useAuth } from '@/app/providers/AuthProvider';
import { ShieldCheck, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

interface OrderSummaryCardProps {
  items: CartItem[];
  quote?: Quote;
  couponCode?: string;
  hasPriceConflict?: boolean;
}

export function OrderSummaryCard({
  items,
  quote,
  couponCode,
  hasPriceConflict = false,
}: OrderSummaryCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Cálculos de precisão via Decimal
  const calculatedSubtotal = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const line = Decimal.mul(item.unitPrice, item.quantity);
      return Decimal.add(acc, line);
    }, '0');
  }, [items]);

  const discountAmount = React.useMemo(() => {
    if (quote?.discount) return quote.discount;
    if (couponCode === 'NEXUS10') return Decimal.mul(calculatedSubtotal, '0.10');
    if (couponCode === 'CRYPTO20') return Decimal.mul(calculatedSubtotal, '0.20');
    return '0.0000';
  }, [quote, couponCode, calculatedSubtotal]);

  const networkFee = quote?.networkFee || '0.0120';

  const finalTotal = React.useMemo(() => {
    if (quote?.total) return quote.total;
    const subtotalAfterDiscount = Decimal.sub(calculatedSubtotal, discountAmount);
    return Decimal.add(
      Decimal.isGreaterThan(subtotalAfterDiscount, '0')
        ? subtotalAfterDiscount
        : '0',
      networkFee
    );
  }, [quote, calculatedSubtotal, discountAmount, networkFee]);

  const handleProceedToCheckout = () => {
    if (hasPriceConflict) return;

    if (!isAuthenticated) {
      navigate({
        to: '/auth/login',
        search: { redirect: '/checkout' },
      });
    } else {
      navigate({ to: '/checkout' });
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
        <Sparkles className="h-5 w-5 text-purple-400" />
        Resumo do Pedido
      </h3>

      {/* Alerta de conflito de preço */}
      {hasPriceConflict && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Existem alterações de preço concorrentes no seu carrinho. Por favor, aceite os novos valores antes de avançar.
          </span>
        </div>
      )}

      {/* Linhas Financeiras com Precisão Decimal */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal dos Itens</span>
          <span className="font-mono text-white font-semibold">
            {formatEth(quote?.subtotal || calculatedSubtotal)} ETH
          </span>
        </div>

        {Decimal.isGreaterThan(discountAmount, '0') && (
          <div className="flex items-center justify-between text-emerald-400">
            <span>Desconto do Cupom</span>
            <span className="font-mono font-bold">
              - {formatEth(discountAmount)} ETH
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Estimativa de Gas (Rede)</span>
          <span className="font-mono text-white font-semibold">
            {formatEth(networkFee)} ETH
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <span className="text-base font-bold text-white">Total a Pagar</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-black text-cyan-300">
              {formatEth(finalTotal)}
            </span>
            <span className="text-xs font-bold text-cyan-400">ETH</span>
          </div>
        </div>
      </div>

      {/* Botão de Checkout */}
      <Button
        size="lg"
        disabled={items.length === 0 || hasPriceConflict}
        onClick={handleProceedToCheckout}
        className="w-full gap-2 py-6 font-bold text-sm shadow-xl shadow-purple-600/25 rounded-xl"
      >
        <span>
          {!isAuthenticated
            ? 'Entrar para Finalizar Compra'
            : 'Avançar para o Checkout'}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Selos de Garantia */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>Garantia de Idempotência e Zero Slippage</span>
      </div>
    </div>
  );
}
