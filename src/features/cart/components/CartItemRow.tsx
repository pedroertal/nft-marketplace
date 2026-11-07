import { Link } from '@tanstack/react-router';
import { CartItem } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { formatEth } from '@/lib/utils';
import { Decimal } from '@/lib/decimal';
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

  const lineTotal = Decimal.mul(item.unitPrice, item.quantity);

  return (
    <div className="flex flex-col rounded-2xl border border-[#36261b] bg-[#1d1510] p-4 transition-all hover:border-[#4d3627] space-y-3">
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
              className="h-16 w-16 rounded-xl object-cover border border-[#36261b] shrink-0 hover:scale-105 transition-transform bg-[#261c15]"
            />
          </Link>
          <div className="min-w-0">
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="font-bold text-sm sm:text-base text-[#f6eee7] hover:text-[#e07328] truncate block transition-colors"
            >
              {item.title}
            </Link>
            <p className="text-xs text-[#a49386] truncate">
              Criador: <span className="text-[#f6eee7]">{item.creatorName}</span>
            </p>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-sm font-black text-[#f6eee7]">
                {formatEth(item.unitPrice)}
              </span>
              <span className="text-[10px] font-semibold text-[#e07328]">
                ETH cada
              </span>
            </div>
          </div>
        </div>

        {/* Quantidade e Subtotal */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Seletor de Quantidade (+/-) */}
          <div className="flex items-center rounded-xl border border-[#36261b] bg-[#140e0b] p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#a49386] hover:text-[#f6eee7] hover:bg-[#281d16]"
              onClick={handleDecrement}
              disabled={updateQuantityMutation.isPending}
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-8 text-center font-mono text-xs font-bold text-[#f6eee7]">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#a49386] hover:text-[#f6eee7] hover:bg-[#281d16]"
              onClick={handleIncrement}
              disabled={
                item.quantity >= item.availableEditions ||
                updateQuantityMutation.isPending
              }
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Subtotal da Linha */}
          <div className="hidden sm:flex flex-col text-right font-mono min-w-[70px]">
            <span className="text-[10px] uppercase font-semibold text-[#8a796e]">
              Subtotal
            </span>
            <span className="text-sm font-black text-[#f6eee7]">
              {formatEth(lineTotal)} ETH
            </span>
          </div>

          {/* Botão de Remover */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={removeItemMutation.isPending}
            className="h-8 w-8 text-[#8a796e] hover:text-red-400 hover:bg-red-500/10"
            aria-label={`Remover ${item.title} do carrinho`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
