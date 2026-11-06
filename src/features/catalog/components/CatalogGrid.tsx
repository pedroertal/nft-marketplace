import { NFT } from '@/types/entities';
import { NftCard } from './NftCard';
import { NftCardSkeleton } from './NftCardSkeleton';
import { Button } from '@/components/ui/button';
import { SearchX, AlertTriangle, RotateCcw } from 'lucide-react';

interface CatalogGridProps {
  nfts: NFT[];
  isLoading: boolean;
  isError: boolean;
  onResetFilters: () => void;
  onRetry?: () => void;
}

export function CatalogGrid({
  nfts,
  isLoading,
  isError,
  onResetFilters,
  onRetry,
}: CatalogGridProps) {
  // Estado de Carregamento com Shimmer
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <NftCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Estado de Erro de Rede / API
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 p-12 text-center backdrop-blur-md space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Falha ao carregar catálogo</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Ocorreu um erro ao consultar os colecionáveis. Verifique a conexão com a rede mock.
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="gap-2 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Tentar Novamente
          </Button>
        )}
      </div>
    );
  }

  // Estado Vazio (Nenhum resultado para os filtros)
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-16 text-center backdrop-blur-sm space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <SearchX className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Nenhum NFT encontrado</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Não encontramos colecionáveis correspondentes aos critérios de busca ou filtros aplicados.
          </p>
        </div>
        <Button
          onClick={onResetFilters}
          variant="outline"
          size="sm"
          className="gap-2 text-xs border-white/10 bg-slate-800/80 hover:bg-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
          Redefinir Filtros
        </Button>
      </div>
    );
  }

  // Grid com cards renderizados
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {nfts.map((nft) => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
