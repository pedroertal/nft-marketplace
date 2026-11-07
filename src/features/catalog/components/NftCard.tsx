import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { NFT } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatEth } from '@/lib/utils';
import { useAddToCart } from '@/features/cart/api/useAddToCart';
import { Heart, ShoppingBag, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface NftCardProps {
  nft: NFT;
  isFavorite?: boolean;
}

export function NftCard({ nft, isFavorite: initialFavorite = false }: NftCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(initialFavorite);
  const addToCartMutation = useAddToCart();

  const isSoldOut = nft.status === 'SOLD_OUT' || nft.availableEditions === 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited((prev) => !prev);
    toast(isFavorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', {
      icon: <Heart className={`h-4 w-4 ${!isFavorited ? 'fill-[#e07328] text-[#e07328]' : ''}`} />,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCartMutation.mutate({
      nftId: nft.id,
      quantity: 1,
      title: nft.title,
    });
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#36261b] bg-[#1e1510] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#e07328]/40 hover:shadow-xl hover:shadow-black/60 glow-card">
      {/* Media Container with warm sand canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#261c15]">
        <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="block w-full h-full">
          <img
            src={nft.image}
            alt={nft.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#140e0b]/70 backdrop-blur-md border border-[#36261b] text-white transition-all hover:scale-110 hover:bg-[#140e0b] active:scale-95"
          aria-label={isFavorited ? 'Remover dos favoritos' : 'Favoritar NFT'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorited
                ? 'fill-[#e07328] text-[#e07328]'
                : 'text-white/80 hover:text-white'
            }`}
          />
        </button>

        {/* Category / Status Badge */}
        {isSoldOut ? (
          <Badge
            variant="destructive"
            className="absolute left-2.5 top-2.5 uppercase text-[10px] font-bold"
          >
            Esgotado
          </Badge>
        ) : (
          <Badge
            variant="neon"
            className="absolute left-2.5 top-2.5 text-[10px] font-bold bg-[#140e0b]/80 border-[#473325] text-[#f5a267] backdrop-blur-sm"
          >
            {nft.category}
          </Badge>
        )}

        {/* Editions Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-[#140e0b]/80 px-2.5 py-0.5 text-[10px] font-mono text-[#c4b5a8] backdrop-blur-md border border-[#36261b]">
          <Layers className="h-3 w-3 text-[#e07328]" />
          <span>
            {nft.availableEditions}/{nft.totalEditions} ed.
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Creator */}
          <div className="flex items-center gap-2">
            <img
              src={nft.creator.avatar}
              alt={nft.creator.name}
              className="h-5 w-5 rounded-full border border-[#4a3425] object-cover"
            />
            <span className="text-xs text-[#a49386] truncate hover:text-[#f6eee7] transition-colors">
              {nft.creator.name}
            </span>
          </div>

          {/* Title */}
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            className="mt-1.5 block font-bold text-[#f6eee7] text-base leading-snug line-clamp-1 hover:text-[#e07328] transition-colors"
          >
            {nft.title}
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between border-t border-[#36261b] pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-[#8a796e]">
              Preço
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-[#f6eee7] font-mono tracking-tight">
                {formatEth(nft.price)}
              </span>
              <span className="text-xs font-semibold text-[#e07328] font-mono">
                ETH
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant={isSoldOut ? 'outline' : 'default'}
            disabled={isSoldOut || addToCartMutation.isPending}
            onClick={handleAddToCart}
            className="gap-1.5 text-xs font-semibold bg-[#e07328] hover:bg-[#ea8238] text-white"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isSoldOut ? 'Esgotado' : 'Comprar'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
