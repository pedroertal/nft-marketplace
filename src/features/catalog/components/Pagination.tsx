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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#36261b] pt-6">
      <p className="text-xs text-[#a49386]">
        Página <span className="font-semibold text-[#f6eee7]">{currentPage}</span> de{' '}
        <span className="font-semibold text-[#f6eee7]">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1 border-[#36261b] bg-[#1d1510] text-xs text-[#f6eee7] hover:bg-[#281d16]"
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
                  ? 'bg-[#e07328] text-white hover:bg-[#ea8238]'
                  : 'text-[#a49386] hover:text-[#f6eee7] hover:bg-[#281d16]'
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
          className="gap-1 border-[#36261b] bg-[#1d1510] text-xs text-[#f6eee7] hover:bg-[#281d16]"
          aria-label="Próxima página"
        >
          <span>Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
