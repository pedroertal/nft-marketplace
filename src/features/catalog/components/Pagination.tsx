import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
      <p className="text-xs text-muted-foreground">
        Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
        <span className="font-semibold text-white">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1 border-white/10 bg-slate-900/60 text-xs"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 p-0 text-xs font-semibold ${
                p === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              {p}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="gap-1 border-white/10 bg-slate-900/60 text-xs"
          aria-label="Próxima página"
        >
          <span>Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
