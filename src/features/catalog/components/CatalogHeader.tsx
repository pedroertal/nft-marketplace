import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NftSortOption } from '@/types/api';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface CatalogHeaderProps {
  search: string;
  sort: NftSortOption;
  totalResults: number;
  onSearchChange: (value: string) => void;
  onSortChange: (value: NftSortOption) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export function CatalogHeader({
  search,
  sort,
  totalResults,
  onSearchChange,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount,
}: CatalogHeaderProps) {
  const [localSearch, setLocalSearch] = React.useState(search);

  // Sincroniza estado local se a URL mudar externamente (ex: back/forward button)
  React.useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce de busca para a URL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Bar: Search, Mobile Filter Button, Sort Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a796e]" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por obra, criador ou descrição..."
            className="pl-10 pr-9 bg-[#1b130e] border-[#36261b] rounded-xl text-xs text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
            aria-label="Campo de busca de NFTs"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a796e] hover:text-[#f6eee7]"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Row: Mobile Filter Toggle & Sort Select */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenMobileFilters}
            className="relative lg:hidden gap-2 border-[#36261b] bg-[#1d1510] rounded-xl text-xs text-[#f6eee7]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#e07328]" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e07328] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as NftSortOption)}
              className="h-10 w-full sm:w-48 appearance-none rounded-xl border border-[#36261b] bg-[#1d1510] px-3.5 pr-8 text-xs font-medium text-[#f6eee7] focus:outline-none focus:border-[#e07328] cursor-pointer"
              aria-label="Ordenar resultados"
            >
              <option value="newest" className="bg-[#1d1510] text-[#f6eee7]">
                Mais Recentes
              </option>
              <option value="price_asc" className="bg-[#1d1510] text-[#f6eee7]">
                Menor Preço
              </option>
              <option value="price_desc" className="bg-[#1d1510] text-[#f6eee7]">
                Maior Preço
              </option>
              <option value="editions_desc" className="bg-[#1d1510] text-[#f6eee7]">
                Mais Raros
              </option>
              <option value="title_asc" className="bg-[#1d1510] text-[#f6eee7]">
                Nome (A-Z)
              </option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a796e]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Active Search indicator */}
      <div className="flex items-center justify-between text-xs text-[#a49386]">
        <div>
          <span>Exibindo </span>
          <span className="font-bold text-[#f6eee7]">{totalResults}</span>
          <span> {totalResults === 1 ? 'obra encontrada' : 'obras encontradas'}</span>
          {search && (
            <span>
              {' '}
              para &quot;<span className="text-[#e07328] font-medium">{search}</span>&quot;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
