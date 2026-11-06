import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
import { Badge } from '@/components/ui/badge';
import { NftCategory } from '@/types/entities';
import { NftSortOption } from '@/types/api';
import { Sparkles, Compass, Flame, ShieldCheck } from 'lucide-react';

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

  const currentSearch = searchParams.search || '';
  const currentCategory = searchParams.category || 'All';
  const currentSort = searchParams.sort || 'newest';
  const currentMinPrice = searchParams.minPrice || '';
  const currentMaxPrice = searchParams.maxPrice || '';
  const currentPage = searchParams.page || 1;

  // Executa consulta consumindo a URL como fonte única da verdade
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

  // Atualiza search params na URL; reseta para página 1 ao alterar filtros
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
          // Limpa chaves vazias ou 'All'
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

  const activeFilterCount =
    (currentCategory && currentCategory !== 'All' ? 1 : 0) +
    (currentMinPrice ? 1 : 0) +
    (currentMaxPrice ? 1 : 0);

  return (
    <div className="container py-8 md:py-12 space-y-10">
      {/* Hero Banner Web3 */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-purple-900/30 via-slate-900/50 to-slate-950/80 p-8 md:p-12 backdrop-blur-xl">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <Badge variant="neon" className="gap-1.5 py-1 px-3 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Marketplace Descentralizado</span>
          </Badge>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-[1.1]">
            Colecione e negocie <span className="gradient-text">ativos digitais raros</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Liquidação instantânea com garantia de idempotência, histórico em blockchain e sincronização em tempo real de lances e estoques.
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Contratos Auditados</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Sem Slippage Oculto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="space-y-6">
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

      {/* Mobile Filters Drawer */}
      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerContent className="px-6 pb-8 max-h-[85vh] overflow-y-auto">
          <DrawerHeader className="border-b border-white/10 pb-4">
            <DrawerTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" />
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
