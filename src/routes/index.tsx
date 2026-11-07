import * as React from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useNfts } from '@/features/catalog/api/useNfts';
import { CatalogHeader } from '@/features/catalog/components/CatalogHeader';
import { FilterSidebar } from '@/features/catalog/components/FilterSidebar';
import { CatalogGrid } from '@/features/catalog/components/CatalogGrid';
import { Pagination } from '@/features/catalog/components/Pagination';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NftCategory } from '@/types/entities';
import { NftSortOption } from '@/types/api';
import { formatEth } from '@/lib/utils';
import {
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  BookOpen,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

export interface CatalogSearchParams {
  search?: string;
  category?: string;
  sort?: NftSortOption;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    const validSorts: NftSortOption[] = [
      'price_asc',
      'price_desc',
      'newest',
      'editions_desc',
      'title_asc',
    ];

    return {
      search: typeof search.search === 'string' && search.search ? search.search : undefined,
      category: typeof search.category === 'string' && search.category ? search.category : undefined,
      sort: validSorts.includes(search.sort as NftSortOption)
        ? (search.sort as NftSortOption)
        : undefined,
      minPrice: typeof search.minPrice === 'string' && search.minPrice ? search.minPrice : undefined,
      maxPrice: typeof search.maxPrice === 'string' && search.maxPrice ? search.maxPrice : undefined,
      page: search.page && !isNaN(Number(search.page)) ? Number(search.page) : undefined,
    };
  },
  component: CatalogPage,
});

function CatalogPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [followingMap, setFollowingMap] = React.useState<Record<string, boolean>>({});

  const currentSearch = searchParams.search || '';
  const currentCategory = searchParams.category || 'All';
  const currentSort = searchParams.sort || 'newest';
  const currentMinPrice = searchParams.minPrice || '';
  const currentMaxPrice = searchParams.maxPrice || '';
  const currentPage = searchParams.page || 1;

  // Consulta ao MSW consumindo a URL como fonte da verdade
  const { data, isLoading, isError, refetch } = useNfts({
    search: currentSearch || undefined,
    category:
      currentCategory && currentCategory !== 'All'
        ? (currentCategory as NftCategory)
        : undefined,
    sort: currentSort,
    minPrice: currentMinPrice || undefined,
    maxPrice: currentMaxPrice || undefined,
    page: currentPage,
    limit: 8,
  });

  const updateSearch = React.useCallback(
    (updates: Partial<CatalogSearchParams>, resetPage: boolean = true) => {
      navigate({
        to: '/',
        search: (prev) => {
          const next: CatalogSearchParams = {
            ...prev,
            ...updates,
          };
          if (resetPage) {
            next.page = 1;
          }
          if (!next.search) delete next.search;
          if (next.category === 'All' || !next.category) delete next.category;
          if (next.sort === 'newest') delete next.sort;
          if (!next.minPrice) delete next.minPrice;
          if (!next.maxPrice) delete next.maxPrice;
          if (next.page === 1) delete next.page;

          return next;
        },
      });
    },
    [navigate]
  );

  const handleResetFilters = () => {
    navigate({
      to: '/',
      search: () => ({}),
    });
    setMobileDrawerOpen(false);
  };

  const handleToggleFollow = (creatorId: string, creatorName: string) => {
    setFollowingMap((prev) => {
      const isFollowing = !prev[creatorId];
      toast.success(
        isFollowing
          ? `Você agora está seguindo ${creatorName}!`
          : `Deixou de seguir ${creatorName}.`
      );
      return { ...prev, [creatorId]: isFollowing };
    });
  };

  const activeFilterCount =
    (currentCategory && currentCategory !== 'All' ? 1 : 0) +
    (currentMinPrice ? 1 : 0) +
    (currentMaxPrice ? 1 : 0);

  const featuredNft = data?.items?.[0];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO BANNER (Figma Design) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1c140f] to-[#120d0a] border-b border-[#36261b] py-12 md:py-20">
        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e07328]/30 bg-[#e07328]/10 px-3.5 py-1 text-xs font-semibold text-[#f5a267]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e07328] animate-pulse" />
              <span>COLEÇÃO EXCLUSIVA WEB3</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#f6eee7] leading-[1.08] uppercase">
              SEJA DONO DO FUTURO <br />
              <span className="text-[#e07328]">DA ARTE DIGITAL</span>
            </h1>

            <p className="text-base sm:text-lg text-[#a49386] max-w-xl font-normal leading-relaxed">
              Colecione e negocie os avatares e obras de arte mais desejados do ecossistema Web3. Transações seguras com liquidação instantânea, garantindo sua custódia soberana em blockchain.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#mercado">
                <Button size="lg" className="gap-2 bg-[#e07328] hover:bg-[#ea8238] text-white px-8 font-bold shadow-lg shadow-black/40">
                  <span>Explorar Mercado</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#aprenda">
                <Button variant="outline" size="lg" className="border-[#3d2c20] bg-[#1d1510] hover:bg-[#281d16] text-[#f6eee7] font-semibold">
                  <span>Como Funciona</span>
                </Button>
              </a>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#36261b] max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#f6eee7] font-mono">240k+</p>
                <p className="text-xs text-[#a49386] mt-0.5">Obras Negociadas</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#f6eee7] font-mono">12k+</p>
                <p className="text-xs text-[#a49386] mt-0.5">Criadores Ativos</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#e07328] font-mono">0%</p>
                <p className="text-xs text-[#a49386] mt-0.5">Taxa de Listagem</p>
              </div>
            </div>
          </div>

          {/* Right Hero: Featured Ape Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-4 shadow-2xl shadow-black/70 group glow-card">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#261c15]">
                <img
                  src={featuredNft?.image || '/images/apes/imperial-ape-042.jpg'}
                  alt={featuredNft?.title || 'Imperial Ape #042'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <Badge
                  variant="neon"
                  className="absolute left-3 top-3 bg-[#140e0b]/80 border-[#473325] text-[#f5a267] backdrop-blur-sm text-xs font-bold"
                >
                  NFT de Destaque
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#f6eee7]">
                      {featuredNft?.title || 'Imperial Ape #042'}
                    </h3>
                    <p className="text-xs text-[#a49386] mt-0.5">
                      Criado por <span className="text-[#f6eee7] font-semibold">{featuredNft?.creator.name || 'Ana Cyber'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#8a796e] block">
                      Preço Atual
                    </span>
                    <span className="text-lg font-black text-[#f6eee7] font-mono">
                      {formatEth(featuredNft?.price || '1.4500')} ETH
                    </span>
                  </div>
                </div>

                <Link to="/nfts/$nftId" params={{ nftId: featuredNft?.id || 'nft-1' }} className="block">
                  <Button className="w-full bg-[#e07328] hover:bg-[#ea8238] text-white font-bold py-5">
                    Comprar Obra em Destaque
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG SECTION */}
      <section id="mercado" className="container space-y-8 scroll-mt-20">
        <div className="border-b border-[#36261b] pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#f6eee7] uppercase tracking-tight">
            Mercado de Colecionáveis
          </h2>
          <p className="text-sm text-[#a49386] mt-1">
            Filtre por categorias, pesquise por criadores ou selecione sua faixa de preço ideal.
          </p>
        </div>

        {/* Header com Busca, Contador e Ordenação */}
        <CatalogHeader
          search={currentSearch}
          sort={currentSort}
          totalResults={data?.total ?? 0}
          onSearchChange={(search) => updateSearch({ search })}
          onSortChange={(sort) => updateSearch({ sort })}
          onOpenMobileFilters={() => setMobileDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Layout com Sidebar Desktop e Grid de NFTs */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={currentCategory}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              onCategoryChange={(category) => updateSearch({ category })}
              onPriceChange={(minPrice, maxPrice) =>
                updateSearch({ minPrice, maxPrice })
              }
              onReset={handleResetFilters}
            />
          </div>

          {/* Grid de NFTs e Paginação */}
          <div className="flex-1 w-full space-y-8">
            <CatalogGrid
              nfts={data?.items || []}
              isLoading={isLoading}
              isError={isError}
              onResetFilters={handleResetFilters}
              onRetry={() => refetch()}
            />

            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={(page) => updateSearch({ page }, false)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 3. ARTISTAS EM DESTAQUE (Figma Design) */}
      <section id="criadores" className="container space-y-6 pt-8 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-[#36261b] pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#f6eee7] uppercase tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-[#e07328]" />
              Artistas em Destaque
            </h2>
            <p className="text-xs text-[#a49386] mt-1">
              Os criadores mais influentes e com maior volume negociado na plataforma.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Criador 1 */}
          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                alt="Ana Cyber"
                className="h-12 w-12 rounded-full border border-[#e07328] object-cover"
              />
              <div>
                <h4 className="font-bold text-[#f6eee7] text-sm flex items-center gap-1.5">
                  Ana Cyber
                  <CheckCircle2 className="h-4 w-4 text-[#e07328]" />
                </h4>
                <p className="text-xs text-[#a49386]">Volume: 145.2 ETH</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={followingMap['ana'] ? 'outline' : 'default'}
              onClick={() => handleToggleFollow('ana', 'Ana Cyber')}
              className={followingMap['ana'] ? 'border-[#4a3425] text-xs' : 'bg-[#e07328] hover:bg-[#ea8238] text-white text-xs'}
            >
              {followingMap['ana'] ? 'Seguindo' : 'Seguir'}
            </Button>
          </div>

          {/* Criador 2 */}
          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Studio Pulse"
                className="h-12 w-12 rounded-full border border-[#e07328] object-cover"
              />
              <div>
                <h4 className="font-bold text-[#f6eee7] text-sm flex items-center gap-1.5">
                  Studio Pulse
                  <CheckCircle2 className="h-4 w-4 text-[#e07328]" />
                </h4>
                <p className="text-xs text-[#a49386]">Volume: 98.4 ETH</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={followingMap['pulse'] ? 'outline' : 'default'}
              onClick={() => handleToggleFollow('pulse', 'Studio Pulse')}
              className={followingMap['pulse'] ? 'border-[#4a3425] text-xs' : 'bg-[#e07328] hover:bg-[#ea8238] text-white text-xs'}
            >
              {followingMap['pulse'] ? 'Seguindo' : 'Seguir'}
            </Button>
          </div>

          {/* Criador 3 */}
          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Kenji Sato"
                className="h-12 w-12 rounded-full border border-[#e07328] object-cover"
              />
              <div>
                <h4 className="font-bold text-[#f6eee7] text-sm flex items-center gap-1.5">
                  Kenji Sato
                  <CheckCircle2 className="h-4 w-4 text-[#e07328]" />
                </h4>
                <p className="text-xs text-[#a49386]">Volume: 64.1 ETH</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={followingMap['kenji'] ? 'outline' : 'default'}
              onClick={() => handleToggleFollow('kenji', 'Kenji Sato')}
              className={followingMap['kenji'] ? 'border-[#4a3425] text-xs' : 'bg-[#e07328] hover:bg-[#ea8238] text-white text-xs'}
            >
              {followingMap['kenji'] ? 'Seguindo' : 'Seguir'}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. APRENDA SOBRE NFTS (Figma Design) */}
      <section id="aprenda" className="container space-y-6 pt-8 scroll-mt-20">
        <div className="border-b border-[#36261b] pb-4">
          <h2 className="text-2xl font-black text-[#f6eee7] uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#e07328]" />
            Aprenda sobre o Ecossistema
          </h2>
          <p className="text-xs text-[#a49386] mt-1">
            Guias rápidos para você colecionar com total segurança e soberania.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e07328]/15 text-[#e07328]">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#f6eee7] text-base">Como Conectar sua Carteira</h3>
            <p className="text-xs text-[#a49386] leading-relaxed">
              Utilize carteiras seguras como MetaMask ou Coinbase Wallet. Suas chaves nunca saem do seu dispositivo.
            </p>
          </div>

          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e07328]/15 text-[#e07328]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#f6eee7] text-base">Taxas de Gas Transparentes</h3>
            <p className="text-xs text-[#a49386] leading-relaxed">
              Todas as cotações calculam a taxa estimada de rede em tempo real com precisão decimal estrita, sem surpresas.
            </p>
          </div>

          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e07328]/15 text-[#e07328]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#f6eee7] text-base">Checkout Idempotente</h3>
            <p className="text-xs text-[#a49386] leading-relaxed">
              Cada transação gera uma chave única de idempotência, impedindo ordens duplicadas ou débitos indevidos na rede.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerContent className="px-6 pb-8 max-h-[85vh] overflow-y-auto bg-[#18110c] border-[#36261b]">
          <DrawerHeader className="border-b border-[#36261b] pb-4">
            <DrawerTitle className="text-lg font-bold text-[#f6eee7] flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[#e07328]" />
              Filtros do Catálogo
            </DrawerTitle>
          </DrawerHeader>
          <div className="pt-4">
            <FilterSidebar
              selectedCategory={currentCategory}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              onCategoryChange={(category) => {
                updateSearch({ category });
                setMobileDrawerOpen(false);
              }}
              onPriceChange={(minPrice, maxPrice) => {
                updateSearch({ minPrice, maxPrice });
                setMobileDrawerOpen(false);
              }}
              onReset={handleResetFilters}
              isMobileDrawer
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
