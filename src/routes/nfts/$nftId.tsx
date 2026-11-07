import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useNftDetails } from '@/features/catalog/api/useNftDetails';
import { useNfts } from '@/features/catalog/api/useNfts';
import { useAddToCart } from '@/features/cart/api/useAddToCart';
import { NftCard } from '@/features/catalog/components/NftCard';
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
  ChevronRight,
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
  const { data: relatedData } = useNfts({ limit: 4 });
  const addToCartMutation = useAddToCart();

  const [isFavorited, setIsFavorited] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const activeImage = selectedImage || nft?.image || '/images/apes/imperial-ape-042.jpg';
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

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 max-w-6xl space-y-8">
        <Skeleton className="h-6 w-48 rounded-lg bg-[#241a13]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full rounded-2xl bg-[#241a13]" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-lg bg-[#241a13]" />
            <Skeleton className="h-6 w-1/2 rounded-md bg-[#241a13]" />
            <Skeleton className="h-28 w-full rounded-xl bg-[#241a13]" />
            <Skeleton className="h-14 w-full rounded-xl bg-[#241a13]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !nft) {
    return (
      <div className="container py-16 max-w-lg text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive">
          <SearchX className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#f6eee7]">NFT Não Encontrado</h1>
          <p className="text-sm text-[#a49386]">
            O token especificado não existe ou foi removido do catálogo descentralizado.
          </p>
        </div>
        <Link to="/">
          <Button className="gap-2 font-semibold bg-[#e07328] hover:bg-[#ea8238] text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  // Thumbnails alternativas para galeria vertical
  const galleryThumbnails = [
    nft.image,
    '/images/apes/imperial-ape-001.jpg',
    '/images/apes/imperial-ape-003.jpg',
  ];

  return (
    <div className="container py-8 md:py-12 max-w-6xl space-y-12">
      {/* Breadcrumb Navigation (Figma) */}
      <nav className="flex items-center gap-2 text-xs text-[#a49386]">
        <Link to="/" className="hover:text-[#f6eee7] transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/" search={{}} className="hover:text-[#f6eee7] transition-colors">
          Mercado
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#f6eee7] font-semibold truncate max-w-[200px]">
          {nft.title}
        </span>
      </nav>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Vertical Thumbnails + Main Artwork Display */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            {galleryThumbnails.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(thumb)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImage === thumb
                    ? 'border-[#e07328] shadow-md shadow-orange-950/40'
                    : 'border-[#36261b] hover:border-[#e07328]/40'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Artwork */}
          <div className="relative flex-1 aspect-square overflow-hidden rounded-3xl border border-[#3e2c20] bg-[#221812] p-3 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#2a1e16]">
              <img
                src={activeImage}
                alt={nft.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Status Badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <Badge
                  variant="neon"
                  className="px-3 py-1 font-semibold text-xs bg-[#140e0b]/80 border-[#473325] text-[#f5a267] backdrop-blur-sm"
                >
                  {nft.category}
                </Badge>
                {isSoldOut && (
                  <Badge variant="destructive" className="px-3 py-1 font-bold text-xs">
                    ESGOTADO
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
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
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#140e0b]/80 border border-[#36261b] text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                aria-label="Favoritar este NFT"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorited
                      ? 'fill-[#e07328] text-[#e07328]'
                      : 'text-white/80 hover:text-white'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Pricing & Buy Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.name}
                className="h-8 w-8 rounded-full border border-[#e07328] object-cover"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#a49386]">Criador:</span>
                <span className="text-sm font-semibold text-[#f6eee7]">
                  {nft.creator.name}
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e07328]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#f6eee7] leading-tight">
              {nft.title}
            </h1>

            <p className="text-sm text-[#a49386] leading-relaxed font-normal">
              {nft.description}
            </p>
          </div>

          {/* Editions & Network Pill Box */}
          <div className="flex flex-wrap items-center gap-3 py-3 border-y border-[#36261b] text-xs">
            <div className="flex items-center gap-1.5 text-[#a49386]">
              <Layers className="h-4 w-4 text-[#e07328]" />
              <span>
                Edições Disponíveis:{' '}
                <strong className="text-[#f6eee7] font-mono">
                  {nft.availableEditions} de {nft.totalEditions}
                </strong>
              </span>
            </div>
            <span className="text-[#36261b]">•</span>
            <div className="flex items-center gap-1.5 text-[#a49386]">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Rede: <strong className="text-[#f6eee7]">{nft.network}</strong></span>
            </div>
          </div>

          {/* Pricing Box (Figma Style) */}
          <div className="rounded-2xl border border-[#3e2c20] bg-[#1d1510] p-6 space-y-4 shadow-xl">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a796e]">
                Preço Atual
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#f6eee7] font-mono tracking-tight">
                  {formatEth(nft.price)}
                </span>
                <span className="text-base font-bold text-[#e07328] font-mono">
                  ETH
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                disabled={isSoldOut || addToCartMutation.isPending}
                onClick={handleBuyNow}
                className="gap-2 py-6 text-sm font-bold bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40"
              >
                <Sparkles className="h-4 w-4" />
                {isSoldOut ? 'Esgotado' : 'Comprar Agora'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                disabled={isSoldOut || addToCartMutation.isPending}
                onClick={handleAddToCart}
                className="gap-2 border-[#3e2c20] bg-[#241a13] hover:bg-[#322319] text-[#f6eee7] py-6 text-sm font-semibold"
              >
                <ShoppingBag className="h-4 w-4 text-[#e07328]" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>

          {/* Detailed Tabs: Atributos, Detalhes Técnicos, Criador */}
          <Tabs defaultValue="attributes" className="w-full pt-2">
            <TabsList className="grid w-full grid-cols-3 bg-[#1d1510] border border-[#36261b]">
              <TabsTrigger value="attributes" className="data-[state=active]:bg-[#e07328] data-[state=active]:text-white text-xs">
                Propriedades
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-[#e07328] data-[state=active]:text-white text-xs">
                Smart Contract
              </TabsTrigger>
              <TabsTrigger value="creator" className="data-[state=active]:bg-[#e07328] data-[state=active]:text-white text-xs">
                Criador
              </TabsTrigger>
            </TabsList>

            {/* Tab: Propriedades / Atributos */}
            <TabsContent value="attributes" className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-xl border border-[#3e2c20] bg-[#1d1510] p-3 text-center"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e07328]">
                      {attr.trait_type}
                    </span>
                    <span className="mt-1 text-xs font-semibold text-[#f6eee7]">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Detalhes do Smart Contract */}
            <TabsContent value="details" className="pt-3">
              <div className="rounded-xl border border-[#36261b] bg-[#1d1510] p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#a49386]">Endereço do Contrato</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#f5a267]">
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

                <div className="flex items-center justify-between border-t border-[#36261b] pt-2">
                  <span className="text-[#a49386]">Token ID</span>
                  <span className="font-mono text-[#f6eee7]">#{nft.tokenId}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#36261b] pt-2">
                  <span className="text-[#a49386]">Padrão de Token</span>
                  <span className="font-semibold text-[#f6eee7]">ERC-721</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#36261b] pt-2">
                  <span className="text-[#a49386]">Blockchain</span>
                  <span className="font-semibold text-[#f6eee7]">{nft.network}</span>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Criador */}
            <TabsContent value="creator" className="pt-3">
              <div className="rounded-xl border border-[#36261b] bg-[#1d1510] p-4 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={nft.creator.avatar}
                    alt={nft.creator.name}
                    className="h-10 w-10 rounded-full border border-[#e07328] object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-[#f6eee7] text-sm">
                      {nft.creator.name}
                    </h4>
                    <p className="font-mono text-[11px] text-[#a49386]">
                      {formatAddress(nft.creator.address, 8)}
                    </p>
                  </div>
                </div>
                <p className="text-[#a49386] text-xs leading-relaxed">
                  Artista verificado na plataforma Kurio. Obras auditadas com royalties de 5% configurados via smart contract EIP-2981.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related NFTs Section (Figma Bottom Bar) */}
      <section className="border-t border-[#36261b] pt-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f6eee7] uppercase tracking-tight">
            Mais desta Coleção
          </h2>
          <p className="text-xs text-[#a49386] mt-0.5">
            Outros colecionáveis raros do mesmo universo artístico.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {(relatedData?.items || []).slice(0, 4).map((related) => (
            <NftCard key={related.id} nft={related} />
          ))}
        </div>
      </section>
    </div>
  );
}
