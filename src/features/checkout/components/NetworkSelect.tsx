import { Globe, Zap } from 'lucide-react';

interface NetworkSelectProps {
  selectedNetwork: string;
  onSelectNetwork: (network: string) => void;
}

const NETWORKS = [
  { id: 'Ethereum', name: 'Ethereum (Sepolia)', speed: '~12 seg', icon: '⟠' },
  { id: 'Polygon', name: 'Polygon (Amoy)', speed: '~2 seg', icon: '🟣' },
  { id: 'Arbitrum', name: 'Arbitrum One', speed: '~1 seg', icon: '🔵' },
];

export function NetworkSelect({
  selectedNetwork,
  onSelectNetwork,
}: NetworkSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-cyan-400" />
        Rede de Liquidação
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {NETWORKS.map((net) => {
          const isSelected = selectedNetwork === net.id;
          return (
            <div
              key={net.id}
              onClick={() => onSelectNetwork(net.id)}
              className={`flex flex-col justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-400/10'
                  : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{net.icon}</span>
                <span
                  className={`flex h-2 w-2 rounded-full ${
                    isSelected ? 'bg-cyan-400' : 'bg-slate-700'
                  }`}
                />
              </div>

              <div className="mt-2">
                <p className="text-xs font-bold text-white">{net.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>{net.speed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
