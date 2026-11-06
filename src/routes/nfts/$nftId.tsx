import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useNftDetails } from '@/features/catalog/api/useNftDetails';
import { useAddToCart } from '@/features/cart/api/useAddToCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatEth, formatAddress } from '@/lib/utils';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  SearchX,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/nfts/$nftId')({
  component: NftDetailPage,
});

function NftDetailPage() {
  const { nftId } = Route.useParams();
  const navigate = useNavigate();
  const { data: nft, isLoading, isError } = useNftDetails(nftId);
  const addToCartMutation = useAddToCart();

  const [isFavorited, setIsFavorited] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const isSoldOut = nft?.status === 'SOLD_OUT' || (nft?.availableEditions ?? 0) === 0;

  const handleCopyContract = () => {
    if (nft?.contractAddress) {
      navigator.clipboard.writeText(nft.contractAddress);
      setCopied(true);
      toast.success('Endereço do contrato copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (!nft || isSoldOut) return;
    addToCartMutation.mutate({
      nftId: nft.id,
      quantity: 1,
      title: nft.title,
    });
  };

  const handleBuyNow = () => {
    if (!nft || isSoldOut) return;
    addToCartMutation.mutate(
      {
        nftId: nft.id,
        quantity: 1,
        title: nft.title,
      },
      {
        onSuccess: () => {
          navigate({ to: '/cart' });
        },
      }
    );
  };

  // Estado de Carregamento com Skeletons
  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 max-w-6xl space-y-8">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-md" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Estado 404 / NFT Não Encontrado
  if (isError || !nft) {
    return (
      <div className="container py-16 max-w-lg text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive">
          <SearchX className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">NFT Não Encontrado</h1>
          <p className="text-sm text-muted-foreground">
            O token especificado não existe ou foi removido do catálogo descentralizado.
          </p>
        </div>
        <Link to="/">
          <Button className="gap-2 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-6xl space-y-10">
      {/* Botão Voltar */}
      <div>
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Catálogo
          </Button>
        </Link>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image with Glass Frame */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-950">
            <img
              src={nft.image}
              alt={nft.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Badges de Categoria e Status */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge variant="neon" className="px-3 py-1 font-semibold text-xs">
                {nft.category}
              </Badge>
              {isSoldOut && (
                <Badge variant="destructive" className="px-3 py-1 font-bold text-xs">
                  ESGOTADO
                </Badge>
              )}
            </div>

            {/* Botão de Favoritar */}
            <button
              type="button"
              onClick={() => {
                setIsFavorited((prev) => !prev);
                toast(
                  isFavorited
                    ? 'Removido dos favoritos'
                    : 'Adicionado aos seus favoritos!'
                );
              }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 border border-white/15 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="Favoritar este NFT"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-white/80 hover:text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Metadata, Pricing & Buy Box */}
        <div className="space-y-6">
          {/* Header Title & Creator */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.name}
                className="h-7 w-7 rounded-full border border-purple-500/50 object-cover"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Criador:</span>
                <span className="text-sm font-semibold text-purple-300">
                  {nft.creator.name}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {nft.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {nft.description}
            </p>
          </div>

          {/* Editions & Network Pill Box */}
          <div className="flex flex-wrap items-center gap-3 py-2 border-y border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>
                Edições Disponíveis:{' '}
                <strong className="text-white font-mono">
                  {nft.availableEditions} de {nft.totalEditions}
                </strong>
              </span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Rede: <strong className="text-white">{nft.network}</strong></span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4 backdrop-blur-xl shadow-xl">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preço Atual
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {formatEth(nft.price)}
                </span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  ETH
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                variant="outline"
                disabled={isSoldOut || addToCartMutation.isPending}
                onClick={handleAddToCart}
                className="gap-2 border-white/15 bg-slate-800/80 hover:bg-slate-700 py-6 text-sm font-semibold"
              >
                <ShoppingBag className="h-4 w-4 text-cyan-400" />
                Adicionar ao Carrinho
              </Button>

              <Button
                size="lg"
                disabled={isSoldOut || addToCartMutation.isPending}
                onClick={handleBuyNow}
                className="gap-2 py-6 text-sm font-bold shadow-xl shadow-purple-600/30"
              >
                <Sparkles className="h-4 w-4" />
                {isSoldOut ? 'Esgotado' : 'Comprar Agora'}
              </Button>
            </div>
          </div>

          {/* Detailed Tabs: Atributos, Detalhes Técnicos, Histórico */}
          <Tabs defaultValue="attributes" className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="attributes">Propriedades</TabsTrigger>
              <TabsTrigger value="details">Smart Contract</TabsTrigger>
              <TabsTrigger value="creator">Criador & Rede</TabsTrigger>
            </TabsList>

            {/* Tab: Propriedades / Atributos */}
            <TabsContent value="attributes">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 text-center backdrop-blur-sm"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      {attr.trait_type}
                    </span>
                    <span className="mt-1 text-xs font-semibold text-white">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Detalhes do Smart Contract */}
            <TabsContent value="details">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Endereço do Contrato</span>
                  <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                    <span>{formatAddress(nft.contractAddress, 6)}</span>
                    <button
                      type="button"
                      onClick={handleCopyContract}
                      className="p-1 hover:text-white transition-colors"
                      aria-label="Copiar contrato"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono text-white">#{nft.tokenId}</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-muted-foreground">Padrão de Token</span>
                  <span className="font-semibold text-white">ERC-721</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-muted-foreground">Blockchain</span>
                  <span className="font-semibold text-white">{nft.network}</span>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Criador & Rede */}
            <TabsContent value="creator">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={nft.creator.avatar}
                    alt={nft.creator.name}
                    className="h-10 w-10 rounded-full border border-purple-500 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {nft.creator.name}
                    </h4>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {formatAddress(nft.creator.address, 8)}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  Artista verificado na rede Nexus. Todas as obras contam com royalties de 5% configurados via EIP-2981 diretamente no contrato inteligente.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
