import { Link } from '@tanstack/react-router';
import { CartItem } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { formatEth } from '@/lib/utils';
import { useUpdateCartItem } from '../api/useUpdateCartItem';
import { useRemoveFromCart } from '../api/useRemoveFromCart';
import { useAcceptPriceChange } from '../api/useAcceptPriceChange';
import { Trash2, Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantityMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveFromCart();
  const acceptPriceMutation = useAcceptPriceChange();

  const handleIncrement = () => {
    if (item.quantity < item.availableEditions) {
      updateQuantityMutation.mutate({
        nftId: item.nftId,
        quantity: item.quantity + 1,
      });
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantityMutation.mutate({
        nftId: item.nftId,
        quantity: item.quantity - 1,
      });
    } else {
      removeItemMutation.mutate(item.nftId);
    }
  };

  const handleRemove = () => {
    removeItemMutation.mutate(item.nftId);
  };

  const handleAcceptPrice = () => {
    if (item.newPrice) {
      acceptPriceMutation.mutate({
        nftId: item.nftId,
        newPrice: item.newPrice,
      });
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition-all hover:border-white/20 space-y-3">
      {/* Aviso Concorrente de Alteração de Preço em Tempo Real */}
      {item.hasPriceChanged && item.newPrice && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              O preço desta obra foi alterado pelo criador de{' '}
              <strong className="font-mono text-white">{formatEth(item.unitPrice)} ETH</strong> para{' '}
              <strong className="font-mono text-amber-300">{formatEth(item.newPrice)} ETH</strong>.
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleAcceptPrice}
            disabled={acceptPriceMutation.isPending}
            className="gap-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs h-7 self-end sm:self-auto"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aceitar Novo Preço
          </Button>
        </div>
      )}

      {/* Linha Principal do Item */}
      <div className="flex items-center justify-between gap-4">
        {/* Imagem e Detalhes */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link to="/nfts/$nftId" params={{ nftId: item.nftId }}>
            <img
              src={item.image}
              alt={item.title}
              className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0 hover:scale-105 transition-transform"
            />
          </Link>
          <div className="min-w-0">
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="font-bold text-sm sm:text-base text-white hover:text-purple-300 truncate block"
            >
              {item.title}
            </Link>
            <p className="text-xs text-muted-foreground truncate">
              Criador: <span className="text-purple-300">{item.creatorName}</span>
            </p>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-sm font-black text-cyan-300">
                {formatEth(item.unitPrice)}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">ETH cada</span>
            </div>
          </div>
        </div>

        {/* Controles de Quantidade e Preço Total */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Contador de Quantidade */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/70 p-1">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={updateQuantityMutation.isPending || removeItemMutation.isPending}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={
                item.quantity >= item.availableEditions ||
                updateQuantityMutation.isPending
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Remover Item */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeItemMutation.isPending}
            className="text-muted-foreground hover:text-destructive p-2 transition-colors"
            aria-label="Remover item do carrinho"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
