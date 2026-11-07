import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NftCategory } from '@/types/entities';
import { RotateCcw, Filter, Sparkles, Tag } from 'lucide-react';

const CATEGORIES: Array<{ label: string; value: NftCategory | 'All' }> = [
  { label: 'Todas as Categorias', value: 'All' },
  { label: 'Cyberpunk', value: 'Cyberpunk' },
  { label: 'Digital Art', value: 'Digital Art' },
  { label: 'Collectibles', value: 'Collectibles' },
  { label: 'Virtual Worlds', value: 'Virtual Worlds' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Music', value: 'Music' },
];

interface FilterSidebarProps {
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (min: string, max: string) => void;
  onReset: () => void;
  isMobileDrawer?: boolean;
}

export function FilterSidebar({
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onReset,
  isMobileDrawer = false,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = React.useState(minPrice);
  const [localMax, setLocalMax] = React.useState(maxPrice);

  React.useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  React.useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'All') ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  return (
    <aside
      className={`space-y-6 ${
        !isMobileDrawer
          ? 'w-64 shrink-0 rounded-2xl border border-[#36261b] bg-[#1d1510] p-5 h-fit shadow-lg shadow-black/40'
          : 'w-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#36261b] pb-4">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f6eee7]">
          <Filter className="h-4 w-4 text-[#e07328]" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-[11px] text-[#a49386] hover:text-[#f6eee7] gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#a49386] flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-[#e07328]" />
          Categorias
        </span>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              (!selectedCategory && cat.value === 'All') ||
              selectedCategory === cat.value;

            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-[#e07328]/15 text-[#f5a267] border border-[#e07328]/30 font-semibold'
                    : 'text-[#c4b5a8] hover:bg-[#281d16] hover:text-[#f6eee7]'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e07328]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 border-t border-[#36261b] pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#a49386]">
          Faixa de Preço (ETH)
        </span>
        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min-price" className="text-[10px] text-[#8a796e] block mb-1">
                Mínimo
              </label>
              <Input
                id="min-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="h-8 text-xs bg-[#140e0b] border-[#36261b] text-[#f6eee7] placeholder:text-[#8a796e]"
              />
            </div>
            <div>
              <label htmlFor="max-price" className="text-[10px] text-[#8a796e] block mb-1">
                Máximo
              </label>
              <Input
                id="max-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="10.0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="h-8 text-xs bg-[#140e0b] border-[#36261b] text-[#f6eee7] placeholder:text-[#8a796e]"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full text-xs font-semibold bg-[#281d16] hover:bg-[#35251c] border border-[#3e2c20] text-[#f6eee7]"
          >
            Aplicar Preço
          </Button>
        </form>
      </div>

      {/* Curated Collection Note */}
      <div className="rounded-xl bg-[#140e0b]/80 border border-[#36261b] p-3 text-[11px] text-[#a49386] space-y-1">
        <div className="flex items-center gap-1 font-semibold text-[#f6eee7]">
          <Sparkles className="h-3 w-3 text-[#e07328]" />
          <span>Coleção Kurio</span>
        </div>
        <p className="leading-snug">
          Obras selecionadas por curadores da comunidade Web3 com royalties imutáveis.
        </p>
      </div>
    </aside>
  );
}
