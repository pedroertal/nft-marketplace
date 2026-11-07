import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface NetworkSelectProps {
  selectedNetwork: string;
  onSelectNetwork: (network: string) => void;
}

const NETWORKS = [
  { name: 'Ethereum', symbol: 'ETH', fee: '~0.012 ETH', badge: 'Recomendada' },
  { name: 'Polygon', symbol: 'MATIC', fee: '~0.001 ETH', badge: 'Econômica' },
  { name: 'Arbitrum', symbol: 'ARB', fee: '~0.003 ETH', badge: 'L2 Rápida' },
];

export function NetworkSelect({
  selectedNetwork,
  onSelectNetwork,
}: NetworkSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#a49386] flex items-center gap-1.5">
        <Layers className="h-4 w-4 text-[#e07328]" />
        Rede Blockchain para Liquidação
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {NETWORKS.map((net) => {
          const isSelected = selectedNetwork === net.name;

          return (
            <div
              key={net.name}
              onClick={() => onSelectNetwork(net.name)}
              className={`flex flex-col justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#e07328] bg-[#e07328]/10 shadow-sm shadow-black/40'
                  : 'border-[#36261b] bg-[#1d1510] hover:bg-[#261c15]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#f6eee7]">{net.name}</span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-[#e07328]" />
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#8a796e] font-mono">{net.fee}</span>
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 h-4 border-[#3d2c20] text-[#a49386]"
                >
                  {net.badge}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
