import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCart } from '@/features/cart/api/useCart';
import { useQuote } from '@/features/cart/api/useQuote';
import { useNfts } from '@/features/catalog/api/useNfts';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CouponInput } from '@/features/cart/components/CouponInput';
import { OrderSummaryCard } from '@/features/cart/components/OrderSummaryCard';
import { NftCard } from '@/features/catalog/components/NftCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { data: recommendedData } = useNfts({ limit: 4 });
  const [couponCode, setCouponCode] = React.useState<string>('');

  const items = cart?.items || [];
  const { data: quote } = useQuote(items, couponCode);

  const hasPriceConflict = items.some((item) => item.hasPriceChanged);

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 max-w-6xl space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg bg-[#241a13]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl bg-[#241a13]" />
            <Skeleton className="h-28 w-full rounded-2xl bg-[#241a13]" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl bg-[#241a13]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-6xl space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#36261b] pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#f6eee7] flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-[#e07328]" />
            Carrinho de Compras
          </h1>
          <p className="text-xs text-[#a49386] mt-1">
            Revise seus colecionáveis antes de assinar a transação na blockchain.
          </p>
        </div>

        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-[#a49386] hover:text-[#f6eee7] hover:bg-[#281d16]">
            <ArrowLeft className="h-4 w-4" />
            Continuar Explorando
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-[#3d2c20] bg-[#1d1510] p-16 text-center space-y-5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e07328]/10 border border-[#e07328]/20 text-[#e07328]">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-[#f6eee7]">Seu carrinho está vazio</h3>
            <p className="text-xs text-[#a49386]">
              Explore o catálogo de NFTs para encontrar colecionáveis únicos de artistas conceituados.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/">
              <Button size="lg" className="gap-2 font-bold bg-[#e07328] hover:bg-[#ea8238] text-white">
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
          {/* Coluna Esquerda: Itens do Carrinho & Cupom */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between text-xs text-[#a49386] font-semibold px-1">
              <span>{items.length} {items.length === 1 ? 'item no carrinho' : 'itens no carrinho'}</span>
              <span>Edições e Quantidades</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.nftId} item={item} />
              ))}
            </div>

            <div className="pt-2">
              <CouponInput
                couponCode={couponCode}
                appliedCoupon={couponCode}
                onApplyCoupon={setCouponCode}
                onRemoveCoupon={() => setCouponCode('')}
              />
            </div>
          </div>

          {/* Coluna Direita: Resumo do Pedido */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              items={items}
              quote={quote}
              couponCode={couponCode}
              hasPriceConflict={hasPriceConflict}
            />
          </div>
        </div>
      )}

      {/* Recommended Section (Figma Bottom) */}
      <section className="border-t border-[#36261b] pt-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f6eee7] uppercase tracking-tight">
            Recomendados para Você
          </h2>
          <p className="text-xs text-[#a49386] mt-0.5">
            Colecionáveis em alta que outros colecionadores estão adicionando.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {(recommendedData?.items || []).slice(0, 4).map((rec) => (
            <NftCard key={rec.id} nft={rec} />
          ))}
        </div>
      </section>
    </div>
  );
}
