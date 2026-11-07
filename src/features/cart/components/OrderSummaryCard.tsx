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
    <div className="rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-6 shadow-2xl space-y-6">
      <h3 className="text-lg font-bold text-[#f6eee7] flex items-center gap-2 border-b border-[#36261b] pb-4">
        <Sparkles className="h-5 w-5 text-[#e07328]" />
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
        <div className="flex items-center justify-between text-[#a49386]">
          <span>Subtotal dos Itens</span>
          <span className="font-mono text-[#f6eee7] font-semibold">
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

        <div className="flex items-center justify-between text-[#a49386]">
          <div className="flex items-center gap-1.5">
            <span>Taxa de Rede (Gas)</span>
          </div>
          <span className="font-mono text-[#f6eee7]">{formatEth(networkFee)} ETH</span>
        </div>

        <div className="border-t border-[#36261b] pt-3 flex items-baseline justify-between">
          <span className="font-bold text-[#f6eee7]">Total Estimado</span>
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-2xl font-black text-[#f6eee7] font-mono">
              {formatEth(finalTotal)}
            </span>
            <span className="text-xs font-bold text-[#e07328] font-mono">ETH</span>
          </div>
        </div>
      </div>

      {/* Botão de Avançar */}
      <Button
        size="lg"
        disabled={items.length === 0 || hasPriceConflict}
        onClick={handleProceedToCheckout}
        className="w-full gap-2 py-6 text-sm font-bold bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40"
      >
        <span>
          {!isAuthenticated
            ? 'Entrar para Finalizar Compra'
            : 'Avançar para o Checkout'}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Trust pill */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#8a796e] border-t border-[#36261b] pt-4">
        <ShieldCheck className="h-4 w-4 text-[#e07328]" />
        <span>Garantia de idempotência & custódia soberana</span>
      </div>
    </div>
  );
}
