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
      icon: <Heart className={`h-4 w-4 ${!isFavorited ? 'fill-pink-500 text-pink-500' : ''}`} />,
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
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 glow-card">
      {/* Media Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950">
        <Link to="/nfts/$nftId" params={{ nftId: nft.id }}>
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
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 hover:bg-slate-950 active:scale-95"
          aria-label={isFavorited ? 'Remover dos favoritos' : 'Favoritar NFT'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorited
                ? 'fill-pink-500 text-pink-500'
                : 'text-white/80 hover:text-white'
            }`}
          />
        </button>

        {/* Status Badge */}
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
            className="absolute left-2.5 top-2.5 text-[10px] font-bold"
          >
            {nft.category}
          </Badge>
        )}

        {/* Editions Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-md border border-white/10">
          <Layers className="h-3 w-3 text-cyan-400" />
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
              className="h-5 w-5 rounded-full border border-purple-500/40 object-cover"
            />
            <span className="text-xs text-muted-foreground truncate hover:text-purple-300">
              {nft.creator.name}
            </span>
          </div>

          {/* Title */}
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            className="mt-1.5 block font-bold text-white text-base leading-snug line-clamp-1 hover:text-purple-300 transition-colors"
          >
            {nft.title}
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Preço
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-white font-mono tracking-tight">
                {formatEth(nft.price)}
              </span>
              <span className="text-xs font-semibold text-cyan-400 font-mono">
                ETH
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant={isSoldOut ? 'outline' : 'default'}
            disabled={isSoldOut || addToCartMutation.isPending}
            onClick={handleAddToCart}
            className="gap-1.5 text-xs font-semibold"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isSoldOut ? 'Esgotado' : 'Comprar'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
