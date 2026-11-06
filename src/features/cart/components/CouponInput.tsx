import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CouponInputProps {
  couponCode: string;
  appliedCoupon?: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export function CouponInput({
  couponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponInputProps) {
  const [inputVal, setInputVal] = React.useState(couponCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'NEXUS10' || clean === 'CRYPTO20') {
      onApplyCoupon(clean);
      toast.success(`Cupom ${clean} aplicado com sucesso!`);
    } else {
      toast.error('Cupom inválido. Tente NEXUS10 ou CRYPTO20.');
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">
          <Tag className="h-3.5 w-3.5 text-cyan-400" />
          Cupom Promocional
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">Dica: NEXUS10 ou CRYPTO20</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <Badge variant="success" className="font-mono text-xs">
              {appliedCoupon}
            </Badge>
            <span className="text-xs text-emerald-300">
              {appliedCoupon === 'NEXUS10' ? '10% de desconto' : '20% de desconto'}
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-muted-foreground hover:text-white p-1"
            aria-label="Remover cupom"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            placeholder="Ex: NEXUS10"
            className="h-9 uppercase font-mono text-xs bg-slate-950/70"
          />
          <Button type="submit" variant="outline" size="sm" className="h-9 px-4 text-xs font-bold border-white/10">
            Aplicar
          </Button>
        </form>
      )}
    </div>
  );
}
