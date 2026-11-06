import * as React from 'react';
import { useWallets } from '../api/useWallets';
import { Web3ConnectModal } from './Web3ConnectModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress, formatEth } from '@/lib/utils';
import { Wallet as WalletIcon, Plus, Copy, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function WalletListCard() {
  const { data: wallets, isLoading } = useWallets();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    toast.success('Endereço copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-purple-400" />
            Carteiras Vinculadas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie suas carteiras Web3 para assinatura de transações e liquidação de NFTs.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="gap-1.5 text-xs font-semibold rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Conectar Carteira
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets && wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                wallet.type === 'PRIMARY'
                  ? 'border-purple-500/40 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                  : 'border-white/10 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={wallet.type === 'PRIMARY' ? 'default' : 'secondary'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {wallet.type === 'PRIMARY' ? 'Principal' : 'Secundária'}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {wallet.network}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs text-white">
                    <span>{formatAddress(wallet.address, 8)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(wallet.address, wallet.id)}
                      className="text-muted-foreground hover:text-white"
                      aria-label="Copiar endereço"
                    >
                      {copiedId === wallet.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    Saldo
                  </span>
                  <p className="font-mono text-sm font-bold text-cyan-300">
                    {formatEth(wallet.balance || '0.0000')} ETH
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Pronta para assinatura</span>
                </div>
                <span>Adicionada em {new Date(wallet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-muted-foreground">
            Nenhuma carteira vinculada no momento.
          </div>
        )}
      </div>

      <Web3ConnectModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
