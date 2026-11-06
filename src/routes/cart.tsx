import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart } from '@/features/cart/api/useCart';
import { useQuote } from '@/features/cart/api/useQuote';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CouponInput } from '@/features/cart/components/CouponInput';
import { OrderSummaryCard } from '@/features/cart/components/OrderSummaryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const { data: cart, isLoading } = useCart();
  const [couponCode, setCouponCode] = React.useState<string>('');

  const items = cart?.items || [];
  const { data: quote } = useQuote(items, couponCode);

  const hasPriceConflict = items.some((item) => item.hasPriceChanged);

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-cyan-400" />
            Carrinho de Compras
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Revise seus colecionáveis antes de assinar a transação na blockchain.
          </p>
        </div>

        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Continuar Explorando
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-16 text-center space-y-5 backdrop-blur-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-white">Seu carrinho está vazio</h3>
            <p className="text-xs text-muted-foreground">
              Explore o catálogo de NFTs para encontrar colecionáveis únicos de artistas conceituados.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/">
              <Button size="lg" className="gap-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                Explorar Catálogo de NFTs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Main Two-Column Cart View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Coluna Esquerda: Itens do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-1">
              <span>{items.length} {items.length === 1 ? 'item no carrinho' : 'itens no carrinho'}</span>
              <span>Edições e Quantidades</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.nftId} item={item} />
              ))}
            </div>

            <div className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Transações protegidas por contratos inteligentes verificados</span>
            </div>
          </div>

          {/* Coluna Direita: Cupom e Resumo */}
          <div className="space-y-6">
            <CouponInput
              couponCode={couponCode}
              appliedCoupon={quote?.couponCode}
              onApplyCoupon={(code) => setCouponCode(code)}
              onRemoveCoupon={() => setCouponCode('')}
            />

            <OrderSummaryCard
              items={items}
              quote={quote}
              couponCode={couponCode}
              hasPriceConflict={hasPriceConflict}
            />
          </div>
        </div>
      )}
    </div>
  );
}
